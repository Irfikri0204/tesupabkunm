<?php

namespace App\Filament\Resources\Panas\Pages;

use App\Filament\Resources\Panas\PanasResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPanas extends ListRecords
{
    protected static string $resource = PanasResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
