<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('surname');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at');
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();

            $table->string('profile_image')->nullable();
            $table->json('profile_additional_images');
            $table->string('profile_summary')->nullable();
            $table->text('profile_about_you')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->string('address_line_1')->nullable();
            $table->string('address_line_2')->nullable();
            $table->string('city')->nullable();
            $table->string('county')->nullable();
            $table->string('mobile_number')->nullable();
            $table->string('postcode')->nullable();
            $table->float('latitude', 10, 7)->default(-256);
            $table->float('longitude', 10, 7)->default(-256);

            $table->enum('role', ['client', 'admin', 'tutor'])->default('client');
            $table->boolean('enabled')->default(false);
            $table->boolean('email_validated')->default(false);
            $table->string('email_validation_token')->nullable();
            $table->string('message_uuid')->index();

            // client specific fields
            $table->json('favourite_tutors')->nullable();

            // tutor specific fields
            $table->boolean('draft')->default(false);
            $table->boolean('free_video_chat_enabled')->default(false);
            $table->string('profile_video_link')->nullable();
            $table->boolean('valid_tutor')->default(false);
            $table->integer('average_review_score')->default(-1); // -1 = no data, should display N/A or something similar on FE
            $table->json('weekly_availability')->nullable();
            $table->json('qualifications')->nullable();
            $table->json('verification_documents')->nullable();
            $table->json('qualification_documents')->nullable();
            $table->json('optional_documents')->nullable();
            $table->json('new_subjects')->nullable(); // Used to store manually entered subjects until they can be reviewed by an admin
            $table->boolean('opt_degree')->default(false);
            $table->boolean('opt_dbs')->default(false);
            $table->boolean('opt_enhanced_dbs')->default(false);
            $table->boolean('opt_examiner')->default(false);
            $table->boolean('opt_aqa')->default(false);
            $table->boolean('opt_ccea')->default(false);
            $table->boolean('opt_ocr')->default(false);
            $table->boolean('opt_edexel')->default(false);
            $table->boolean('opt_wjec')->default(false);
            $table->enum('validation_status', ['pending', 'approved', 'rejected'])->default('pending');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
