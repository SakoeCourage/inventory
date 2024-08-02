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
        Schema::create('productsmodels', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->string('model_name');
            $table->bigInteger('unit_price');
            $table->bigInteger('quantity_in_stock')->nullable()->default(0);
            $table->boolean('in_collection')->comment('[ 1 => product can be curated],[ 0 => product cannot be curated]');
            $table->bigInteger('price_per_collection')->nullable()->default(0);
            $table->bigInteger('quantity_per_collection')->nullable()->default(0);
            $table->bigInteger('cost_per_unit')->nullable()->default(0);
            $table->bigInteger('cost_per_collection')->nullable()->default(0);
            $table->foreignId('collection_method')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productsmodels');
    }
};
