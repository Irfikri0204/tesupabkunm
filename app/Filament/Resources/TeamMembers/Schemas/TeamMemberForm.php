<?php

namespace App\Filament\Resources\TeamMembers\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class TeamMemberForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->schema([
                TextInput::make('name')
                    ->label('Nama Anggota')
                    ->required()
                    ->columnSpan(2),

                TextInput::make('role')
                    ->label('Peran / Jabatan')
                    ->required(),

                TextInput::make('division')
                    ->label('Divisi (opsional)')
                    ->nullable(),

                TextInput::make('faculty')
                    ->label('Asal Fakultas (opsional)')
                    ->nullable()
                    ->helperText('Hanya untuk konselor sebaya'),

                Select::make('type')
                    ->label('Kelompok Anggota')
                    ->options([
                        'dosen' => 'Tim UPA BK UNM',
                        'konselor-sebaya' => 'Konselor Sebaya UNM',
                    ])
                    ->required(),

                FileUpload::make('photo')
                    ->label('Foto Anggota')
                    ->image()
                    ->directory('team-members')
                    ->disk('public')
                    ->imagePreviewHeight('300')
                    ->imageCropAspectRatio('3:4')
                    ->imageEditor()
                    ->panelLayout('stack')
                    ->imageEditorMode(1)
                    ->imageEditorAspectRatios(['3:4'])
                    ->imageResizeMode('cover')
                    ->imageResizeTargetWidth('800')
                    ->imageResizeTargetHeight('1067')
                    ->enableOpen()
                    ->enableDownload(),

                TextInput::make('order')
                    ->label('Urutan Tampil')
                    ->default(0)
                    ->numeric()
                    ->required(),
            ]);
    }
}
