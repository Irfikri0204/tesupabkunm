<?php

namespace App\Filament\Resources\TeamMembers\Tables;

use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TeamMembersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->reorderable('order')
            ->columns([
                ImageColumn::make('photo')
                    ->label('Foto')
                    ->disk('public')
                    ->rounded()
                    ->width(80)
                    ->height(80)
                    ->defaultImageUrl(asset('img/logo-upalbkunm.png')),

                TextColumn::make('name')
                    ->sortable()
                    ->searchable()
                    ->label('Nama'),

                TextColumn::make('role')
                    ->label('Peran'),

                TextColumn::make('division')
                    ->label('Divisi')
                    ->default('-'),

                TextColumn::make('faculty')
                    ->label('Fakultas')
                    ->default('-')
                    ->toggleable(),

                TextColumn::make('type')
                    ->label('Kelompok')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => [
                        'dosen' => 'Tim UPA BK UNM',
                        'konselor-sebaya' => 'Konselor Sebaya UNM',
                    ][$state] ?? $state)
                    ->colors([
                        'primary' => 'dosen',
                        'secondary' => 'konselor-sebaya',
                    ]),
            ])
            ->defaultSort('order')
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                DeleteBulkAction::make(),
            ]);
    }
}
