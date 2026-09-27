<?php

namespace App\Filament\Resources\SiteSettings\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class SiteSettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->columns(1)->schema([
            TextInput::make('key')
                ->label('Kunci')
                ->required()
                ->unique(ignoreRecord: true)
                ->helperText('Contoh: registration_url, instagram_url, website_url'),
            TextInput::make('label')
                ->label('Label')
                ->required(),
            TextInput::make('value')
                ->label('Nilai / URL')
                ->required()
                ->url()
                ->helperText('Masukkan tautan lengkap, misalnya https://example.com'),
        ]);
    }
}
