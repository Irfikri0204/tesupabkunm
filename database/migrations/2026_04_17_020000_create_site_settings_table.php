<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('label');
            $table->text('value')->nullable();
        });

        DB::table('site_settings')->insert([
            ['key' => 'registration_url', 'label' => 'Pendaftaran Online', 'value' => 'https://s.id/layanankonselinguptlbkunm'],
            ['key' => 'instagram_url', 'label' => 'Instagram', 'value' => 'https://instagram.com/upa_bk_unm'],
            ['key' => 'website_url', 'label' => 'Situs Resmi', 'value' => 'https://uptlbk.unm.ac.id'],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
