<?php

namespace App\Filament\Resources\Srq20s\Pages;

use App\Filament\Resources\Srq20s\Srq20Resource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSrq20 extends EditRecord
{
    protected static string $resource = Srq20Resource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
