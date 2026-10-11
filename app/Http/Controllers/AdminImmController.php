<?php

namespace App\Http\Controllers;

use App\Models\ImmResult;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

class AdminImmController extends Controller
{
    public function index(Request $request)
    {
        $query = ImmResult::with('group')->latest();
        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(fn($b) => $b->where('nama', 'like', "%$q%")
                ->orWhere('nim', 'like', "%$q%")
                ->orWhere('fakultas', 'like', "%$q%")
                ->orWhere('conclusion', 'like', "%$q%"));
        }
        if ($request->filled('group')) {
            $query->where('imm_group_id', $request->group);
        }
        $data = $query->paginate(15)->withQueryString();
        
        $groups = \App\Models\ImmGroup::orderBy('name')->get();

        return Inertia::render('Admin/IMM/Index', [
            'data' => $data,
            'groups' => $groups,
            'filters' => $request->only('search', 'group')
        ]);
    }

    public function show($id)
    {
        $data = ImmResult::findOrFail($id);
        return Inertia::render('Admin/IMM/Show', ['data' => $data]);
    }

    public function destroy($id)
    {
        ImmResult::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Data berhasil dihapus');
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids', []);
        if (!empty($ids)) {
            ImmResult::whereIn('id', $ids)->delete();
        }
        return redirect()->back()->with('success', count($ids) . ' data berhasil dihapus.');
    }

    public function clearAll(Request $request)
    {
        $query = ImmResult::query();
        if ($request->filled('group_id')) {
            $query->where('imm_group_id', $request->group_id);
        }
        $count = $query->count();
        $query->delete();
        return redirect()->back()->with('success', "Seluruh data ($count data) berhasil dihapus.");
    }

    public function export(Request $request)
    {
        $query = ImmResult::with('group')->latest();
        if ($request->filled('group')) {
            $query->where('imm_group_id', $request->group);
        }
        $records = $query->get();
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Data IMM');

        $headers = [
            'No', 'ID', 'Kampus / Kelompok', 'Nama', 'NIM', 'Fakultas', 'Prodi', 'Semester',
            'Jenis Kelamin', 'No HP', 'Total Skor', 'Kategori Total',
            'Kesimpulan', 'Skor Putus Kuliah', 'Status Putus Kuliah',
            'Skor Pribadi', 'Skor Sosial', 'Skor Belajar', 'Skor Karier', 'Skor Lainnya',
            'Tanggal Tes'
        ];
        
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF'], 'size' => 11],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF8B5CF6']], // Purple-500
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FFC4B5FD']]],
        ];

        foreach ($headers as $col => $header) {
            // Support more than 26 columns if needed, but here we have < 26.
            $sheet->setCellValue(chr(65 + $col) . '1', $header);
        }
        
        $sheet->getStyle('A1:U1')->applyFromArray($headerStyle);
        $sheet->getRowDimension(1)->setRowHeight(22);

        foreach ($records as $i => $r) {
            $row = $i + 2;
            $bg = $i % 2 === 0 ? 'FFF5F3FF' : 'FFFFFFFF'; // Purple-50 for zebra crossing
            
            $sheet->setCellValue("A$row", $i + 1);
            $sheet->setCellValue("B$row", $r->id);
            $sheet->setCellValue("C$row", $r->group ? $r->group->name : '-');
            $sheet->setCellValue("D$row", $r->nama);
            $sheet->setCellValue("E$row", $r->nim);
            $sheet->setCellValue("F$row", $r->fakultas);
            $sheet->setCellValue("G$row", $r->program_studi);
            $sheet->setCellValue("H$row", $r->semester);
            $sheet->setCellValue("I$row", $r->jenis_kelamin);
            $sheet->setCellValue("J$row", $r->nomor_hp);
            $sheet->setCellValue("K$row", $r->total_score);
            $sheet->setCellValue("L$row", $r->total_classification);
            $sheet->setCellValue("M$row", $r->conclusion);
            $sheet->setCellValue("N$row", $r->dropout_risk_score);
            $sheet->setCellValue("O$row", $r->dropout_risk_classification);
            $sheet->setCellValue("P$row", $r->skor_pribadi);
            $sheet->setCellValue("Q$row", $r->skor_sosial);
            $sheet->setCellValue("R$row", $r->skor_belajar);
            $sheet->setCellValue("S$row", $r->skor_karier);
            $sheet->setCellValue("T$row", $r->skor_lainnya);
            $sheet->setCellValue("U$row", $r->created_at?->format('d/m/Y H:i'));
            
            $sheet->getStyle("A$row:U$row")->applyFromArray([
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => $bg]],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FFC4B5FD']]],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            ]);
        }

        foreach (range('A', 'U') as $c) {
            $sheet->getColumnDimension($c)->setAutoSize(true);
        }

        $filename = 'imm_data_' . now()->format('Ymd_His') . '.xlsx';
        $writer = new Xlsx($spreadsheet);
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header("Content-Disposition: attachment; filename=\"$filename\"");
        header('Cache-Control: max-age=0');
        $writer->save('php://output');
        exit;
    }
}
