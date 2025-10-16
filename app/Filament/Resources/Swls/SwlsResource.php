<?php

namespace App\Filament\Resources\Swls;

use App\Filament\Resources\Swls\Pages\CreateSwls;
use App\Filament\Resources\Swls\Pages\EditSwls;
use App\Filament\Resources\Swls\Pages\ListSwls;
use App\Filament\Resources\Swls\Schemas\SwlsForm;
use App\Filament\Resources\Swls\Tables\SwlsTable;
use App\Models\Swls;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SwlsResource extends Resource
{
    protected static ?string $model = Swls::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;
    protected static ?string $pluralLabel = 'Tes SWLS';
    public static function form(Schema $schema): Schema
    {
        return SwlsForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SwlsTable::configure($table);
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
            'index' => ListSwls::route('/'),
            'create' => CreateSwls::route('/create'),
            'edit' => EditSwls::route('/{record}/edit'),
        ];
    }
}
