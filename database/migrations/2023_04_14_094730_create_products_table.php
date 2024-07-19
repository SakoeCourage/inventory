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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('product_name');
            $table->foreignId('basic_selling_quantity_id');
            $table->boolean('has_models')->default(true)->comment('[ 1 => product has one or more curated models or variety defined],[ 0 => has no zero curated models or variety defined ]');
            $table->bigInteger('quantity_in_stock')->nullable()->default(0);
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
