<?php

namespace App\Filament\Exports;

use App\Models\Srq20;
use App\Models\TesSrq20;
use Filament\Actions\Exports\ExportColumn;
use Filament\Actions\Exports\Exporter;
use Filament\Actions\Exports\Models\Export;
use Illuminate\Support\Number;

class TesSrq20Exporter extends Exporter
{
    protected static ?string $model = Srq20::class;

    public static function getColumns(): array
    {
        return [
            ExportColumn::make('nama'),
            ExportColumn::make('tanggal_lahir'),
            ExportColumn::make('jenis_kelamin'),
            ExportColumn::make('answers')->label('Jawaban'),
            ExportColumn::make('total_skor'),
            ExportColumn::make('kategori'),
            ExportColumn::make('created_at')->label('Tanggal Tes'),
        ];
    }

    public static function getCompletedNotificationBody(Export $export): string
    {
        return 'Data hasil tes SRQ-20 berhasil diekspor dan siap diunduh.';
    }
}
