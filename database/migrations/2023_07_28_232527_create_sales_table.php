<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\SaleEnum;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('sale_invoice')->nullable()->default('SALE-');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('paymentmethod_id')->references('id')->on('paymentmethods');
            $table->string('customer_name')->nullable();
            $table->foreignId("store_id")
                ->nullable()
                ->references("id")
                ->on("stores");
            $table->string("sale_type")
                ->default(SaleEnum::Regular->value)
            ;
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
