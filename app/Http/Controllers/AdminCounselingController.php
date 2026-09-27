<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CounselingAppointment;
use App\Models\TeamMember;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

class AdminCounselingController extends Controller
{
    public function index(Request $request)
    {
        $tab = $request->query('tab', 'pengajuan');
        $search = $request->query('search', '');
        
        $query = CounselingAppointment::query();
        
        if ($tab === 'pengajuan') {
            $query->where('status', 'pending');
        } elseif ($tab === 'terjadwal') {
            $query->where('status', 'scheduled');
        } elseif ($tab === 'selesai') {
            $query->where('status', 'completed');
        } elseif ($tab === 'batal') {
            $query->where('status', 'cancelled');
        }
        
        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('whatsapp', 'like', "%{$search}%");
            });
        }
        
        $appointments = $query->orderBy('created_at', 'desc')->paginate(15)->appends(['tab' => $tab, 'search' => $search]);
        
        $counselors = TeamMember::whereIn('type', ['dosen', 'konselor-sebaya'])->orderBy('name', 'asc')->get();

        return Inertia::render('Admin/Konseling/Index', [
            'appointments' => $appointments,
            'counselors'   => $counselors,
            'currentTab'   => $tab,
            'search'       => $search,
        ]);
    }

    /**
     * Update status (legacy endpoint, kept for backward compat)
     */
    public function update(Request $request, $id)
    {
        $appointment = CounselingAppointment::findOrFail($id);

        $validated = $request->validate([
            'status'             => 'required|in:pending,scheduled,completed,cancelled',
            'admin_notes'        => 'nullable|string',
            'scheduled_at'       => 'nullable|date',
            'assigned_counselor' => 'nullable|string|max:255',
            'location'           => 'nullable|string|max:255',
        ]);

        $appointment->update($validated);

        return redirect()->back()->with('success', 'Status pendaftaran konseling berhasil diperbarui.');
    }

    /**
     * Setujui konseling: set status = scheduled, simpan jadwal/tempat/konselor
     */
    public function approve(Request $request, $id)
    {
        $appointment = CounselingAppointment::findOrFail($id);

        $validated = $request->validate([
            'scheduled_at'       => 'required|date',
            'location'           => 'required|string|max:255',
            'assigned_counselor' => 'required|string|max:255',
            'admin_notes'        => 'nullable|string',
        ]);

        $appointment->update(array_merge($validated, ['status' => 'scheduled']));

        return redirect()->back()->with('success', 'Konseling berhasil dijadwalkan. Silakan hubungi konseli via WhatsApp.');
    }

    /**
     * Hapus data konseling
     */
    public function destroy($id)
    {
        CounselingAppointment::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Data konseling berhasil dihapus.');
    }

    /**
     * Hapus massal data konseling
     */
    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:counseling_appointments,id',
        ]);

        CounselingAppointment::whereIn('id', $validated['ids'])->delete();

        return redirect()->back()->with('success', count($validated['ids']) . ' data konseling berhasil dihapus.');
    }

    /**
     * Export semua data ke Excel
     */
    public function export(Request $request)
    {
        $query = CounselingAppointment::orderBy('created_at', 'desc');
        
        if ($request->has('status') && is_array($request->status)) {
            $query->whereIn('status', $request->status);
        }

        $records = $query->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Daftar Konseling');

        // Header style
        $headerStyle = [
            'font'      => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF'], 'size' => 11],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF7C3AED']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
            'borders'   => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FFD8B4FE']]],
        ];

        $headers = [
            'No', 'Tgl Daftar', 'Nama', 'Usia', 'Domisili', 'Status Pemohon',
            'Fakultas', 'Program Studi', 'Semester', 'No Telepon', 'WhatsApp', 'Deskripsi Masalah',
            'Lama Masalah', 'Tindakan', 'Tgl Diinginkan',
            'Status', 'Jadwal Konseling', 'Tempat', 'Konselor', 'Catatan Admin',
        ];

        foreach ($headers as $col => $header) {
            $cell = chr(65 + $col) . '1';
            $sheet->setCellValue($cell, $header);
        }
        $lastCol = chr(65 + count($headers) - 1);
        $sheet->getStyle("A1:{$lastCol}1")->applyFromArray($headerStyle);
        $sheet->getRowDimension(1)->setRowHeight(28);

        $statusMap = [
            'pending'   => 'Pengajuan Baru',
            'scheduled' => 'Terjadwal',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan',
        ];

        foreach ($records as $i => $r) {
            $row = $i + 2;
            $bg  = $i % 2 === 0 ? 'FFF5F3FF' : 'FFFFFFFF';

            $values = [
                $i + 1,
                $r->created_at?->format('d/m/Y'),
                $r->name,
                $r->age,
                $r->domicile,
                $r->applicant_status,
                $r->fakultas ?? '-',
                $r->prodi ?? '-',
                $r->semester ?? '-',
                $r->phone ?? '-',
                $r->whatsapp,
                $r->problem_description,
                $r->problem_duration ?? '-',
                $r->action_taken ?? '-',
                $r->preferred_date ? $r->preferred_date->format('d/m/Y') : '-',
                $statusMap[$r->status] ?? $r->status,
                $r->scheduled_at ? $r->scheduled_at->format('d/m/Y H:i') : '-',
                $r->location ?? '-',
                $r->assigned_counselor ?? '-',
                $r->admin_notes ?? '-',
            ];

            foreach ($values as $col => $value) {
                $sheet->setCellValue(chr(65 + $col) . $row, $value);
            }

            $sheet->getStyle("A{$row}:{$lastCol}{$row}")->applyFromArray([
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => $bg]],
                'borders'   => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FFE9D5FF']]],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
            ]);
        }

        // Status column color coding
        foreach ($records as $i => $r) {
            $row = $i + 2;
            $statusColors = [
                'pending'   => 'FFFFF7CD',
                'scheduled' => 'FFDBEAFE',
                'completed' => 'FFD1FAE5',
                'cancelled' => 'FFFECACA',
            ];
            if (isset($statusColors[$r->status])) {
                $sheet->getStyle("P{$row}")->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()->setARGB($statusColors[$r->status]);
                $sheet->getStyle("P{$row}")->getFont()->setBold(true);
            }
        }

        foreach (range('A', $lastCol) as $c) {
            $sheet->getColumnDimension($c)->setAutoSize(true);
        }

        $filename = 'daftar_konseling_' . now()->format('Ymd_His') . '.xlsx';
        $writer   = new Xlsx($spreadsheet);

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header("Content-Disposition: attachment; filename=\"{$filename}\"");
        header('Cache-Control: max-age=0');
        $writer->save('php://output');
        exit;
    }
}
