<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAdminActionToReviews extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tutor_reviews', function (Blueprint $table) {
            $table->enum('admin_action', ['pending', 'approved', 'rejected'])->default('pending');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tutor_reviews', function (Blueprint $table) {
            $table->dropColumn('admin_action');
        });
    }
}
