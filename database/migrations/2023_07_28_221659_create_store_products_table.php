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
        Schema::create('store_products', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId("productsmodel_id")->references("id")
                ->on("productsmodels")->cascadeOnDelete();
            $table->foreignId("store_id")->references("id")
                ->on("stores")->cascadeOnDelete();
            $table->bigInteger('quantity_in_stock')->nullable()->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_products');
    }
};
