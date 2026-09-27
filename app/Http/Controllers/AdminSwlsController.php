<?php

namespace App\Http\Controllers;

use App\Models\Swls;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

class AdminSwlsController extends Controller
{
    public function index(Request $request)
    {
        $query = Swls::latest();
        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(fn($b) => $b->where('nama', 'like', "%$q%")->orWhere('kategori', 'like', "%$q%")->orWhere('jenis_kelamin', 'like', "%$q%"));
        }
        $data = $query->paginate(15)->withQueryString();
        return Inertia::render('Admin/Swls/Index', ['data' => $data, 'filters' => $request->only('search')]);
    }

    public function show($id)
    {
        $data = Swls::findOrFail($id);
        return Inertia::render('Admin/Swls/Show', ['data' => $data]);
    }

    public function destroy($id)
    {
        Swls::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Data berhasil dihapus');
    }

    public function export()
    {
        $records = Swls::latest()->get();
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('SWLS');

        $headers = ['No', 'ID', 'Nama', 'Tanggal Lahir', 'Jenis Kelamin', 'Total Skor', 'Kategori', 'Dibuat Pada'];
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF'], 'size' => 11],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF2563EB']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FFBFDBFE']]],
        ];

        foreach ($headers as $col => $header) $sheet->setCellValue(chr(65 + $col) . '1', $header);
        $sheet->getStyle('A1:H1')->applyFromArray($headerStyle);
        $sheet->getRowDimension(1)->setRowHeight(22);

        foreach ($records as $i => $r) {
            $row = $i + 2;
            $bg = $i % 2 === 0 ? 'FFEFF6FF' : 'FFFFFFFF';
            $sheet->setCellValue("A$row", $i + 1); $sheet->setCellValue("B$row", $r->id);
            $sheet->setCellValue("C$row", $r->nama); $sheet->setCellValue("D$row", $r->tanggal_lahir);
            $sheet->setCellValue("E$row", $r->jenis_kelamin); $sheet->setCellValue("F$row", $r->total_skor);
            $sheet->setCellValue("G$row", $r->kategori); $sheet->setCellValue("H$row", $r->created_at?->format('d/m/Y H:i'));
            $sheet->getStyle("A$row:H$row")->applyFromArray([
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => $bg]],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FFBFDBFE']]],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            ]);
        }

        foreach (range('A', 'H') as $c) $sheet->getColumnDimension($c)->setAutoSize(true);

        $filename = 'swls_' . now()->format('Ymd_His') . '.xlsx';
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
        Swls::whereIn('id', $ids)->delete();
        return redirect()->back()->with('success', count($ids) . ' data berhasil dihapus.');
    }
}
