<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('imm_faculties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('imm_group_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['imm_group_id', 'slug']);
        });

        Schema::create('imm_prodis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('imm_faculty_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['imm_faculty_id', 'slug']);
        });

        Schema::table('imm_results', function (Blueprint $table) {
            $table->foreignId('imm_faculty_id')->nullable()->after('imm_group_id')->constrained()->nullOnDelete();
            $table->foreignId('imm_prodi_id')->nullable()->after('imm_faculty_id')->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('imm_results', function (Blueprint $table) {
            $table->dropForeign(['imm_faculty_id']);
            $table->dropForeign(['imm_prodi_id']);
            $table->dropColumn(['imm_faculty_id', 'imm_prodi_id']);
        });

        Schema::dropIfExists('imm_prodis');
        Schema::dropIfExists('imm_faculties');
    }
};
