<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RootUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'Root',
            'surname' => 'Administrator',
            'role' => 'admin',
            'email' => env('ROOT_ADMIN_EMAIL'),
            'password' => Hash::make(env('ROOT_ADMIN_PSWD')),
            'profile_additional_images' => "[]",
            'address_line_1' => "",
            'city' => '',
            'email_validation_token' => '',
            'favourite_tutors' => '[]',
            'weekly_availability' => '{}',
            'qualifications' => '[]',
            'verification_documents' => '[]',
            'qualification_documents' => '[]',
            'optional_documents' => '[]',
            'new_subjects' => '[]',
            'message_uuid' => (string)Str::orderedUuid(),
            'company_bios' => '[]',
            'qualification_proof_documents' => '[]'
        ]);
    }
}
