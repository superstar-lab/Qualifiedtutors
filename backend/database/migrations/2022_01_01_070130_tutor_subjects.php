<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\ESubjectLevels;

class TutorSubjects extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tutor_subjects', function(Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->enum('level', ESubjectLevels::cases());
            $table->integer('price_per_hour'); // Measured in 1p
            $table->boolean('online')->default(false);
            $table->boolean('in_person')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tutor_subjects');
    }
}
