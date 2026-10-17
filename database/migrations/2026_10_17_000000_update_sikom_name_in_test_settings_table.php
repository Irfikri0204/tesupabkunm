<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('test_settings')
            ->where('slug', 'identifikasi-masalah')
            ->update([
                'name' => 'Sistem Identifikasi Kondisi Mahasiswa (SIKOM)',
            ]);

        // Replace any remaining SIK-M in name column
        DB::statement("UPDATE test_settings SET name = REPLACE(name, 'SIK-M', 'SIKOM') WHERE name LIKE '%SIK-M%'");
    }

    public function down(): void
    {
        DB::table('test_settings')
            ->where('slug', 'identifikasi-masalah')
            ->update([
                'name' => 'Sistem Identifikasi Kondisi - Mahasiswa (SIK-M)',
            ]);
    }
};
