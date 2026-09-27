<?php

namespace App\Filament\Resources\KecerdasanMajemuks;

use App\Filament\Resources\KecerdasanMajemuks\Pages\ListKecerdasanMajemuks;
use App\Filament\Resources\KecerdasanMajemuks\Pages\ViewKecerdasanMajemuk;
use App\Filament\Resources\KecerdasanMajemuks\Schemas\KecerdasanMajemukForm;
use App\Filament\Resources\KecerdasanMajemuks\Tables\KecerdasanMajemuksTable;
use App\Models\KecerdasanMajemuk;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class KecerdasanMajemukResource extends Resource
{
    protected static ?string $model = KecerdasanMajemuk::class;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-academic-cap';
    protected static ?string $pluralLabel = 'Tes Kecerdasan Majemuk';
    protected static ?string $slug = 'tes-kecerdasan-majemuk';
    protected static \UnitEnum|string|null $navigationGroup = 'Hasil Tes';

    public static function form(Schema $schema): Schema
    {
        return KecerdasanMajemukForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return KecerdasanMajemuksTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListKecerdasanMajemuks::route('/'),
            'view' => ViewKecerdasanMajemuk::route('/{record}'),
        ];
    }
}
