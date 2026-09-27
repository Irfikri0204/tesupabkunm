<?php

namespace App\Filament\Resources\TestSettings\Pages;

use App\Filament\Resources\TestSettings\TestSettingsResource;
use Filament\Resources\Pages\ListRecords;

class ListTestSettings extends ListRecords
{
    protected static string $resource = TestSettingsResource::class;
}
