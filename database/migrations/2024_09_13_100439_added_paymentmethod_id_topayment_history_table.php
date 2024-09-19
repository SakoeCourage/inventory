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
        Schema::table('lease_payment_histories', function (Blueprint $table) {
            $table->foreignId("paymentmethod_id")
            ->nullable()
            ->references("id")
            ->on("paymentmethods")
            ->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("lease_payment_histories",function(Blueprint $table){
                $table->dropColumn("paymentmethod_id");
        });
    }
};
