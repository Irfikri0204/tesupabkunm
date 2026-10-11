<?php

namespace App\Http\Controllers;

use App\Models\ImmGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AdminImmGroupController extends Controller
{
    public function index()
    {
        $groups = ImmGroup::withCount('results')->latest()->get();
        return Inertia::render('Admin/IMM/Groups/Index', [
            'groups' => $groups
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $slug = Str::slug($request->name);
        // Ensure unique slug
        if (ImmGroup::where('slug', $slug)->exists()) {
            $slug = $slug . '-' . uniqid();
        }

        ImmGroup::create([
            'name' => $request->name,
            'slug' => $slug,
            'description' => $request->description,
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Kelompok Data berhasil dibuat.');
    }

    public function update(Request $request, ImmGroup $imm_group)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        $imm_group->update($request->only('name', 'description', 'is_active'));
        return redirect()->back()->with('success', 'Kelompok Data berhasil diupdate.');
    }

    public function destroy(ImmGroup $imm_group)
    {
        $imm_group->delete();
        return redirect()->back()->with('success', 'Kelompok Data berhasil dihapus.');
    }

    public function show(Request $request, ImmGroup $imm_group)
    {
        // Aggregate data for the dashboard
        $totalResponses = $imm_group->results()->count();
        
        $classificationCounts = $imm_group->results()
            ->select('total_classification', \DB::raw('count(*) as count'))
            ->groupBy('total_classification')
            ->pluck('count', 'total_classification')
            ->toArray();

        $dropoutCounts = $imm_group->results()
            ->select('dropout_risk_classification', \DB::raw('count(*) as count'))
            ->groupBy('dropout_risk_classification')
            ->pluck('count', 'dropout_risk_classification')
            ->toArray();

        // Averages
        $averages = $imm_group->results()
            ->selectRaw('
                AVG(skor_pribadi) as avg_pribadi,
                AVG(skor_sosial) as avg_sosial,
                AVG(skor_belajar) as avg_belajar,
                AVG(skor_karier) as avg_karier,
                AVG(skor_lainnya) as avg_lainnya
            ')->first();

        // Fetch faculties with prodis and result counts
        $faculties = $imm_group->faculties()
            ->withCount('results')
            ->with(['prodis' => function ($query) {
                $query->withCount('results')->latest();
            }])
            ->latest()
            ->get();

        // Compute Detailed Stats per Faculty AND per Prodi
        $facultyStats = [];
        foreach ($faculties as $faculty) {
            $facResults = $faculty->results()->select('skor_pribadi', 'skor_sosial', 'skor_belajar', 'skor_karier', 'skor_lainnya', 'dropout_risk_classification')->get();
            $facultyStats[$faculty->id] = [
                'bidang' => self::computeBidangStats($facResults),
                'dropout' => self::computeDropoutStats($facResults),
                'prodis' => [],
            ];
            // Per-prodi stats
            foreach ($faculty->prodis as $prodi) {
                $prodiResults = \App\Models\ImmResult::where('imm_prodi_id', $prodi->id)
                    ->select('skor_pribadi', 'skor_sosial', 'skor_belajar', 'skor_karier', 'skor_lainnya', 'dropout_risk_classification')
                    ->get();
                $facultyStats[$faculty->id]['prodis'][$prodi->id] = [
                    'bidang' => self::computeBidangStats($prodiResults),
                    'dropout' => self::computeDropoutStats($prodiResults),
                ];
            }
        }

        // Paginated Students Data
        $query = $imm_group->results()->latest();
        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(fn($b) => $b->where('nama', 'like', "%$q%")
                ->orWhere('nim', 'like', "%$q%")
                ->orWhere('fakultas', 'like', "%$q%")
                ->orWhere('conclusion', 'like', "%$q%"));
        }
        $students = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/IMM/Groups/Show', [
            'group' => $imm_group,
            'faculties' => $faculties,
            'facultyStats' => $facultyStats,
            'totalResponses' => $totalResponses,
            'classificationCounts' => $classificationCounts,
            'dropoutCounts' => $dropoutCounts,
            'averages' => $averages,
            'students' => $students,
            'filters' => $request->only('search')
        ]);
    }

    public function export(Request $request, ImmGroup $imm_group)
    {
        $facultyId = $request->query('faculty_id');
        
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $spreadsheet->removeSheetByIndex(0); // Remove default sheet

        $faculties = $imm_group->faculties()->with('results')->get();

        if ($facultyId && $facultyId !== 'all') {
            $faculties = $faculties->where('id', $facultyId);
        }

        if ($faculties->isEmpty()) {
            // Create empty sheet if no faculties
            $sheet = $spreadsheet->createSheet();
            $sheet->setTitle('Data IMM');
            $this->buildExcelSheet($sheet, $imm_group->results()->get());
        } else {
            foreach ($faculties as $faculty) {
                // Sheet title must be <= 31 chars and no illegal characters
                $title = substr(str_replace(['*', ':', '/', '\\', '?', '[', ']'], '', $faculty->name), 0, 31);
                $sheet = $spreadsheet->createSheet();
                $sheet->setTitle($title);
                $this->buildExcelSheet($sheet, $faculty->results);
            }
        }

        $spreadsheet->setActiveSheetIndex(0);

        $filename = 'Laporan_IMM_' . Str::slug($imm_group->name) . '_' . now()->format('Ymd_His') . '.xlsx';
        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header("Content-Disposition: attachment; filename=\"$filename\"");
        header('Cache-Control: max-age=0');
        $writer->save('php://output');
        exit;
    }

    private function buildExcelSheet($sheet, $records)
    {
        $headers = [
            'No', 'ID', 'Nama', 'NIM', 'Fakultas', 'Prodi', 'Semester',
            'Jenis Kelamin', 'No HP', 'Total Skor', 'Kategori Total',
            'Kesimpulan', 'Skor Putus Kuliah', 'Status Putus Kuliah',
            'Skor Pribadi', 'Skor Sosial', 'Skor Belajar', 'Skor Karier', 'Skor Lainnya',
            'Tanggal Tes'
        ];
        
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF'], 'size' => 11],
            'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF8B5CF6']], // Purple-500
            'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER, 'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN, 'color' => ['argb' => 'FFC4B5FD']]],
        ];

        foreach ($headers as $col => $header) {
            $sheet->setCellValue(chr(65 + $col) . '1', $header);
        }
        
        $sheet->getStyle('A1:T1')->applyFromArray($headerStyle);
        $sheet->getRowDimension(1)->setRowHeight(22);

        foreach ($records as $i => $r) {
            $row = $i + 2;
            $bg = $i % 2 === 0 ? 'FFF5F3FF' : 'FFFFFFFF'; // Purple-50 for zebra crossing
            
            $sheet->setCellValue("A$row", $i + 1);
            $sheet->setCellValue("B$row", $r->id);
            $sheet->setCellValue("C$row", $r->nama);
            $sheet->setCellValue("D$row", $r->nim);
            $sheet->setCellValue("E$row", $r->fakultas);
            $sheet->setCellValue("F$row", $r->program_studi);
            $sheet->setCellValue("G$row", $r->semester);
            $sheet->setCellValue("H$row", $r->jenis_kelamin);
            $sheet->setCellValue("I$row", $r->nomor_hp);
            $sheet->setCellValue("J$row", $r->total_score);
            $sheet->setCellValue("K$row", $r->total_classification);
            $sheet->setCellValue("L$row", $r->conclusion);
            $sheet->setCellValue("M$row", $r->dropout_risk_score);
            $sheet->setCellValue("N$row", $r->dropout_risk_classification);
            $sheet->setCellValue("O$row", $r->skor_pribadi);
            $sheet->setCellValue("P$row", $r->skor_sosial);
            $sheet->setCellValue("Q$row", $r->skor_belajar);
            $sheet->setCellValue("R$row", $r->skor_karier);
            $sheet->setCellValue("S$row", $r->skor_lainnya);
            $sheet->setCellValue("T$row", $r->created_at?->format('d/m/Y H:i'));
            
            $sheet->getStyle("A$row:T$row")->applyFromArray([
                'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => $bg]],
                'borders' => ['allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN, 'color' => ['argb' => 'FFC4B5FD']]],
                'alignment' => ['vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER],
            ]);
        }

        foreach (range('A', 'T') as $c) {
            $sheet->getColumnDimension($c)->setAutoSize(true);
        }
    }

    public static function computeBidangStats($results)
    {
        $stats = [
            'Pribadi' => ['Baik' => 0, 'Perhatian' => 0, 'Pendampingan' => 0],
            'Sosial' => ['Baik' => 0, 'Perhatian' => 0, 'Pendampingan' => 0],
            'Belajar' => ['Baik' => 0, 'Perhatian' => 0, 'Pendampingan' => 0],
            'Karier' => ['Baik' => 0, 'Perhatian' => 0, 'Pendampingan' => 0],
            'Lainnya' => ['Baik' => 0, 'Perhatian' => 0, 'Pendampingan' => 0],
        ];
        $fields = ['Pribadi' => 'skor_pribadi', 'Sosial' => 'skor_sosial', 'Belajar' => 'skor_belajar', 'Karier' => 'skor_karier', 'Lainnya' => 'skor_lainnya'];
        foreach ($results as $res) {
            foreach ($fields as $key => $col) {
                $score = $res->$col;
                if ($score <= 15) {
                    $stats[$key]['Baik']++;
                } elseif ($score <= 30) {
                    $stats[$key]['Perhatian']++;
                } else {
                    $stats[$key]['Pendampingan']++;
                }
            }
        }
        return $stats;
    }

    public static function computeDropoutStats($results)
    {
        $stats = [
            'Risiko rendah' => 0,
            'Risiko sedang' => 0,
            'Risiko tinggi' => 0,
        ];
        foreach ($results as $res) {
            $class = $res->dropout_risk_classification;
            if ($class === 'Aman' || $class === 'Risiko rendah' || $class === 'Rendah') {
                $stats['Risiko rendah']++;
            } elseif ($class === 'Risiko sedang' || $class === 'Sedang') {
                $stats['Risiko sedang']++;
            } else {
                $stats['Risiko tinggi']++;
            }
        }
        return $stats;
    }
}
