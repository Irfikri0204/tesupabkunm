<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('counseling_appointments', function (Blueprint $table) {
            $table->string('location')->nullable()->after('assigned_counselor');
        });
    }

    public function down(): void
    {
        Schema::table('counseling_appointments', function (Blueprint $table) {
            $table->dropColumn('location');
        });
    }
};
