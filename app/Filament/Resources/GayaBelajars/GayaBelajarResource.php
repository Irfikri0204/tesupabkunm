<?php

namespace App\Filament\Resources\GayaBelajars;

use App\Filament\Resources\GayaBelajars\Pages\CreateGayaBelajar;
use App\Filament\Resources\GayaBelajars\Pages\EditGayaBelajar;
use App\Filament\Resources\GayaBelajars\Pages\ListGayaBelajars;
use App\Filament\Resources\GayaBelajars\Pages\ViewGayaBelajar;
use App\Filament\Resources\GayaBelajars\Schemas\GayaBelajarForm;
use App\Filament\Resources\GayaBelajars\Schemas\GayaBelajarInfolist;
use App\Filament\Resources\GayaBelajars\Tables\GayaBelajarsTable;
use App\Models\GayaBelajar;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class GayaBelajarResource extends Resource
{
    protected static ?string $model = GayaBelajar::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;
    protected static ?string $pluralLabel = 'Tes Gaya Belajar';

    public static function form(Schema $schema): Schema
    {
        return GayaBelajarForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return GayaBelajarInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return GayaBelajarsTable::configure($table);
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
            'index' => ListGayaBelajars::route('/'),
            'create' => CreateGayaBelajar::route('/create'),
            'view' => ViewGayaBelajar::route('/{record}'),
            'edit' => EditGayaBelajar::route('/{record}/edit'),
        ];
    }
}
