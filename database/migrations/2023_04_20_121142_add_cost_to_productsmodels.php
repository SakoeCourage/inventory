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
        Schema::table('productsmodels', function (Blueprint $table) {
            $table->bigInteger('cost_per_unit')->nullable()->default(0);
            $table->bigInteger('cost_per_collection')->nullable()->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productsmodels', function (Blueprint $table) {
           $table->dropColumn('cost_per_unit');
           $table->dropColumn('cost_per_collection');
        });
    }
};
