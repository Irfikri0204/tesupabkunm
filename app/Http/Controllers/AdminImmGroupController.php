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
            'Jenis Kelamin', 'No HP', 'Email', 'Total Skor', 'Kategori Total',
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
        
        $sheet->getStyle('A1:U1')->applyFromArray($headerStyle);
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
            $sheet->setCellValue("J$row", $r->email);
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

    public function profilingReport(Request $request, ImmGroup $imm_group)
    {
        $allResults = $imm_group->results()->get();
        $totalResponses = $allResults->count();

        // 1. Header Information
        $minDate = $allResults->min('created_at');
        $maxDate = $allResults->max('created_at');
        $periodeAsesmen = 'Belum ada data';
        if ($minDate && $maxDate) {
            $formatIndo = function ($dt) {
                $bulan = [1=>'Jan',2=>'Feb',3=>'Mar',4=>'Apr',5=>'Mei',6=>'Jun',7=>'Jul',8=>'Agu',9=>'Sep',10=>'Okt',11=>'Nov',12=>'Des'];
                return $dt->format('d') . ' ' . ($bulan[(int)$dt->format('m')] ?? '') . ' ' . $dt->format('Y');
            };
            $sMin = $formatIndo($minDate);
            $sMax = $formatIndo($maxDate);
            $periodeAsesmen = ($sMin === $sMax) ? $sMin : "$sMin - $sMax";
        }

        $headerInfo = [
            'institusiKlien' => $imm_group->name,
            'periodeAsesmen' => $periodeAsesmen,
            'totalPartisipan' => $totalResponses,
        ];

        // Fetch faculties with prodis
        $faculties = $imm_group->faculties()
            ->with(['prodis' => function ($q) {
                $q->orderBy('name');
            }])
            ->orderBy('name')
            ->get();

        // 2. Bagian 1: Profil Tingkat Fakultas
        // 1.1 Distribusi Pengguna per Fakultas
        $distribusiFakultas = [];
        $totalSkorPartisipan = 0;
        foreach ($faculties as $fac) {
            $fResults = $allResults->filter(function ($r) use ($fac) {
                return $r->imm_faculty_id == $fac->id || strcasecmp(trim($r->fakultas ?? ''), trim($fac->name)) === 0;
            });
            $count = $fResults->count();
            $totalSkorPartisipan += $count;
            $pct = $totalResponses > 0 ? round(($count / $totalResponses) * 100, 1) : 0;
            $distribusiFakultas[] = [
                'id' => $fac->id,
                'nama' => $fac->name,
                'total_partisipan' => $count,
                'persentase' => number_format($pct, 1, ',', '.') . '%',
                'pct_raw' => $pct,
            ];
        }

        // 1.2 Peta Masalah Dominan per Fakultas
        $petaMasalahDominan = [];
        foreach ($faculties as $fac) {
            $fResults = $allResults->filter(function ($r) use ($fac) {
                return $r->imm_faculty_id == $fac->id || strcasecmp(trim($r->fakultas ?? ''), trim($fac->name)) === 0;
            });

            if ($fResults->isEmpty()) {
                $petaMasalahDominan[] = [
                    'id' => $fac->id,
                    'nama' => $fac->name,
                    'masalah_dominan' => '-',
                    'skor_rata_rata' => '0,0',
                ];
                continue;
            }

            $scaled = [
                'Pribadi' => ($fResults->avg('skor_pribadi') / 45) * 100,
                'Sosial' => ($fResults->avg('skor_sosial') / 45) * 100,
                'Belajar' => ($fResults->avg('skor_belajar') / 45) * 100,
                'Karier' => ($fResults->avg('skor_karier') / 45) * 100,
                'Lainnya' => ($fResults->avg('skor_lainnya') / 45) * 100,
            ];
            arsort($scaled);
            $topDom = array_key_first($scaled);
            $topVal = $scaled[$topDom];

            $petaMasalahDominan[] = [
                'id' => $fac->id,
                'nama' => $fac->name,
                'masalah_dominan' => $topDom,
                'skor_rata_rata' => number_format(round($topVal, 1), 1, ',', '.'),
            ];
        }

        // 3. Bagian 2: Profil Tingkat Program Studi
        $indicatorNames = [
            'P1' => 'Kesehatan Fisik', 'P2' => 'Perasaan & Kecemasan', 'P3' => 'Kepercayaan Diri', 'P4' => 'Spiritual & Makna Hidup', 'P5' => 'Keselamatan Diri',
            'S1' => 'Pergaulan', 'S2' => 'Pertemanan & Penyesuaian', 'S3' => 'Hubungan Keluarga', 'S4' => 'Perundungan & Kekerasan', 'S5' => 'Organisasi & Kampus',
            'B1' => 'Pengaturan Waktu', 'B2' => 'Semangat & Cara Belajar', 'B3' => 'Nilai & Ujian', 'B4' => 'Risiko Putus Kuliah', 'B5' => 'Kejujuran Akademik',
            'K1' => 'Mengenal Diri & Jurusan', 'K2' => 'Rencana Studi', 'K3' => 'Pilihan Karier', 'K4' => 'Kesiapan Kerja', 'K5' => 'Pekerjaan & Masa Depan',
            'R1' => 'Gawai & Digital', 'R2' => 'Judi & Pinjol', 'R3' => 'Keuangan', 'R4' => 'Narkoba & Rokok', 'R5' => 'Seksualitas & Identitas'
        ];
        $indicatorItems = [
            'P1' => [1,2,3], 'P2' => [4,5,6], 'P3' => [7,8,9], 'P4' => [10,11,12], 'P5' => [13,14,15],
            'S1' => [16,17,18], 'S2' => [19,20,21], 'S3' => [22,23,24], 'S4' => [25,26,27], 'S5' => [28,29,30],
            'B1' => [31,32,33], 'B2' => [34,35,36], 'B3' => [37,38,39], 'B4' => [40,41,42], 'B5' => [43,44,45],
            'K1' => [46,47,48], 'K2' => [49,50,51], 'K3' => [52,53,54], 'K4' => [55,56,57], 'K5' => [58,59,60],
            'R1' => [61,62,63], 'R2' => [64,65,66], 'R3' => [67,68,69], 'R4' => [70,71,72], 'R5' => [73,74,75]
        ];

        $rincianFakultas = [];
        foreach ($faculties as $fac) {
            $prodisData = [];
            foreach ($fac->prodis as $prodi) {
                $pResults = $allResults->filter(function ($r) use ($fac, $prodi) {
                    $matchFac = ($r->imm_faculty_id == $fac->id || strcasecmp(trim($r->fakultas ?? ''), trim($fac->name)) === 0);
                    $matchProdi = ($r->imm_prodi_id == $prodi->id || strcasecmp(trim($r->program_studi ?? ''), trim($prodi->name)) === 0);
                    return $matchFac && $matchProdi;
                });
                $pCount = $pResults->count();

                if ($pCount === 0) {
                    $prodisData[] = [
                        'id' => $prodi->id,
                        'nama' => $prodi->name,
                        'total_partisipan' => 0,
                        'masalah_dominan' => '-',
                        'prioritas' => 'Low',
                    ];
                    continue;
                }

                // Compute dominant domain
                $domScaled = [
                    'Pribadi' => ($pResults->avg('skor_pribadi') / 45) * 100,
                    'Sosial' => ($pResults->avg('skor_sosial') / 45) * 100,
                    'Belajar' => ($pResults->avg('skor_belajar') / 45) * 100,
                    'Karier' => ($pResults->avg('skor_karier') / 45) * 100,
                    'Lainnya' => ($pResults->avg('skor_lainnya') / 45) * 100,
                ];
                arsort($domScaled);
                $topDom = array_key_first($domScaled);

                // Compute dominant indicator
                $indSums = [];
                $indCounts = [];
                foreach ($pResults as $r) {
                    if (!empty($r->answers) && is_array($r->answers)) {
                        foreach ($indicatorItems as $code => $items) {
                            $sum = 0;
                            foreach ($items as $it) {
                                $sum += $r->answers[$it] ?? $r->answers[(string)$it] ?? 0;
                            }
                            $indSums[$code] = ($indSums[$code] ?? 0) + $sum;
                            $indCounts[$code] = ($indCounts[$code] ?? 0) + 1;
                        }
                    }
                }

                $dominantText = "Bidang $topDom";
                if (!empty($indSums)) {
                    $indAvgs = [];
                    foreach ($indSums as $code => $total) {
                        $indAvgs[$code] = $total / max(1, $indCounts[$code]);
                    }
                    arsort($indAvgs);
                    $topCode = array_key_first($indAvgs);
                    $dominantText = $indicatorNames[$topCode] . " ($topDom)";
                }

                // Prioritas Penanganan:
                $highRiskCount = $pResults->filter(function ($r) {
                    $c = $r->dropout_risk_classification;
                    $tc = $r->total_classification;
                    return in_array($c, ['Risiko tinggi', 'Tinggi']) || in_array($tc, ['Perlu Bantuan', 'Perlu Pendampingan', 'Perlu Bantuan Segera']);
                })->count();

                $highPct = ($highRiskCount / $pCount) * 100;
                $avgScaled = ($pResults->avg('total_score') / 225) * 100;

                if ($highPct >= 20 || $avgScaled >= 50) {
                    $prioritas = 'High';
                } elseif ($highPct >= 10 || $avgScaled >= 35) {
                    $prioritas = 'Medium';
                } else {
                    $prioritas = 'Low';
                }

                $prodisData[] = [
                    'id' => $prodi->id,
                    'nama' => $prodi->name,
                    'total_partisipan' => $pCount,
                    'masalah_dominan' => $dominantText,
                    'prioritas' => $prioritas,
                ];
            }

            $rincianFakultas[] = [
                'id' => $fac->id,
                'nama' => $fac->name,
                'prodis' => $prodisData,
            ];
        }

        // Helper for Angkatan detection
        $getAngkatan = function ($r) {
            if (!empty($r->nim) && preg_match('/^(\d{2})/', trim($r->nim), $m)) {
                $val = (int)$m[1];
                if ($val >= 15 && $val <= 35) {
                    return '20' . str_pad($val, 2, '0', STR_PAD_LEFT);
                }
            }
            if (!empty($r->semester)) {
                $sem = (int) filter_var($r->semester, FILTER_SANITIZE_NUMBER_INT);
                $year = (int) ($r->created_at ? $r->created_at->format('Y') : date('Y'));
                if ($sem > 0) {
                    return (string) ($year - (int)floor(($sem - 1) / 2));
                }
            }
            return (string) ($r->created_at ? $r->created_at->format('Y') : date('Y'));
        };

        // 4. Bagian 3: Identitas dan Skor Individu (Per Prodi)
        $rekapitulasiIndividu = [];
        foreach ($faculties as $fac) {
            foreach ($fac->prodis as $prodi) {
                $pResults = $allResults->filter(function ($r) use ($fac, $prodi) {
                    $matchFac = ($r->imm_faculty_id == $fac->id || strcasecmp(trim($r->fakultas ?? ''), trim($fac->name)) === 0);
                    $matchProdi = ($r->imm_prodi_id == $prodi->id || strcasecmp(trim($r->program_studi ?? ''), trim($prodi->name)) === 0);
                    return $matchFac && $matchProdi;
                })->sortBy('nama')->values();

                if ($pResults->isEmpty()) {
                    continue;
                }

                $students = [];
                foreach ($pResults as $idx => $r) {
                    $jk = '-';
                    if (!empty($r->jenis_kelamin)) {
                        $jkLower = strtolower(trim($r->jenis_kelamin));
                        if ($jkLower === 'laki-laki' || $jkLower === 'l' || $jkLower === 'pria') {
                            $jk = 'L';
                        } elseif ($jkLower === 'perempuan' || $jkLower === 'p' || $jkLower === 'wanita') {
                            $jk = 'P';
                        } else {
                            $jk = substr($r->jenis_kelamin, 0, 1);
                        }
                    }

                    $riskClass = $r->dropout_risk_classification;
                    $statusRisiko = 'Rendah';
                    if (in_array($riskClass, ['Risiko tinggi', 'Tinggi'])) {
                        $statusRisiko = 'Tinggi';
                    } elseif (in_array($riskClass, ['Risiko sedang', 'Sedang'])) {
                        $statusRisiko = 'Sedang';
                    }

                    $students[] = [
                        'no' => $idx + 1,
                        'nim' => $r->nim ?? '-',
                        'nama' => $r->nama,
                        'jk' => $jk,
                        'angkatan' => $getAngkatan($r),
                        'skor_pribadi' => (int) round(($r->skor_pribadi / 45) * 100),
                        'skor_sosial' => (int) round(($r->skor_sosial / 45) * 100),
                        'skor_belajar' => (int) round(($r->skor_belajar / 45) * 100),
                        'skor_karier' => (int) round(($r->skor_karier / 45) * 100),
                        'skor_lainnya' => (int) round(($r->skor_lainnya / 45) * 100),
                        'status_risiko' => $statusRisiko,
                    ];
                }

                $rekapitulasiIndividu[] = [
                    'prodi_id' => $prodi->id,
                    'prodi_nama' => $prodi->name,
                    'fakultas_nama' => $fac->name,
                    'total_mahasiswa' => count($students),
                    'students' => $students,
                ];
            }
        }

        // Fallback for students whose prodi is not in predefined list
        $unassignedResults = $allResults->filter(function ($r) use ($rekapitulasiIndividu) {
            $prodiNames = array_column($rekapitulasiIndividu, 'prodi_nama');
            return !in_array($r->program_studi, $prodiNames) && !empty($r->program_studi);
        })->groupBy('program_studi');

        foreach ($unassignedResults as $pName => $uResults) {
            $students = [];
            foreach ($uResults->sortBy('nama')->values() as $idx => $r) {
                $jk = '-';
                if (!empty($r->jenis_kelamin)) {
                    $jkLower = strtolower(trim($r->jenis_kelamin));
                    if ($jkLower === 'laki-laki' || $jkLower === 'l') $jk = 'L';
                    elseif ($jkLower === 'perempuan' || $jkLower === 'p') $jk = 'P';
                    else $jk = substr($r->jenis_kelamin, 0, 1);
                }

                $riskClass = $r->dropout_risk_classification;
                $statusRisiko = 'Rendah';
                if (in_array($riskClass, ['Risiko tinggi', 'Tinggi'])) $statusRisiko = 'Tinggi';
                elseif (in_array($riskClass, ['Risiko sedang', 'Sedang'])) $statusRisiko = 'Sedang';

                $students[] = [
                    'no' => $idx + 1,
                    'nim' => $r->nim ?? '-',
                    'nama' => $r->nama,
                    'jk' => $jk,
                    'angkatan' => $getAngkatan($r),
                    'skor_pribadi' => (int) round(($r->skor_pribadi / 45) * 100),
                    'skor_sosial' => (int) round(($r->skor_sosial / 45) * 100),
                    'skor_belajar' => (int) round(($r->skor_belajar / 45) * 100),
                    'skor_karier' => (int) round(($r->skor_karier / 45) * 100),
                    'skor_lainnya' => (int) round(($r->skor_lainnya / 45) * 100),
                    'status_risiko' => $statusRisiko,
                ];
            }

            $rekapitulasiIndividu[] = [
                'prodi_id' => null,
                'prodi_nama' => $pName,
                'fakultas_nama' => $uResults->first()->fakultas ?? '-',
                'total_mahasiswa' => count($students),
                'students' => $students,
            ];
        }

        // 5. Bagian 4: Analisis Aspek Terbidang Tertinggi
        $getSaran = function ($bidang, $score) {
            if ($score >= 67) {
                return match (strtolower($bidang)) {
                    'pribadi' => 'Indikasi kecemasan & beban emosional tinggi. Direkomendasikan Konseling Individual & Pelatihan Regulasi Emosi.',
                    'belajar' => 'Gejala stres akademik & kejenuhan belajar tinggi. Perlu pendampingan Konseling Akademik & Manajemen Waktu.',
                    'sosial' => 'Indikasi kesulitan penyesuaian sosial & relasi keluarga. Direkomendasikan Konseling Interpersonal & Dukungan Teman Sebaya.',
                    'karier' => 'Indikasi keraguan jurusan & kecemasan masa depan kerja tinggi. Direkomendasikan Konseling Minat Bakat & Bimbingan Karier.',
                    'lainnya' => 'Indikasi tekanan finansial / kebiasaan berisiko tinggi. Perlu intervensi konseling & pendampingan intensif.',
                    default => 'Perlu intervensi konseling dan pendampingan intensif segera.',
                };
            } elseif ($score >= 34) {
                return match (strtolower($bidang)) {
                    'pribadi' => 'Gejala ketegangan emosi sedang. Disarankan bimbingan kelompok dan relaksasi berkala.',
                    'belajar' => 'Perlu peningkatan strategi belajar dan motivasi. Disarankan workshop metode belajar efektif.',
                    'sosial' => 'Perlu penguatan interaksi sosial dan komunikasi interpersonal di lingkungan kampus.',
                    'karier' => 'Perlu eksplorasi karier dan perencanaan studi bersama pembimbing akademik.',
                    'lainnya' => 'Perlu pemantauan kebiasaan penggunaan gawai dan literasi keuangan mandiri.',
                    default => 'Disarankan bimbingan berkala dan pemantauan mandiri.',
                };
            } else {
                return match (strtolower($bidang)) {
                    'pribadi' => 'Kondisi emosi stabil dan terpelihara baik. Pertahankan pola hidup sehat dan relaksasi.',
                    'belajar' => 'Aktivitas belajar baik dan teratur. Pertahankan kedisiplinan dan target akademik.',
                    'sosial' => 'Hubungan sosial harmonis. Pertahankan komunikasi dan jejaring pertemanan positif.',
                    'karier' => 'Arah studi dan masa depan terarah dengan baik. Terus kembangkan kompetensi diri.',
                    'lainnya' => 'Perilaku adaptif dan terkendali. Pertahankan gaya hidup positif.',
                    default => 'Kondisi terpelihara baik. Lanjutkan pengembangan diri secara konsisten.',
                };
            }
        };

        $domainKeys = [
            'pribadi' => 'Pribadi',
            'sosial' => 'Sosial',
            'belajar' => 'Belajar',
            'karier' => 'Karier',
            'lainnya' => 'Lainnya',
        ];

        $analisisTerbidang = [];
        foreach ($domainKeys as $key => $label) {
            $field = "skor_$key";
            $sorted = $allResults->sortByDesc($field)->values();
            $items = [];
            foreach ($sorted as $r) {
                $scaled = (int) round(($r->$field / 45) * 100);
                $items[] = [
                    'nama' => $r->nama,
                    'nim' => $r->nim ?? '-',
                    'prodi' => $r->program_studi ?? '-',
                    'skor' => $scaled,
                    'raw_skor' => $r->$field,
                    'keterangan' => $getSaran($key, $scaled),
                ];
            }
            $analisisTerbidang[$key] = [
                'bidang' => $label,
                'items' => $items,
            ];
        }

        return Inertia::render('Admin/IMM/Groups/ProfilingReport', [
            'group' => $imm_group,
            'headerInfo' => $headerInfo,
            'distribusiFakultas' => $distribusiFakultas,
            'totalSkorPartisipan' => $totalSkorPartisipan,
            'petaMasalahDominan' => $petaMasalahDominan,
            'rincianFakultas' => $rincianFakultas,
            'rekapitulasiIndividu' => $rekapitulasiIndividu,
            'analisisTerbidang' => $analisisTerbidang,
        ]);
    }
}
