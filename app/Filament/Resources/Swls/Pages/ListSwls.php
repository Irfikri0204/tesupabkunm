<?php

namespace App\Filament\Resources\Swls\Pages;

use App\Filament\Resources\Swls\SwlsResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Maatwebsite\Excel\Excel;
use pxlrbt\FilamentExcel\Actions\Tables\ExportAction as ExportAction;
use pxlrbt\FilamentExcel\Exports\ExcelExport;
class ListSwls extends ListRecords
{
    protected static string $resource = SwlsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
                    ExportAction::make()
                    ->label('Export ke Excel')
                    ->exports([
                        ExcelExport::make()
                        ->fromModel()
                        ->withFilename(fn () => 'Tes SWLS '.now()->format('Y-m-d'))
                    ])
        ];
    }
}
