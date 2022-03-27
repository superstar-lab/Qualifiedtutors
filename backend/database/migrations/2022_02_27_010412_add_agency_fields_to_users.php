<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAgencyFieldsToUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('tutor_type');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->enum('tutor_type', ['tutor', 'teacher', 'agency'])->nullable();
            $table->string('banner_image')->nullable();
            $table->string('company_name')->nullable();
            $table->string('company_tagline')->nullable();
            $table->string('company_website')->nullable();
            $table->string('company_blurb')->nullable();
            $table->json('company_bios');

            $table->integer('years_of_experience')->default(0);
            $table->json('qualification_proof_documents')->json();
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
            $table->dropColumn('tutor_type');
            $table->dropColumn('years_of_experience');
            $table->dropColumn('banner_image');
            $table->dropColumn('company_name');
            $table->dropColumn('company_tagline');
            $table->dropColumn('company_website');
            $table->dropColumn('company_blurb');
            $table->dropColumn('company_bios');
            $table->dropColumn('qualification_proof_documents');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->enum('tutor_type', ['teacher', 'tutor'])->nullable();
        });
    }
}
