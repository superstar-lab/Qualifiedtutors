<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPricePerHourInPersonToTutorSubjects extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tutor_subjects', function (Blueprint $table) {
            $table->renameColumn('price_per_hour', 'price_per_hour_online');
            $table->integer('price_per_hour_in_person');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tutor_subjects', function (Blueprint $table) {
            $table->renameColumn('price_per_hour_online', 'price_per_hour');
            $table->dropColumn('price_per_hour_in_person');
        });
    }
}
