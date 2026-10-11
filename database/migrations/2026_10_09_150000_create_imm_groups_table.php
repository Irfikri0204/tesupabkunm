<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('imm_groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::table('imm_results', function (Blueprint $table) {
            $table->foreignId('imm_group_id')->nullable()->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('imm_results', function (Blueprint $table) {
            $table->dropForeign(['imm_group_id']);
            $table->dropColumn('imm_group_id');
        });
        
        Schema::dropIfExists('imm_groups');
    }
};
