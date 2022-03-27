<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPasswordResetTokenToUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('password_reset_token')->nullable();
            $table->dateTime('password_reset_token_issued_at')->nullable();

            $table->index('password_reset_token');
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
            $table->dropIndex(['password_reset_token']);
            $table->dropColumn('password_reset_token');
            $table->dropColumn('password_reset_token_issued_at');
        });
    }
}
