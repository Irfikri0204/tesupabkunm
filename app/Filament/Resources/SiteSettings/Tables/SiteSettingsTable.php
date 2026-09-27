<?php

namespace App\Filament\Resources\SiteSettings\Tables;

use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SiteSettingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('key')
                    ->label('Kunci')
                    ->searchable(),
                TextColumn::make('label')
                    ->label('Label')
                    ->searchable(),
                TextColumn::make('value')
                    ->label('Nilai')
                    ->wrap()
                    ->limit(50),
            ])
            ;
    }
}
