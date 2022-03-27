<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Enums\ESubjectLevels;

class FakeReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tutor1 = DB::table('users')->select('id')->where('email', 'jon@bon.com')->first();
        $tutor2 = DB::table('users')->select('id')->where('email', 'nat@wyn.com')->first();
        $agency = DB::table('users')->select('id')->where('email', 'agency@example.com')->first();

        $student1 = DB::table('users')->select('id')->where('email', 'pattie@king.com')->first();
        $student2 = DB::table('users')->select('id')->where('email', 'megan@sinclair.com')->first();
        $student3 = DB::table('users')->select('id')->where('email', 'sean@frost.com')->first();
        $student4 = DB::table('users')->select('id')->where('email', 'jude@butcher.com')->first();
        $student5 = DB::table('users')->select('id')->where('email', 'finlay@parker.com')->first();

        $reviews = [[
            'user_id' => $tutor1->id,
            'reviewer_id' => $student1->id,
            'rating' => 3,
            'review' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel,
            'reviewee_acceptance' => 'approved',
            'created_at' => date("Y-m-d H:i:s")
        ], [
            'user_id' => $tutor1->id,
            'reviewer_id' => $student2->id,
            'rating' => 4,
            'review' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel,
            'reviewee_acceptance' => 'approved',
            'tutor_response' => "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            'created_at' => date("Y-m-d H:i:s")
        ], [
            'user_id' => $tutor1->id,
            'reviewer_id' => $student4->id,
            'rating' => 4,
            'review' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel,
            'reviewee_acceptance' => 'approved',
            'created_at' => date("Y-m-d H:i:s")
        ], [
            'user_id' => $tutor1->id,
            'reviewer_id' => $student5->id,
            'rating' => 4,
            'review' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel,
            'reviewee_acceptance' => 'approved',
            'created_at' => date("Y-m-d H:i:s")
        ], [
            'user_id' => $tutor1->id,
            'reviewer_id' => $student3->id,
            'rating' => 1,
            'review' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel,
            'reviewee_acceptance' => 'rejected',
            'reviewer_escalated' => true,
            'admin_action' => 'pending',
            'reviewee_rejection_message' => 'I did not tutor this student',
            'reviewer_escalation_message' => 'Yes he did',
            'created_at' => date("Y-m-d H:i:s")
        ],
    
        [
            'user_id' => $tutor2->id,
            'reviewer_id' => $student1->id,
            'rating' => 5,
            'review' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel,
            'reviewee_acceptance' => 'approved',
            'tutor_response' => "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            'created_at' => date("Y-m-d H:i:s")
        ], [
            'user_id' => $tutor2->id,
            'reviewer_id' => $student2->id,
            'rating' => 5,
            'review' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel,
            'reviewee_acceptance' => 'approved',
            'created_at' => date("Y-m-d H:i:s")
        ], [
            'user_id' => $tutor2->id,
            'reviewer_id' => $student3->id,
            'rating' => 1,
            'review' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel,
            'reviewee_acceptance' => 'rejected',
            'reviewer_escalated' => true,
            'admin_action' => 'pending',
            'reviewee_rejection_message' => 'Student did not show up to session',
            'reviewer_escalation_message' => '',
            'created_at' => date("Y-m-d H:i:s")
        ], 
        
        [
            'user_id' => $agency->id,
            'reviewer_id' => $student1->id,
            'rating' => 5,
            'review' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel,
            'reviewee_acceptance' => 'approved',
            'tutor_response' => "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            'created_at' => date("Y-m-d H:i:s")
        ], [
            'user_id' => $agency->id,
            'reviewer_id' => $student2->id,
            'rating' => 5,
            'review' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel,
            'reviewee_acceptance' => 'approved',
            'created_at' => date("Y-m-d H:i:s")
        ], [
            'user_id' => $agency->id,
            'reviewer_id' => $student3->id,
            'rating' => 1,
            'review' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel,
            'reviewee_acceptance' => 'rejected',
            'reviewer_escalated' => true,
            'admin_action' => 'pending',
            'reviewee_rejection_message' => 'Student did not show up to session',
            'reviewer_escalation_message' => '',
            'created_at' => date("Y-m-d H:i:s")
        ]];

        foreach($reviews as $review) {
            DB::table('tutor_reviews')->insert($review);
        }
    }
}
