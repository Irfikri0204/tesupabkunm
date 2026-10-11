<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('imm_results', function (Blueprint $table) {
            $table->id();
            
            // Identitas mahasiswa
            $table->string('nama');
            $table->string('nim')->nullable();
            $table->string('fakultas')->nullable();
            $table->string('program_studi')->nullable();
            $table->string('semester')->nullable();
            $table->string('jenis_kelamin')->nullable();
            $table->string('tempat_tinggal')->nullable();
            $table->string('nomor_hp')->nullable();
            $table->string('status_bekerja')->nullable();
            $table->string('status_pernikahan')->nullable();
            $table->string('penyandang_disabilitas')->nullable();
            $table->string('disabilitas_jenis')->nullable();
            $table->string('penerima_beasiswa')->nullable();
            $table->string('ipk_terakhir')->nullable();
            $table->string('status_semester_lalu')->nullable();

            // Jawaban mentah (1-75)
            $table->json('answers');

            // Skor per bidang (5 bidang)
            $table->integer('skor_pribadi')->default(0);
            $table->integer('skor_sosial')->default(0);
            $table->integer('skor_belajar')->default(0);
            $table->integer('skor_karier')->default(0);
            $table->integer('skor_lainnya')->default(0);

            // Total
            $table->integer('total_score');
            $table->string('total_classification');
            $table->string('conclusion');

            // Dropout risk
            $table->integer('dropout_risk_score')->default(0);
            $table->string('dropout_risk_classification')->nullable();

            // Full result JSON (complete IMMResult object for detail view)
            $table->json('full_result');

            // Penutup (layanan dipilih, dsb)
            $table->json('penutup')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('imm_results');
    }
};
