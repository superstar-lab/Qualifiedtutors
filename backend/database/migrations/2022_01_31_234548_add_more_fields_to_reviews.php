<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMoreFieldsToReviews extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tutor_reviews', function (Blueprint $table) {
            $table->enum('reviewee_acceptance', ['pending', 'approved', 'rejected']);
            $table->boolean('reviewer_escalated');
            $table->text('reviewee_rejection_message');
            $table->text('reviewer_escalation_message');
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
            $table->dropColumn('reviewee_acceptance');
            $table->dropColumn('reviewer_escalated');
            $table->dropColumn('reviewee_rejection_message');
            $table->dropColumn('reviewer_escalation_message');
        });
    }
}
