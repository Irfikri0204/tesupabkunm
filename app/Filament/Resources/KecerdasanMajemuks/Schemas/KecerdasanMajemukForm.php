<?php

namespace App\Filament\Resources\KecerdasanMajemuks\Schemas;

use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Infolists\Components\TextEntry;

class KecerdasanMajemukForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Identitas Peserta')
                    ->schema([
                        TextEntry::make('nama')->label('Nama'),
                        TextEntry::make('kelas')->label('Kelas'),
                        TextEntry::make('asal_sekolah')->label('Asal Sekolah'),
                        TextEntry::make('created_at')
                            ->label('Tanggal Pengisian')
                            ->getStateUsing(fn ($record) => $record->created_at?->format('d F Y, H:i')),
                    ])->columns(2),

                Section::make('Hasil Analisis Utama')
                    ->schema([
                        TextEntry::make('top_categories')
                            ->label('3 Kecerdasan Tertinggi (Kekuatan Utama)')
                            ->badge()
                            ->separator(','),
                    ]),

                Section::make('Rincian Skor Tiap Kelompok')
                    ->description('Nilai dan interpretasi untuk setiap jenis kecerdasan.')
                    ->schema([
                        TextEntry::make('skor_tabel')
                            ->label('')
                            ->html()
                            ->state(function ($record) {
                                $kategori = $record->skor_per_kategori ?? [];
                                $rows = '';
                                foreach ($kategori as $nama => $data) {
                                    $skor = $data['skor'] ?? '-';
                                    $interpretasi = $data['interpretasi'] ?? '-';
                                    $badge = match($interpretasi) {
                                        'Sangat Kuat' => 'background:#22c55e;color:#fff;',
                                        'Cukup kuat'  => 'background:#3b82f6;color:#fff;',
                                        default       => 'background:#f97316;color:#fff;',
                                    };
                                    $rows .= "<tr style='border-bottom:1px solid #f3f4f6;'>
                                        <td style='padding:10px 16px;font-weight:600;color:#374151;'>{$nama}</td>
                                        <td style='padding:10px 16px;text-align:center;font-weight:700;color:#7c3aed;font-size:1.1rem;'>{$skor}</td>
                                        <td style='padding:10px 16px;text-align:center;'>
                                            <span style='display:inline-block;{$badge}padding:3px 14px;border-radius:999px;font-size:0.78rem;font-weight:700;'>{$interpretasi}</span>
                                        </td>
                                    </tr>";
                                }
                                return "<div style='border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;'>
                                    <table style='width:100%;border-collapse:collapse;'>
                                        <thead>
                                            <tr style='background:#7c3aed;color:#fff;'>
                                                <th style='padding:12px 16px;text-align:left;font-size:0.8rem;letter-spacing:0.05em;text-transform:uppercase;'>Jenis Kecerdasan</th>
                                                <th style='padding:12px 16px;text-align:center;font-size:0.8rem;letter-spacing:0.05em;text-transform:uppercase;'>Skor</th>
                                                <th style='padding:12px 16px;text-align:center;font-size:0.8rem;letter-spacing:0.05em;text-transform:uppercase;'>Kategori</th>
                                            </tr>
                                        </thead>
                                        <tbody style='background:#fff;'>{$rows}</tbody>
                                    </table>
                                </div>";
                            }),
                    ]),
            ]);
    }
}
