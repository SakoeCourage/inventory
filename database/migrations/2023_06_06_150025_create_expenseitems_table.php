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
        Schema::create('expenseitems', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expense_id')->references('id')->on('expenses');
            $table->foreignId('expensedefinition_id')->references('id')->on('expensedefinitions');
            $table->bigInteger('amount');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenseitems');
    }
};
