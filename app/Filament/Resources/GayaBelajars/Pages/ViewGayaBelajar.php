<?php

namespace App\Filament\Resources\GayaBelajars\Pages;

use App\Filament\Resources\GayaBelajars\GayaBelajarResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewGayaBelajar extends ViewRecord
{
    protected static string $resource = GayaBelajarResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
