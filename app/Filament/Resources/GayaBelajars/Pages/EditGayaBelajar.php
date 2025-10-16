<?php

namespace App\Filament\Resources\GayaBelajars\Pages;

use App\Filament\Resources\GayaBelajars\GayaBelajarResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditGayaBelajar extends EditRecord
{
    protected static string $resource = GayaBelajarResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
