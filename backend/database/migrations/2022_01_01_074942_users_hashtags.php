<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UsersHashtags extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users_hashtags', function(Blueprint $table) {
            $table->foreignId('user_id')->constrained();
            $table->foreignId('hashtag_id')->constrained();
            $table->primary(['user_id', 'hashtag_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users_hashtags');
    }
}
