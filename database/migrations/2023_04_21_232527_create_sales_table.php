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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('paymentmethod_id')->references('id')->on('paymentmethods');
            $table->string('customer_name')->nullable();
            $table->bigInteger('total_amount');
            $table->string('customer_contact')->nullable();
            $table->bigInteger('sub_total');
            $table->bigInteger('balance')->nullable()->default(0);
            $table->bigInteger('amount_paid')->nullable()->default(0);
            $table->bigInteger('discount_rate')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
