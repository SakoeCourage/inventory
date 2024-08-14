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
        Schema::create('invoice_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->references('id')
            ->on('stores')
            ->onDelete('cascade');
            $table->foreignId("product_id")
            ->references("id")->on("products")->onDelete("cascade");
            $table->foreignId("productsmodel_id")
            ->references("id")->on("productsmodels")
            ->onDelete("cascade");
            $table->foreignId("stockhistory_id")
            ->references("id")
            ->on("stockhistories")
            ->onDelete("cascade");
            $table->bigInteger('cost_per_unit');
            $table->bigInteger('cost_per_collection')->nullable()->default(0);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_products');
    }
};
