<?php

namespace App\Filament\Resources\KecerdasanMajemuks\Pages;

use App\Filament\Resources\KecerdasanMajemuks\KecerdasanMajemukResource;
use Filament\Resources\Pages\ViewRecord;
use Filament\Schemas\Schema;
use App\Filament\Resources\KecerdasanMajemuks\Schemas\KecerdasanMajemukForm;

class ViewKecerdasanMajemuk extends ViewRecord
{
    protected static string $resource = KecerdasanMajemukResource::class;

    public function infolist(Schema $schema): Schema
    {
        return KecerdasanMajemukForm::configure($schema);
    }
}
