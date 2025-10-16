<?php

namespace App\Filament\Resources\Srq20s\Pages;

use App\Filament\Resources\Srq20s\Srq20Resource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSrq20s extends ListRecords
{
    protected static string $resource = Srq20Resource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
