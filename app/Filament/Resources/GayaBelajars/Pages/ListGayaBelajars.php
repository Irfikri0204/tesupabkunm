<?php

namespace App\Filament\Resources\GayaBelajars\Pages;

use App\Filament\Resources\GayaBelajars\GayaBelajarResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListGayaBelajars extends ListRecords
{
    protected static string $resource = GayaBelajarResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
