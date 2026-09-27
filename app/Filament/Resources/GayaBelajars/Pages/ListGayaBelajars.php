<?php

namespace App\Filament\Resources\GayaBelajars\Pages;

use App\Filament\Resources\GayaBelajars\GayaBelajarResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Maatwebsite\Excel\Excel;
use pxlrbt\FilamentExcel\Actions\Tables\ExportAction as ExportAction;
use pxlrbt\FilamentExcel\Exports\ExcelExport;

class ListGayaBelajars extends ListRecords
{
    protected static string $resource = GayaBelajarResource::class;

    protected function getHeaderActions(): array
    {
        return [
            

            CreateAction::make(),
                                ExportAction::make()
                    ->label('Export ke Excel')
                    ->exports([
                        ExcelExport::make()
                        ->fromModel()
                        ->withFilename(fn () => 'Tes Gaya Belajar '.now()->format('Y-m-d'))
                    ]),
        ];
    }
}
