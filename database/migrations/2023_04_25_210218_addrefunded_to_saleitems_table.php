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
        Schema::table('saleitems', function (Blueprint $table) {
            $table->boolean('is_refunded')->after('profit')->comment('0 = item not refunded,1 = item refunded')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('saleitems', function (Blueprint $table) {
          $table->dropColumn('is_refunded');
        });
    }
};
