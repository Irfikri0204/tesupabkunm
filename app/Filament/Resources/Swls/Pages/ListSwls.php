<?php

namespace App\Filament\Resources\Swls\Pages;

use App\Filament\Resources\Swls\SwlsResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSwls extends ListRecords
{
    protected static string $resource = SwlsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
