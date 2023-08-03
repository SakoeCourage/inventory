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
        Schema::create('proforma_invoice_sale_items', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('proforma_invoice_id')->constrained()->cascadeOnDelete();
            $table->foreignId('productsmodel_id')->constrained()->cascadeOnDelete();
            $table->bigInteger('price');
            $table->integer('quantity');
            $table->bigInteger('amount');
            $table->bigInteger('profit');
        });

        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proforma_invoice_sale_items');
    }
};
