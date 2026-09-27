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
            // Drop old columns
            $table->dropColumn(['nim_nip', 'faculty', 'study_program', 'email']);

            // Add new columns
            $table->integer('age')->after('name')->nullable();
            $table->string('domicile')->after('age')->nullable();
            $table->string('applicant_status')->after('domicile')->nullable(); // Mahasiswa, Dosen, Pegawai
            $table->string('semester')->nullable()->after('applicant_status');
            $table->string('phone')->after('semester')->nullable();
            $table->string('problem_duration')->after('problem_description')->nullable();
            $table->text('action_taken')->after('problem_duration')->nullable();
            $table->date('preferred_date')->after('action_taken')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('counseling_appointments', function (Blueprint $table) {
            $table->string('nim_nip')->nullable();
            $table->string('faculty')->nullable();
            $table->string('study_program')->nullable();
            $table->string('email')->nullable();

            $table->dropColumn([
                'age',
                'domicile',
                'applicant_status',
                'semester',
                'phone',
                'problem_duration',
                'action_taken',
                'preferred_date'
            ]);
        });
    }
};
