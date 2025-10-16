<?php

namespace App\Filament\Resources\Srq20s;

use App\Filament\Resources\Srq20s\Pages\CreateSrq20;
use App\Filament\Resources\Srq20s\Pages\EditSrq20;
use App\Filament\Resources\Srq20s\Pages\ListSrq20s;
use App\Filament\Resources\Srq20s\Schemas\Srq20Form;
use App\Filament\Resources\Srq20s\Tables\Srq20sTable;
use App\Models\Srq20;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class Srq20Resource extends Resource
{
    protected static ?string $model = Srq20::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;
    protected static ?string $pluralLabel = 'Tes SRQ-20';
    public static function form(Schema $schema): Schema
    {
        return Srq20Form::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return Srq20sTable::configure($table);
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
            'index' => ListSrq20s::route('/'),
            'create' => CreateSrq20::route('/create'),
            'edit' => EditSrq20::route('/{record}/edit'),
        ];
    }
}
