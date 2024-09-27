<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sale_collected_histories', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId("sale_id")
                ->references("id")
                ->on("sales")
                ->cascadeOnDelete();
            $table->string("collected_by_name");
            $table->string("collected_by_phone");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sale_collected_histories');
    }
};
