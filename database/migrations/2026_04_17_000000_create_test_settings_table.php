<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('test_settings', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->boolean('is_open')->default(true);
            $table->timestamps();
        });

        DB::table('test_settings')->insert([
            ['slug' => 'gayabelajar', 'name' => 'Tes Gaya Belajar', 'is_open' => true, 'created_at' => now(), 'updated_at' => now()],
            ['slug' => 'panas', 'name' => 'Tes PANAS', 'is_open' => true, 'created_at' => now(), 'updated_at' => now()],
            ['slug' => 'swls', 'name' => 'Tes Dimensi Kepuasan Hidup', 'is_open' => true, 'created_at' => now(), 'updated_at' => now()],
            ['slug' => 'srq20', 'name' => 'Tes SRQ-20', 'is_open' => true, 'created_at' => now(), 'updated_at' => now()],
            ['slug' => 'kecerdasan-majemuk', 'name' => 'Tes Kecerdasan Majemuk', 'is_open' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('test_settings');
    }
};
