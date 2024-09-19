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
        Schema::create('lease_payment_histories', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->bigInteger('amount');
            $table->bigInteger("balance");
            $table->foreignId("sale_id")->references("id")->on("sales")->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lease_payment_histories');
    }
};
