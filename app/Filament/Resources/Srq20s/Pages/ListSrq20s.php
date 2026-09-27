<?php

namespace App\Filament\Resources\Srq20s\Pages;

use App\Filament\Resources\Srq20s\Srq20Resource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Maatwebsite\Excel\Excel;
use pxlrbt\FilamentExcel\Actions\Tables\ExportAction as ExportAction;
use pxlrbt\FilamentExcel\Exports\ExcelExport;

class ListSrq20s extends ListRecords
{
    protected static string $resource = Srq20Resource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
            ExportAction::make()
                    ->label('Export ke Excel')
                    ->exports([
                        ExcelExport::make()
                        ->fromModel()
                        ->withFilename(fn () => 'Tes SRQ-20 '.now()->format('Y-m-d'))
                    ])
        ];
    }
}
