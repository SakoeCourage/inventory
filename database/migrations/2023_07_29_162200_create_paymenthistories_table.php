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
        Schema::create('paymenthistories', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('paymentmethod_id')->references('id')->on('paymentmethods')->onDelete('cascade');
            $table->foreignId('sale_id')->references('id')->on('sales')->onDelete('cascade');
            $table->bigInteger('amount');
            $table->string('sender')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paymenthistories');
    }
};
