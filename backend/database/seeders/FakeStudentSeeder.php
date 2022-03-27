<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Services\GeocodingService;
use App\Models\User;
use Illuminate\Support\Str;

class FakeStudentSeeder extends Seeder
{
    private $students = [[
        'name' => 'Pattie',
        'surname' => 'King',
        'gender' => 'female',
        'email' => 'pattie@king.com',
        'password' => 'password1234',
        'accept_tos' => true,
        'address_line_1' => '61 Haslemere Road',
        'city' => 'Eastleach Turville',
        'mobile_number' => '070 0170 3385',
        'postcode' => 'GL7 5RN'
    ], [
        'name' => 'Megan',
        'surname' => 'Sinclair',
        'gender' => 'female',
        'email' => 'megan@sinclair.com',
        'password' => 'password1234',
        'accept_tos' => true,
        'address_line_1' => '61 Haslemere Road',
        'city' => 'SLAPTON',
        'mobile_number' => '079 4097 9041',
        'postcode' => 'TQ7 9DB'
    ], [
        'name' => 'Sean',
        'surname' => 'Frost',
        'gender' => 'male',
        'email' => 'sean@frost.com',
        'password' => 'password1234',
        'accept_tos' => true,
        'address_line_1' => '40 Nenthead Road',
        'city' => 'HIGH GREEN',
        'mobile_number' => '070 7262 8161',
        'postcode' => 'WR8 4TJ'
    ], [
        'name' => 'Jude',
        'surname' => 'Butcher',
        'gender' => 'male',
        'email' => 'jude@butcher.com',
        'password' => 'password1234',
        'accept_tos' => true,
        'address_line_1' => '35 Ponteland Rd',
        'city' => 'HUMBERSTONE',
        'mobile_number' => '079 8150 5201',
        'postcode' => 'LE5 9QZ'
    ], [
        'name' => 'Finlay',
        'surname' => 'Parker',
        'gender' => 'male',
        'email' => 'finlay@parker.com',
        'password' => 'password1234',
        'accept_tos' => true,
        'address_line_1' => '99 Walwyn Rd',
        'city' => 'CHARD JUNCTION',
        'mobile_number' => '070 2727 7527',
        'postcode' => 'TA20 0TX'
    ], [
        'name' => 'Georgia',
        'surname' => 'Morse',
        'gender' => 'female',
        'email' => 'georgia@morse.com',
        'password' => 'password1234',
        'accept_tos' => true,
        'address_line_1' => '9 Pier Road',
        'city' => 'Stanton Fitzwarren',
        'mobile_number' => '079 0729 2617',
        'postcode' => 'SN6 7PR'
    ], [
        'name' => 'Jozef',
        'surname' => 'Williams',
        'gender' => 'male',
        'email' => 'jozef@williams.com',
        'password' => 'password1234',
        'accept_tos' => true,
        'address_line_1' => '61 Chapel Lane',
        'city' => 'Armitage',
        'mobile_number' => '079 7938 6327',
        'postcode' => 'WS15 4BT'
    ], [
        'name' => 'Roxanne',
        'surname' => 'Walker',
        'gender' => 'female',
        'email' => 'roxanne@walker.com',
        'password' => 'password1234',
        'accept_tos' => true,
        'address_line_1' => '47 Wartnaby Road',
        'city' => 'Adversane',
        'mobile_number' => '079 6486 1364',
        'postcode' => 'RH14 2JP'
    ], [
        'name' => 'Kacper',
        'surname' => 'Lester',
        'gender' => 'male',
        'email' => 'kacper@lester.com',
        'password' => 'password1234',
        'accept_tos' => true,
        'address_line_1' => '54 Gordon Terrace',
        'city' => 'Basildon',
        'mobile_number' => '079 8398 4573',
        'postcode' => 'SS14 6QE'
    ], [
        'name' => 'Ridwan',
        'surname' => 'Hanna',
        'gender' => 'male',
        'email' => 'ridwan@hanna.com',
        'password' => 'password1234',
        'accept_tos' => true,
        'address_line_1' => '47 Ermin Street',
        'city' => 'Y Felinheli',
        'mobile_number' => '070 1104 7841',
        'postcode' => 'LL56 4HA'
    ], [
        'name' => 'Chantal',
        'surname' => 'Peters',
        'gender' => 'female',
        'email' => 'chantal@peters.com',
        'password' => 'password1234',
        'accept_tos' => true,
        'address_line_1' => '62 Cheriton Rd',
        'city' => 'West Marton',
        'mobile_number' => '077 7117 6171',
        'postcode' => 'BD23 6UY'
    ]];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $geocodingService = new GeocodingService;

        foreach($this->students as $student) {
            $user = new User;
            $user->name = $student['name'];
            $user->surname = $student['surname'];
            $user->email = $student['email'];
            $user->password = $student['password'];
            $user->address_line_1 = $student['address_line_1'];
            $user->city = $student['city'];
            $user->postcode = $student['postcode'];
            $user->enabled = true;
            $user->mobile_number = $student['mobile_number'];
            $user->email_validation_token = (string)Str::orderedUuid();
            $user->profile_additional_images = "[]";
            $user->favourite_tutors = "[]";
            $user->weekly_availability = "{}";
            $user->qualifications = "[]";
            $user->verification_documents = "[]";
            $user->qualification_documents = "[]";
            $user->optional_documents = "[]";
            $user->new_subjects = "[]";
            $user->company_bios = "[]";
            $user->qualification_proof_documents = "[]";
            $user->message_uuid = (string)Str::orderedUuid();
            
            $loc = $geocodingService->GetLatLngForUser($user);
            $user->latitude = $loc[0];
            $user->longitude = $loc[1];
            
            $user->save();
        }
    }
}
