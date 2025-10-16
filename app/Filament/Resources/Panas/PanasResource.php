<?php

namespace App\Filament\Resources\Panas;

use App\Filament\Resources\Panas\Pages\CreatePanas;
use App\Filament\Resources\Panas\Pages\EditPanas;
use App\Filament\Resources\Panas\Pages\ListPanas;
use App\Filament\Resources\Panas\Schemas\PanasForm;
use App\Filament\Resources\Panas\Tables\PanasTable;
use App\Models\Panas;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PanasResource extends Resource
{
    protected static ?string $model = Panas::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;
    protected static ?string $pluralLabel = 'Tes PANAS';
    public static function form(Schema $schema): Schema
    {
        return PanasForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PanasTable::configure($table);
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
            'index' => ListPanas::route('/'),
            'create' => CreatePanas::route('/create'),
            'edit' => EditPanas::route('/{record}/edit'),
        ];
    }
}
