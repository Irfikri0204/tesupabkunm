<?php

namespace App\Filament\Resources\Panas\Pages;

use App\Filament\Resources\Panas\PanasResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPanas extends EditRecord
{
    protected static string $resource = PanasResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
