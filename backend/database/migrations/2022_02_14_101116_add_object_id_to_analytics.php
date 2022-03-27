<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddObjectIdToAnalytics extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('analytics', function (Blueprint $table) {
            $table->bigInteger('object_id')->nullable();
            $table->index('object_id');
            $table->index(['event', 'object_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('analytics', function (Blueprint $table) {
            $table->dropIndex(['object_id']);
            $table->dropIndex(['event', 'object_id']);
            $table->dropColumn('object_id');
        });
    }
}
