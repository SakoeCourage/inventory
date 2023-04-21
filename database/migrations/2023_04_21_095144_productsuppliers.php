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
        Schema::create('productsupplier',function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('supplier_id')->references('id')->on('suppliers')->onDelete('cascade');
            $table->foreignId('productsmodel_id')->references('id')->on('productsmodels')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productsupplier');
    }
};
