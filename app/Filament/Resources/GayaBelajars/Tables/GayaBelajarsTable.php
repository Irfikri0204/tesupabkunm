<?php

namespace App\Filament\Resources\GayaBelajars\Tables;


use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Maatwebsite\Excel\Excel;
use pxlrbt\FilamentExcel\Actions\Tables\ExportBulkAction as ExportBulkAction;
use pxlrbt\FilamentExcel\Exports\ExcelExport;

class GayaBelajarsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('nama')->sortable()->searchable(),
                TextColumn::make('tanggal_lahir')->sortable()->searchable(),
                TextColumn::make('jenis_kelamin')->sortable()->searchable(),
                TextColumn::make('total_skor')->sortable()->searchable(),
                TextColumn::make('kategori')->sortable()->searchable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ExportBulkAction::make()
                    ->label('Export ke Excel')
                    ->exports([
                        ExcelExport::make()
                        ->fromModel()
                        ->withFilename(fn () => 'Tes Gaya Belajar '.now()->format('Y-m-d'))
                    ])
                ]),
            ]);
    }
}
