<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kecerdasan_majemuks', function (Blueprint $table) {
            $table->id();
            $table->string('kode_acak')->unique();
            $table->string('nama');
            $table->string('kelas');
            $table->string('asal_sekolah');
            $table->string('bukti_follow')->nullable();
            $table->json('answers');
            $table->json('skor_per_kategori');
            $table->json('top_categories');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kecerdasan_majemuks');
    }
};
