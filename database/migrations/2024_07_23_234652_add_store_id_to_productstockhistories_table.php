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
        Schema::table('productstockhistories', function (Blueprint $table) {
                $table->foreignId("store_id")
                ->references("id")
                ->on("stores")
                ->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productstockhistories', function (Blueprint $table) {
          $table->dropColumn("store_id");
        });
    }
};