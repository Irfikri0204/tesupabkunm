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
        Schema::create('dynamic_test_choices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dynamic_test_question_id')->constrained()->onDelete('cascade');
            $table->string('choice_text');
            $table->decimal('weight', 8, 2)->default(0);
            $table->foreignId('dynamic_test_category_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dynamic_test_choices');
    }
};
