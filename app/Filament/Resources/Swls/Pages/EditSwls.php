<?php

namespace App\Filament\Resources\Swls\Pages;

use App\Filament\Resources\Swls\SwlsResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSwls extends EditRecord
{
    protected static string $resource = SwlsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
