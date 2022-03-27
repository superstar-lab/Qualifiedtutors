<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\ESubjectLevels;

class AddFieldsToReviews extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tutor_reviews', function (Blueprint $table) {
            $table->unsignedBigInteger('reviewer_id');
            $table->index('reviewer_id');
            $table->foreign('reviewer_id')->references('id')->on('users');
            $table->foreignId('subject_id')->constrained();
            $table->enum('level', ESubjectLevels::cases());
            $table->timestamps();
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
            $table->dropForeign(['reviewer_id']);
            $table->dropForeign(['subject_id']);
            $table->dropColumn('reviewer_id');
            $table->dropColumn('subject_id');
            $table->dropColumn('level');
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });
    }
}
