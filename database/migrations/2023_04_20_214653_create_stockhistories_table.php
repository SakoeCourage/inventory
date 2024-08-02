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
        Schema::create('stockhistories', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->json('stock_products');
            $table->dateTime('record_date');
            $table->foreignId('supplier_id')->nullable()->references('id')->on('suppliers')->onDelete('cascade');
            $table->string('purchase_invoice_number')->default('');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stockhistories');
    }
};
