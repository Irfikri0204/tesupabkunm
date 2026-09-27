<?php

namespace App\Http\Controllers;

use App\Models\KecerdasanMajemuk;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

class AdminKecerdasanMajemukController extends Controller
{
    public function index(Request $request)
    {
        $query = KecerdasanMajemuk::latest();
        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(fn($b) => $b->where('nama', 'like', "%$q%")->orWhere('kelas', 'like', "%$q%")->orWhere('asal_sekolah', 'like', "%$q%")->orWhere('kode_acak', 'like', "%$q%"));
        }
        $data = $query->paginate(15)->withQueryString();
        return Inertia::render('Admin/KecerdasanMajemuk/Index', ['data' => $data, 'filters' => $request->only('search')]);
    }

    public function show($id)
    {
        $data = KecerdasanMajemuk::findOrFail($id);
        return Inertia::render('Admin/KecerdasanMajemuk/Show', ['data' => $data]);
    }

    public function destroy($id)
    {
        KecerdasanMajemuk::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Data berhasil dihapus');
    }

    public function export()
    {
        $records = KecerdasanMajemuk::latest()->get();
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Kecerdasan Majemuk');

        $cats = ['Linguistik','Logis-Matematis','Spasial-Visual','Musikal','Kinestetik-Jasmani','Interpersonal','Intrapersonal','Naturalis'];
        $headers = array_merge(['No','ID','Kode','Nama','Kecerdasan Dominan','Kelas','Asal Sekolah'], $cats, ['Dibuat Pada']);
        
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF'], 'size' => 11],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF4F46E5']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FFC7D2FE']]],
        ];

        $lastCol = chr(64 + count($headers));
        foreach ($headers as $col => $header) $sheet->setCellValue(chr(65 + $col) . '1', $header);
        $sheet->getStyle("A1:{$lastCol}1")->applyFromArray($headerStyle);
        $sheet->getRowDimension(1)->setRowHeight(22);

        foreach ($records as $i => $r) {
            $row = $i + 2;
            $bg = $i % 2 === 0 ? 'FFEEF2FF' : 'FFFFFFFF';
            $skor = $r->skor_per_kategori ?? [];
            $dominant = $r->top_categories[0] ?? '-';
            
            $values = [$i + 1, $r->id, $r->kode_acak, $r->nama, $dominant, $r->kelas, $r->asal_sekolah];
            foreach ($cats as $cat) {
                $val = $skor[$cat] ?? null;
                $values[] = is_array($val) ? ($val['skor'] ?? '') : ($val ?? '');
            }
            $values[] = $r->created_at?->format('d/m/Y H:i');

            foreach ($values as $col => $val) $sheet->setCellValue(chr(65 + $col) . $row, $val);
            $sheet->getStyle("A{$row}:{$lastCol}{$row}")->applyFromArray([
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => $bg]],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FFC7D2FE']]],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            ]);
        }

        foreach (range('A', $lastCol) as $c) $sheet->getColumnDimension($c)->setAutoSize(true);

        $filename = 'kecerdasan_majemuk_' . now()->format('Ymd_His') . '.xlsx';
        $writer = new Xlsx($spreadsheet);
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header("Content-Disposition: attachment; filename=\"$filename\"");
        header('Cache-Control: max-age=0');
        $writer->save('php://output');
        exit;
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids', []);
        KecerdasanMajemuk::whereIn('id', $ids)->delete();
        return redirect()->back()->with('success', count($ids) . ' data berhasil dihapus.');
    }
}
