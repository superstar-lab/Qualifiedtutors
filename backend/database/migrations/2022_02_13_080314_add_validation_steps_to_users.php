<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddValidationStepsToUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('admin_account_status', ['pending', 'approved', 'rejected', 'more info'])->nullable();
            $table->enum('admin_address_status', ['pending', 'approved', 'rejected', 'more info'])->nullable();
            $table->enum('admin_subjects_status', ['pending', 'approved', 'rejected', 'more info'])->nullable();
            $table->enum('admin_qualifications_status', ['pending', 'approved', 'rejected', 'more info'])->nullable();
            $table->enum('admin_profile_status', ['pending', 'approved', 'rejected', 'more info'])->nullable();
            $table->enum('admin_photos_status', ['pending', 'approved', 'rejected', 'more info'])->nullable();
            $table->enum('admin_documents_status', ['pending', 'approved', 'rejected', 'more info'])->nullable();
            $table->enum('admin_availability_status', ['pending', 'approved', 'rejected', 'more info'])->nullable();
            $table->enum('admin_enhanced_dbs_status', ['pending', 'approved', 'rejected', 'more info'])->nullable();
            $table->enum('admin_references_status', ['pending', 'approved', 'rejected', 'more info'])->nullable();
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
            $table->dropColumn('admin_account_status');
            $table->dropColumn('admin_address_status');
            $table->dropColumn('admin_subjects_status');
            $table->dropColumn('admin_qualifications_status');
            $table->dropColumn('admin_profile_status');
            $table->dropColumn('admin_photos_status');
            $table->dropColumn('admin_documents_status');
            $table->dropColumn('admin_availability_status');
            $table->dropColumn('admin_enhanced_dbs_status');
            $table->dropColumn('admin_references_status');
        });
    }
}
