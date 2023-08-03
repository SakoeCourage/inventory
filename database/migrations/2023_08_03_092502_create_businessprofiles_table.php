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
        Schema::create('businessprofiles', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('business_name');
            $table->string('box_number');
            $table->string('street');
            $table->string('tel_1');
            $table->string('address')->nullable();
            $table->string('tel_2')->nullable();
            $table->string('business_email')->nullable();
            $table->string('about_business')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('businessprofiles');
    }
};
