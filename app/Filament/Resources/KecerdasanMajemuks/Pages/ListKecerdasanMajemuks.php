<?php

namespace App\Filament\Resources\KecerdasanMajemuks\Pages;

use App\Filament\Resources\KecerdasanMajemuks\KecerdasanMajemukResource;
use Filament\Resources\Pages\ListRecords;
use pxlrbt\FilamentExcel\Actions\Tables\ExportAction;
use pxlrbt\FilamentExcel\Exports\ExcelExport;
use pxlrbt\FilamentExcel\Columns\Column;

class ListKecerdasanMajemuks extends ListRecords
{
    protected static string $resource = KecerdasanMajemukResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ExportAction::make()
                ->label('Export ke Excel')
                ->exports([
                    ExcelExport::make()
                        ->withFilename(fn () => 'Tes Kecerdasan Majemuk ' . now()->format('Y-m-d'))
                        ->withColumns([
                            Column::make('nama')->heading('Nama'),
                            Column::make('kelas')->heading('Kelas'),
                            Column::make('asal_sekolah')->heading('Asal Sekolah'),
                            Column::make('top_1')
                                ->heading('Kecerdasan #1')
                                ->getStateUsing(function ($record) {
                                    return $record->top_categories[0] ?? '-';
                                }),
                            Column::make('top_2')
                                ->heading('Kecerdasan #2')
                                ->getStateUsing(function ($record) {
                                    return $record->top_categories[1] ?? '-';
                                }),
                            Column::make('top_3')
                                ->heading('Kecerdasan #3')
                                ->getStateUsing(function ($record) {
                                    return $record->top_categories[2] ?? '-';
                                }),
                            Column::make('skor_linguistik')
                                ->heading('Linguistik (Skor)')
                                ->getStateUsing(function ($record) {
                                    return $record->skor_per_kategori['Linguistik']['skor'] ?? '-';
                                }),
                            Column::make('kat_linguistik')
                                ->heading('Linguistik (Kategori)')
                                ->getStateUsing(function ($record) {
                                    return $record->skor_per_kategori['Linguistik']['interpretasi'] ?? '-';
                                }),
                            Column::make('skor_logis')
                                ->heading('Logis-Matematis (Skor)')
                                ->getStateUsing(function ($record) {
                                    return $record->skor_per_kategori['Logis-Matematis']['skor'] ?? '-';
                                }),
                            Column::make('kat_logis')
                                ->heading('Logis-Matematis (Kategori)')
                                ->getStateUsing(function ($record) {
                                    return $record->skor_per_kategori['Logis-Matematis']['interpretasi'] ?? '-';
                                }),
                            Column::make('skor_spasial')
                                ->heading('Spasial-Visual (Skor)')
                                ->getStateUsing(function ($record) {
                                    return $record->skor_per_kategori['Spasial-Visual']['skor'] ?? '-';
                                }),
                            Column::make('kat_spasial')
                                ->heading('Spasial-Visual (Kategori)')
                                ->getStateUsing(function ($record) {
                                    return $record->skor_per_kategori['Spasial-Visual']['interpretasi'] ?? '-';
                                }),
                            Column::make('skor_musikal')
                                ->heading('Musikal (Skor)')
                                ->getStateUsing(function ($record) {
                                    return $record->skor_per_kategori['Musikal']['skor'] ?? '-';
                                }),
                            Column::make('kat_musikal')
                                ->heading('Musikal (Kategori)')
                                ->getStateUsing(function ($record) {
                                    return $record->skor_per_kategori['Musikal']['interpretasi'] ?? '-';
                                }),
                            Column::make('skor_kinestetik')
                                ->heading('Kinestetik-Jasmani (Skor)')
                                ->getStateUsing(function ($record) {
                                    return $record->skor_per_kategori['Kinestetik-Jasmani']['skor'] ?? '-';
                                }),
                            Column::make('kat_kinestetik')
                                ->heading('Kinestetik-Jasmani (Kategori)')
                                ->getStateUsing(function ($record) {
                                    return $record->skor_per_kategori['Kinestetik-Jasmani']['interpretasi'] ?? '-';
                                }),
                            Column::make('skor_interpersonal')
                                ->heading('Interpersonal (Skor)')
                                ->getStateUsing(function ($record) {
                                    return $record->skor_per_kategori['Interpersonal']['skor'] ?? '-';
                                }),
                            Column::make('kat_interpersonal')
                                ->heading('Interpersonal (Kategori)')
                                ->getStateUsing(function ($record) {
                                    return $record->skor_per_kategori['Interpersonal']['interpretasi'] ?? '-';
                                }),
                            Column::make('skor_intrapersonal')
                                ->heading('Intrapersonal (Skor)')
                                ->getStateUsing(function ($record) {
                                    return $record->skor_per_kategori['Intrapersonal']['skor'] ?? '-';
                                }),
                            Column::make('kat_intrapersonal')
                                ->heading('Intrapersonal (Kategori)')
                                ->getStateUsing(function ($record) {
                                    return $record->skor_per_kategori['Intrapersonal']['interpretasi'] ?? '-';
                                }),
                            Column::make('skor_naturalis')
                                ->heading('Naturalis (Skor)')
                                ->getStateUsing(function ($record) {
                                    return $record->skor_per_kategori['Naturalis']['skor'] ?? '-';
                                }),
                            Column::make('kat_naturalis')
                                ->heading('Naturalis (Kategori)')
                                ->getStateUsing(function ($record) {
                                    return $record->skor_per_kategori['Naturalis']['interpretasi'] ?? '-';
                                }),
                            Column::make('created_at')
                                ->heading('Tanggal Pengisian')
                                ->getStateUsing(function ($record) {
                                    return $record->created_at?->format('d/m/Y H:i');
                                }),
                        ])
                ])
        ];
    }
}
