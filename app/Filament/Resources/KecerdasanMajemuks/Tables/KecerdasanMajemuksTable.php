<?php

namespace App\Filament\Resources\KecerdasanMajemuks\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class KecerdasanMajemuksTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('nama')->sortable()->searchable()->label('Nama'),
                TextColumn::make('kelas')->sortable()->searchable()->label('Kelas'),
                TextColumn::make('asal_sekolah')->sortable()->searchable()->label('Asal Sekolah'),
                TextColumn::make('top_categories')
                    ->label('Top 3 Kecerdasan')
                    ->badge()
                    ->separator(','),
                TextColumn::make('created_at')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->label('Tanggal Pengisian'),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
