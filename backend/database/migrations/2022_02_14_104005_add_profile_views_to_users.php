<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddProfileViewsToUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->bigInteger('profile_views_all_time')->default(0);
            $table->bigInteger('profile_views_week')->default(0);
            $table->bigInteger('profile_views_month')->default(0);
            $table->bigInteger('profile_views_last_month')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('profile_views_all_time');
            $table->dropColumn('profile_views_week');
            $table->dropColumn('profile_views_month');
            $table->dropColumn('profile_views_last_month');
        });
    }
}
