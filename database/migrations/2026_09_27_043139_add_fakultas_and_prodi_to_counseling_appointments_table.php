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
        Schema::table('counseling_appointments', function (Blueprint $table) {
            $table->string('fakultas')->nullable()->after('applicant_status');
            $table->string('prodi')->nullable()->after('fakultas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('counseling_appointments', function (Blueprint $table) {
            $table->dropColumn(['fakultas', 'prodi']);
        });
    }
};
