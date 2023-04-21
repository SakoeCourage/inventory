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
        Schema::create('productstockhistories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('productsmodel_id')->constrained()->cascadeOnDelete();
            $table->string('description')->nullable();
            $table->string('action_type')->nullable();
            $table->bigInteger('quantity')->nullable()->default(0);
            $table->bigInteger('net_quantity')->nullable()->default(0);
            $table->foreignId('user_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productstockhistories');
    }
};
