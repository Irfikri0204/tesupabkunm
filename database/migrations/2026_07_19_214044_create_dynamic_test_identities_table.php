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
        Schema::create('dynamic_test_identities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dynamic_test_id')->constrained()->onDelete('cascade');
            $table->string('field_label');
            $table->string('field_name');
            $table->enum('field_type', ['text', 'file', 'select']);
            $table->string('file_type')->nullable(); // 'image', 'pdf', null
            $table->boolean('is_required')->default(true);
            $table->json('options')->nullable(); // for select fields
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dynamic_test_identities');
    }
};
