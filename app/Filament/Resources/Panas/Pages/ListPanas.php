<?php

namespace App\Filament\Resources\Panas\Pages;

use App\Filament\Resources\Panas\PanasResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Maatwebsite\Excel\Excel;
use pxlrbt\FilamentExcel\Actions\Tables\ExportAction as ExportAction;
use pxlrbt\FilamentExcel\Exports\ExcelExport;

class ListPanas extends ListRecords
{
    protected static string $resource = PanasResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
                        ExportAction::make()
                    ->label('Export ke Excel')
                    ->exports([
                        ExcelExport::make()
                        ->fromModel()
                        ->withFilename(fn () => 'Tes PANAS '.now()->format('Y-m-d'))
                    ])
        ];
    }
}
