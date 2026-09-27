<?php

namespace App\Filament\Resources\TestSettings;

use App\Filament\Resources\TestSettings\Pages\ListTestSettings;
use App\Filament\Resources\TestSettings\Tables\TestSettingsTable;
use App\Models\TestSetting;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class TestSettingsResource extends Resource
{
    protected static ?string $model = TestSetting::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::AdjustmentsHorizontal;
    protected static \UnitEnum|string|null $navigationGroup = 'Pengaturan';
    protected static ?string $pluralLabel = 'Pengaturan Tes';

    public static function table(Table $table): Table
    {
        return TestSettingsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListTestSettings::route('/'),
        ];
    }
}
