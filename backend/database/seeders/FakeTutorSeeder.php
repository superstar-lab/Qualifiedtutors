<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Review;
use App\Enums\ESubjectLevels;
use App\Services\GeocodingService;

class FakeTutorSeeder extends Seeder
{
    private $tutors = [[
        'tutor_type' => 'tutor',
        'name' => 'Jonathan',
        'surname' => 'Bonathan',
        'email' => 'jon@bon.com',
        'password' => 'password1234',
        'address_line_1' => '71 Cherry Court',
        'address_line_2' => '',
        'city' => 'Southhampton',
        'county' => '',
        'postcode' => 'SO53 5PD',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '079 1813 4067',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/1.png',
        'profile_video_link' => 'https://www.youtube.com/embed/0JUN9aDxVmI',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'references' => [[
            "name" => "Guy Incognito",
            "email" => "guy@incognito.net",
            "mobile" => "+44123456789",
            "relationship" => "Colleague",
            "contacted" => true,
            "response" => [],
            "status" => "pending",
            "uuid" => "1d669984-aa68-4ebb-a3ca-6e6a9eca9c38"
        ], [
            "name" => "Luke Kertzwelder",
            "email" => "drl@kertz.net",
            "mobile" => "+44123456789",
            "relationship" => "Doctor",
            "contacted" => true,
            "response" => [
                'name' => 'Doctor',
                'town' => 'London',
                'email' => 'drmann@example.com',
                'phone' => '441231234',
                'title' => 'Dr',
                'rating' => 4,
                'school' => 'Queens College',
                'howLong' => '1 to 2 years',
                'surname' => 'Mann',
                'comments' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                'postcode' => 'SW1W 0NY',
                'confident' => 'yes',
                'reliability' => 'good',
                'addressLine1' => '123 Fake st.',
                'addressLine2' => NULL,
                'howDoYouKnow' => 'Their Doctor',
                'professionalism' => 'average',
                'trustworthyness' => 'good',
                'managementSkills' => 'weak',
            ],
            "status" => "submitted",
            "uuid" => "2d669984-aa68-4ebb-a3ca-6e6a9eca9c39"
        ]],
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'male',
        'weekly_availability' => [
            'morning' => [true, true, true, true, true, false, false],
            'afternoon' => [false, false, true, true, true, false, false],
            'evening' => [false, true, false, true, false, true, false],
            'night' => [false, false, false, false, false, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 1,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 1,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 3,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'approved',
        'average_review_score' => 4,
        'reviews' => [],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]',
        'verified_tutor_status' => 'pending'
    ], [
        'tutor_type' => 'tutor',
        'name' => 'Natalie',
        'surname' => 'Wynn',
        'email' => 'nat@wyn.com',
        'password' => 'password1234',
        'address_line_1' => '27 Haslemere Road',
        'address_line_2' => '',
        'city' => 'Eaton Green',
        'county' => '',
        'postcode' => 'LU6 9FH',
        'mobile_number' => '078 1548 9148',
        'enabled' => true,
        'draft' => false,
        'qualifications' => [[
            'school' => 'Abbey College',
            'title' => 'Mechanical Engineering BEng',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
        'profile_video_link' => '',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => false,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => true,
        'opt_aqa' => false,
        'opt_ccea' => false,
        'opt_ocr' => false,
        'opt_edexel' => true,
        'opt_wjec' => false,
        'gender' => 'female',
        'weekly_availability' => [
            'morning' => [false, true, false, true, false, false, false],
            'afternoon' => [true, true, true, false, true, false, false],
            'evening' => [false, false, false, true, false, true, false],
            'night' => [false, false, false, false, true, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 1,
            'level' => ESubjectLevels::GCSE,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 1,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 5,
            'level' => ESubjectLevels::IB,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 5,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 5,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 5,
            'level' => ESubjectLevels::KS3,
            'price_per_hour_online' => 2000,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 6,
            'level' => ESubjectLevels::KS3,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 7,
            'level' => ESubjectLevels::Intermediate,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 3500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 8,
            'level' => ESubjectLevels::ScottishHighers,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'approved',
        'average_review_score' => 3,
        'reviews' => [],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]',
        'verified_tutor_status' => 'approved',
        'verified_tutor' => true
    ], [
        'tutor_type' => 'teacher',
        'name' => 'Leja',
        'surname' => 'Medina',
        'email' => 'leja@medina.com',
        'password' => 'password1234',
        'address_line_1' => '98 Maidstone Road',
        'address_line_2' => '',
        'city' => 'Wentbridge',
        'county' => '',
        'postcode' => 'WF8 6PX',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '070 6376 0781',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Waterloo',
            'title' => 'BSc Mechanical Engineering',
            'grade' => '3.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Sussex',
            'title' => 'BSc Queens English',
            'grade' => '1.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Hogwarts',
            'title' => 'BSc Wizardry',
            'grade' => '2.5',
            'degree' => true,
            'other' => false
        ],  [
            'school' => 'School of Hard Knocks',
            'title' => 'Life Exp.',
            'grade' => '2.1',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CCT Colklaboration',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CyberOps',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Professional',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Expert',
            'degree' => false,
            'other' => true
        ]
        ],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png',
        'profile_video_link' => 'https://www.youtube.com/embed/W8VQLjnfiKY',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => true,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => true,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'female',
        'weekly_availability' => [
            'morning' => [false, true, true, true, true, false, false],
            'afternoon' => [true, false, false, true, false, false, false],
            'evening' => [true, false, false, true, false, true, false],
            'night' => [false, false, true, true, false, true, true]
        ],
        'new_subjects' => [[
            'subject_name' => 'IPSec',
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_name' => 'DNS',
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ]],
        'subjects' => [[
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 1,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 3500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 1,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 3,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'approved',
        'average_review_score' => -1,
        'reviews' => [],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]'
    ], [
        'tutor_type' => 'teacher',
        'name' => 'Marvin',
        'surname' => 'Blankenship',
        'email' => 'marvin@blankenship.com',
        'password' => 'password1234',
        'address_line_1' => '1 Copthorne Way',
        'address_line_2' => '',
        'city' => 'Calmsden',
        'county' => '',
        'postcode' => 'GL7 5AS',
        'enabled' => false,
        'draft' => true,
        'mobile_number' => '078 4577 6432',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Waterloo',
            'title' => 'BSc Mechanical Engineering',
            'grade' => '3.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Sussex',
            'title' => 'BSc Queens English',
            'grade' => '1.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Hogwarts',
            'title' => 'BSc Wizardry',
            'grade' => '2.5',
            'degree' => true,
            'other' => false
        ],  [
            'school' => 'School of Hard Knocks',
            'title' => 'Life Exp.',
            'grade' => '2.1',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CCT Colklaboration',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CyberOps',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Professional',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Expert',
            'degree' => false,
            'other' => true
        ]
        ],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/5.jpg',
        'profile_video_link' => 'https://www.youtube.com/embed/W8VQLjnfiKY',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => true,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => true,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'male',
        'weekly_availability' => [
            'morning' => [false, true, true, true, true, false, false],
            'afternoon' => [true, false, false, true, false, false, false],
            'evening' => [true, false, false, true, false, true, false],
            'night' => [false, false, true, true, false, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 4,
            'level' => ESubjectLevels::ElevenPlus,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 5,
            'level' => ESubjectLevels::ThirteenPlus,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 6,
            'level' => ESubjectLevels::KS1,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 7,
            'level' => ESubjectLevels::KS2,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 8,
            'level' => ESubjectLevels::KS3,
            'price_per_hour_online' => 3500,
            'price_per_hour_in_person' => 5500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'pending',
        'average_review_score' => -1,
        'reviews' => [],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]'
    ],  [
        'tutor_type' => 'tutor',
        'name' => 'Rajan',
        'surname' => 'Barnard',
        'email' => 'rajan@barnard.com',
        'password' => 'password1234',
        'address_line_1' => '97 Sutton Wick Lane',
        'address_line_2' => '',
        'city' => 'Brimington',
        'county' => '',
        'postcode' => 'S43 0UG',
        'enabled' => false,
        'draft' => true,
        'mobile_number' => '078 4577 6432',
        'qualifications' => [],
        'profile_image' => '',
        'profile_video_link' => '',
        'profile_additional_images' => [
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => [],
        'qualification_documents' => [],
        'optional_documents' => [],
        'opt_degree' => false,
        'opt_dbs' => false,
        'opt_enhanced_dbs' => false,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => false,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => false,
        'gender' => 'male',
        'weekly_availability' => [
            'morning' => [false, false, false, false, false, false, false],
            'afternoon' => [false, false, false, false, false, false, false],
            'evening' => [false, false, false, false, false, false, false],
            'night' => [false, false, false, false, false, false, false]
        ],
        'new_subjects' => [],
        'subjects' => [],
        'validation_status' => 'pending',
        'average_review_score' => -1,
        'reviews' => [],
        'company_bios' => '[]',
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'qualification_proof_documents' => '[]'
    ], [
        'tutor_type' => 'tutor',
        'name' => 'Charis',
        'surname' => 'Arroyo',
        'email' => 'charis@arroyo.com',
        'password' => 'password1234',
        'address_line_1' => '32 Bishopthorpe Road',
        'address_line_2' => '',
        'city' => 'Pencraig',
        'county' => '',
        'postcode' => 'SY10 5ZQ',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '079 3988 7261',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/6.jpg',
        'profile_video_link' => 'https://www.youtube.com/embed/0JUN9aDxVmI',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'male',
        'weekly_availability' => [
            'morning' => [true, true, true, true, true, false, false],
            'afternoon' => [false, false, true, true, true, false, false],
            'evening' => [false, true, false, true, false, true, false],
            'night' => [false, false, false, false, false, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 1,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 1,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 3,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'approved',
        'average_review_score' => -1,
        'reviews' => [[
            'reviewer_id' => 1,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 2,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ]],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]'
    ], [
        'tutor_type' => 'tutor',
        'name' => 'Millie-Rose',
        'surname' => 'Dolan',
        'email' => 'millie@dolan.com',
        'password' => 'password1234',
        'address_line_1' => '8 Terrick Rd',
        'address_line_2' => '',
        'city' => 'Elishaw',
        'county' => '',
        'postcode' => 'NE19 7UN',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '079 1166 5158',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ],  [
            'school' => 'University of Waterloo',
            'title' => 'BSc Mechanical Engineering',
            'grade' => '3.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Sussex',
            'title' => 'BSc Queens English',
            'grade' => '1.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Hogwarts',
            'title' => 'BSc Wizardry',
            'grade' => '2.5',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CCT Colklaboration',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CyberOps',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Professional',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Expert',
            'degree' => false,
            'other' => true
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/19.jpg',
        'profile_video_link' => 'https://www.youtube.com/embed/0JUN9aDxVmI',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf', '21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf', '264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'male',
        'weekly_availability' => [
            'morning' => [true, true, true, true, true, false, false],
            'afternoon' => [false, false, true, true, true, false, false],
            'evening' => [false, true, false, true, false, true, false],
            'night' => [false, false, false, false, false, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 10,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 11,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 12,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 13,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 14,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 15,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 16,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 17,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 18,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'approved',
        'average_review_score' => -1,
        'reviews' => [[
            'reviewer_id' => 1,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 2,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 3,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 4,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 5,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 6,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ]],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]'
    ], [
        'tutor_type' => 'tutor',
        'name' => 'Iolo',
        'surname' => 'Amin',
        'email' => 'iolo@amin.com',
        'password' => 'password1234',
        'address_line_1' => '80 St Maurices Road',
        'address_line_2' => '',
        'city' => 'Puncheston',
        'county' => '',
        'postcode' => 'SA62 4SU',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '077 5087 9977',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ],  [
            'school' => 'University of Waterloo',
            'title' => 'BSc Mechanical Engineering',
            'grade' => '3.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Sussex',
            'title' => 'BSc Queens English',
            'grade' => '1.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Hogwarts',
            'title' => 'BSc Wizardry',
            'grade' => '2.5',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CCT Colklaboration',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CyberOps',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Professional',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Expert',
            'degree' => false,
            'other' => true
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/7.jpg',
        'profile_video_link' => 'https://www.youtube.com/embed/0JUN9aDxVmI',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf', '21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf', '264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'male',
        'weekly_availability' => [
            'morning' => [true, true, true, true, true, false, false],
            'afternoon' => [false, false, true, true, true, false, false],
            'evening' => [false, true, false, true, false, true, false],
            'night' => [false, false, false, false, false, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 10,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 11,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 12,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 13,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 14,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 15,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 16,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 17,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 18,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'approved',
        'average_review_score' => 4,
        'reviews' => [[
            'reviewer_id' => 1,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 2,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 3,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 4,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 5,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 6,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ]],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]'
    ], [
        'tutor_type' => 'tutor',
        'name' => 'Yunus',
        'surname' => 'Terry',
        'email' => 'yunus@terry.com',
        'password' => 'password1234',
        'address_line_1' => '79 Sutton Wick Lane',
        'address_line_2' => '',
        'city' => 'Bridport',
        'county' => '',
        'postcode' => 'DT6 9ZJ',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '070 7988 1573',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ],  [
            'school' => 'University of Waterloo',
            'title' => 'BSc Mechanical Engineering',
            'grade' => '3.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Sussex',
            'title' => 'BSc Queens English',
            'grade' => '1.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Hogwarts',
            'title' => 'BSc Wizardry',
            'grade' => '2.5',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CCT Colklaboration',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CyberOps',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Professional',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Expert',
            'degree' => false,
            'other' => true
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/8.jpg',
        'profile_video_link' => 'https://www.youtube.com/embed/0JUN9aDxVmI',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf', '21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf', '264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'male',
        'weekly_availability' => [
            'morning' => [true, true, true, true, true, false, false],
            'afternoon' => [false, false, true, true, true, false, false],
            'evening' => [false, true, false, true, false, true, false],
            'night' => [false, false, false, false, false, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 10,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 11,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 12,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 13,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 14,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 15,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 16,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 17,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 18,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'approved',
        'average_review_score' => 4,
        'reviews' => [[
            'reviewer_id' => 1,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 2,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 3,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 4,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 5,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 6,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ]],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]'
    ], [
        'tutor_type' => 'tutor',
        'name' => 'Conall',
        'surname' => 'Nieves',
        'email' => 'conall@nieves.com',
        'password' => 'password1234',
        'address_line_1' => '42 Mill Lane',
        'address_line_2' => '',
        'city' => 'Cornwell',
        'county' => '',
        'postcode' => 'OX7 2WJ',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '078 3504 5710',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ],  [
            'school' => 'University of Waterloo',
            'title' => 'BSc Mechanical Engineering',
            'grade' => '3.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Sussex',
            'title' => 'BSc Queens English',
            'grade' => '1.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Hogwarts',
            'title' => 'BSc Wizardry',
            'grade' => '2.5',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CCT Colklaboration',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CyberOps',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Professional',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Expert',
            'degree' => false,
            'other' => true
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/9.jpg',
        'profile_video_link' => 'https://www.youtube.com/embed/0JUN9aDxVmI',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf', '21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf', '264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'male',
        'weekly_availability' => [
            'morning' => [true, true, true, true, true, false, false],
            'afternoon' => [false, false, true, true, true, false, false],
            'evening' => [false, true, false, true, false, true, false],
            'night' => [false, false, false, false, false, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 10,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 11,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 12,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 13,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 14,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 15,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 16,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 17,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 18,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'approved',
        'average_review_score' => 4,
        'reviews' => [[
            'reviewer_id' => 1,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 2,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 3,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 4,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 5,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 6,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ]],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]'
    ], [
        'tutor_type' => 'tutor',
        'name' => 'Jamelia',
        'surname' => 'Hernandez',
        'email' => 'jamelia@hernandez.com',
        'password' => 'password1234',
        'address_line_1' => '78 Fulford Road',
        'address_line_2' => '',
        'city' => 'Pentredwr',
        'county' => '',
        'postcode' => 'LL20 7DH',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '077 4237 5775',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ],  [
            'school' => 'University of Waterloo',
            'title' => 'BSc Mechanical Engineering',
            'grade' => '3.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Sussex',
            'title' => 'BSc Queens English',
            'grade' => '1.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Hogwarts',
            'title' => 'BSc Wizardry',
            'grade' => '2.5',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CCT Colklaboration',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CyberOps',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Professional',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Expert',
            'degree' => false,
            'other' => true
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/10.jpg',
        'profile_video_link' => 'https://www.youtube.com/embed/0JUN9aDxVmI',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf', '21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf', '264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'female',
        'weekly_availability' => [
            'morning' => [true, true, true, true, true, false, false],
            'afternoon' => [false, false, true, true, true, false, false],
            'evening' => [false, true, false, true, false, true, false],
            'night' => [false, false, false, false, false, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 10,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 11,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 12,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 13,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 14,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 15,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 16,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 17,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 18,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'approved',
        'average_review_score' => 4,
        'reviews' => [[
            'reviewer_id' => 1,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 2,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 3,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 4,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 5,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 6,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ]],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]'
    ], [
        'tutor_type' => 'tutor',
        'name' => 'Lea',
        'surname' => 'Kay',
        'email' => 'lea@kay.com',
        'password' => 'password1234',
        'address_line_1' => '94 South Western Terrace',
        'address_line_2' => '',
        'city' => 'Milton Lockhart',
        'county' => '',
        'postcode' => 'ML8 8HU',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '070 7685 3511',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ],  [
            'school' => 'University of Waterloo',
            'title' => 'BSc Mechanical Engineering',
            'grade' => '3.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Sussex',
            'title' => 'BSc Queens English',
            'grade' => '1.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Hogwarts',
            'title' => 'BSc Wizardry',
            'grade' => '2.5',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CCT Colklaboration',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CyberOps',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Professional',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Expert',
            'degree' => false,
            'other' => true
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/11.jpg',
        'profile_video_link' => 'https://www.youtube.com/embed/0JUN9aDxVmI',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf', '21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf', '264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'female',
        'weekly_availability' => [
            'morning' => [true, true, true, true, true, false, false],
            'afternoon' => [false, false, true, true, true, false, false],
            'evening' => [false, true, false, true, false, true, false],
            'night' => [false, false, false, false, false, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 10,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 11,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 12,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 13,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 14,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 15,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 16,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 17,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 18,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'approved',
        'average_review_score' => 4,
        'reviews' => [[
            'reviewer_id' => 1,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 2,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 3,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 4,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 5,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 6,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ]],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]'
    ], [
        'tutor_type' => 'tutor',
        'name' => 'Cosmo',
        'surname' => 'Winter',
        'email' => 'cosmo@winter.com',
        'password' => 'password1234',
        'address_line_1' => '51 Wenlock Terrace',
        'address_line_2' => '',
        'city' => 'Pertenhall',
        'county' => '',
        'postcode' => 'MK44 3DZ',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '070 6809 7742',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ],  [
            'school' => 'University of Waterloo',
            'title' => 'BSc Mechanical Engineering',
            'grade' => '3.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Sussex',
            'title' => 'BSc Queens English',
            'grade' => '1.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Hogwarts',
            'title' => 'BSc Wizardry',
            'grade' => '2.5',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CCT Colklaboration',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CyberOps',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Professional',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Expert',
            'degree' => false,
            'other' => true
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/12.jpg',
        'profile_video_link' => 'https://www.youtube.com/embed/0JUN9aDxVmI',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf', '21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf', '264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'female',
        'weekly_availability' => [
            'morning' => [true, true, true, true, true, false, false],
            'afternoon' => [false, false, true, true, true, false, false],
            'evening' => [false, true, false, true, false, true, false],
            'night' => [false, false, false, false, false, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 10,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 11,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 12,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 13,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 14,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 15,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 16,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 17,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 18,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'approved',
        'average_review_score' => 4,
        'reviews' => [[
            'reviewer_id' => 1,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 2,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 3,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 4,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 5,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 6,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ]],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]'
    ], [
        'tutor_type' => 'tutor',
        'name' => 'Cinar',
        'surname' => 'Rooney',
        'email' => 'cinar@rooney.com',
        'password' => 'password1234',
        'address_line_1' => '75 South Western Terrace',
        'address_line_2' => '',
        'city' => 'Milton Of Cullerlie',
        'county' => '',
        'postcode' => 'AB32 2WD',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '078 0839 4146',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ],  [
            'school' => 'University of Waterloo',
            'title' => 'BSc Mechanical Engineering',
            'grade' => '3.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Sussex',
            'title' => 'BSc Queens English',
            'grade' => '1.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Hogwarts',
            'title' => 'BSc Wizardry',
            'grade' => '2.5',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CCT Colklaboration',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CyberOps',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Professional',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Expert',
            'degree' => false,
            'other' => true
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/13.jpg',
        'profile_video_link' => 'https://www.youtube.com/embed/0JUN9aDxVmI',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf', '21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf', '264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'female',
        'weekly_availability' => [
            'morning' => [true, true, true, true, true, false, false],
            'afternoon' => [false, false, true, true, true, false, false],
            'evening' => [false, true, false, true, false, true, false],
            'night' => [false, false, false, false, false, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 10,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 11,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 12,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 13,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 14,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 15,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 16,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 17,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 18,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'approved',
        'average_review_score' => 4,
        'reviews' => [[
            'reviewer_id' => 1,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 2,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 3,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 4,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 5,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 6,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ]],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]'
    ], [
        'tutor_type' => 'tutor',
        'name' => 'Aiysha',
        'surname' => 'Head',
        'email' => 'aiysha@head.com',
        'password' => 'password1234',
        'address_line_1' => '55 Bouverie Road',
        'address_line_2' => '',
        'city' => 'Westley',
        'county' => '',
        'postcode' => 'IP33 9WS',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '078 0569 4982',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ],  [
            'school' => 'University of Waterloo',
            'title' => 'BSc Mechanical Engineering',
            'grade' => '3.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Sussex',
            'title' => 'BSc Queens English',
            'grade' => '1.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Hogwarts',
            'title' => 'BSc Wizardry',
            'grade' => '2.5',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CCT Colklaboration',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CyberOps',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Professional',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Expert',
            'degree' => false,
            'other' => true
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/14.jpg',
        'profile_video_link' => 'https://www.youtube.com/embed/0JUN9aDxVmI',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf', '21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf', '264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'female',
        'weekly_availability' => [
            'morning' => [true, true, true, true, true, false, false],
            'afternoon' => [false, false, true, true, true, false, false],
            'evening' => [false, true, false, true, false, true, false],
            'night' => [false, false, false, false, false, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 10,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 11,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 12,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 13,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 14,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 15,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 16,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 17,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 18,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'approved',
        'average_review_score' => 4,
        'reviews' => [[
            'reviewer_id' => 1,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 2,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 3,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 4,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 5,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 6,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ]],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]'
    ], [
        'tutor_type' => 'tutor',
        'name' => 'Elsa',
        'surname' => 'Hood',
        'email' => 'elsa@hood.com',
        'password' => 'password1234',
        'address_line_1' => '55 Great Western Road',
        'address_line_2' => '',
        'city' => 'Lopcombe Corner',
        'county' => '',
        'postcode' => 'SP5 6YJ',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '077 3118 8093',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ],  [
            'school' => 'University of Waterloo',
            'title' => 'BSc Mechanical Engineering',
            'grade' => '3.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Sussex',
            'title' => 'BSc Queens English',
            'grade' => '1.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Hogwarts',
            'title' => 'BSc Wizardry',
            'grade' => '2.5',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CCT Colklaboration',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CyberOps',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Professional',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Expert',
            'degree' => false,
            'other' => true
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/15.jpg',
        'profile_video_link' => 'https://www.youtube.com/embed/0JUN9aDxVmI',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf', '21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf', '264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'female',
        'weekly_availability' => [
            'morning' => [true, true, true, true, true, false, false],
            'afternoon' => [false, false, true, true, true, false, false],
            'evening' => [false, true, false, true, false, true, false],
            'night' => [false, false, false, false, false, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 10,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 11,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 12,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 13,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 14,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 15,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 16,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 17,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 18,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'approved',
        'average_review_score' => 4,
        'reviews' => [[
            'reviewer_id' => 1,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 2,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 3,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 4,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 5,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 6,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ]],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]'
    ], [
        'tutor_type' => 'tutor',
        'name' => 'Nayla',
        'surname' => 'Devine',
        'email' => 'nayla@devine.com',
        'password' => 'password1234',
        'address_line_1' => '22 Wrexham Road',
        'address_line_2' => '',
        'city' => 'Fawler',
        'county' => '',
        'postcode' => 'OX7 5YB',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '070 6681 7593',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ],  [
            'school' => 'University of Waterloo',
            'title' => 'BSc Mechanical Engineering',
            'grade' => '3.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Sussex',
            'title' => 'BSc Queens English',
            'grade' => '1.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Hogwarts',
            'title' => 'BSc Wizardry',
            'grade' => '2.5',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CCT Colklaboration',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CyberOps',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Professional',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Expert',
            'degree' => false,
            'other' => true
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/16.jpg',
        'profile_video_link' => 'https://www.youtube.com/embed/0JUN9aDxVmI',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf', '21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf', '264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'female',
        'weekly_availability' => [
            'morning' => [true, true, true, true, true, false, false],
            'afternoon' => [false, false, true, true, true, false, false],
            'evening' => [false, true, false, true, false, true, false],
            'night' => [false, false, false, false, false, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 10,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 11,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 12,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 13,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 14,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 15,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 16,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 17,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 18,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'approved',
        'average_review_score' => 4,
        'reviews' => [[
            'reviewer_id' => 1,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 2,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 3,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 4,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 5,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 6,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ]],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]'
    ], [
        'tutor_type' => 'tutor',
        'name' => 'Saffa',
        'surname' => "O'Connor",
        'email' => 'saffa@oconnor.com',
        'password' => 'password1234',
        'address_line_1' => '16 Exning Road',
        'address_line_2' => '',
        'city' => 'Hardingstone',
        'county' => '',
        'postcode' => 'NN4 3XY',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '079 6256 0449',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ],  [
            'school' => 'University of Waterloo',
            'title' => 'BSc Mechanical Engineering',
            'grade' => '3.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Sussex',
            'title' => 'BSc Queens English',
            'grade' => '1.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Hogwarts',
            'title' => 'BSc Wizardry',
            'grade' => '2.5',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CCT Colklaboration',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CyberOps',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Professional',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Expert',
            'degree' => false,
            'other' => true
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/17.jpg',
        'profile_video_link' => 'https://www.youtube.com/embed/0JUN9aDxVmI',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf', '21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf', '264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'female',
        'weekly_availability' => [
            'morning' => [true, true, true, true, true, false, false],
            'afternoon' => [false, false, true, true, true, false, false],
            'evening' => [false, true, false, true, false, true, false],
            'night' => [false, false, false, false, false, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 10,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 11,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 12,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 13,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 14,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 15,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 16,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 17,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 18,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'approved',
        'average_review_score' => 4,
        'reviews' => [[
            'reviewer_id' => 1,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 2,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 3,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 4,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 5,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 6,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ]],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]'
    ], [
        'tutor_type' => 'tutor',
        'name' => 'Lyndon',
        'surname' => "Hebert",
        'email' => 'lyndon@herbert.com',
        'password' => 'password1234',
        'address_line_1' => '53 Horsefair Green',
        'address_line_2' => '',
        'city' => 'Orange Lane',
        'county' => '',
        'postcode' => 'TD12 9HB',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '070 4970 6668',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ],  [
            'school' => 'University of Waterloo',
            'title' => 'BSc Mechanical Engineering',
            'grade' => '3.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Sussex',
            'title' => 'BSc Queens English',
            'grade' => '1.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Hogwarts',
            'title' => 'BSc Wizardry',
            'grade' => '2.5',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CCT Colklaboration',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CyberOps',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Professional',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Expert',
            'degree' => false,
            'other' => true
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/18.jpg',
        'profile_video_link' => 'https://www.youtube.com/embed/0JUN9aDxVmI',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf', '21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf', '264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'female',
        'weekly_availability' => [
            'morning' => [true, true, true, true, true, false, false],
            'afternoon' => [false, false, true, true, true, false, false],
            'evening' => [false, true, false, true, false, true, false],
            'night' => [false, false, false, false, false, true, true]
        ],
        'new_subjects' => [[
            'subject_name' => 'A new subject',
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_name' => 'Another new subject',
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_name' => 'Third new subject',
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ]],
        'subjects' => [[
            'subject_id' => 10,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 11,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 12,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 13,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 14,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 15,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 16,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 17,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 18,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'pending',
        'average_review_score' => 4,
        'reviews' => [[
            'reviewer_id' => 1,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 2,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 3,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 4,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 5,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 6,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ]],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]'
    ], [
        'tutor_type' => 'tutor',
        'name' => 'Yazmin',
        'surname' => "Welsh",
        'email' => 'yazmin@welsh.com',
        'password' => 'password1234',
        'address_line_1' => '24 Ballifeary Road',
        'address_line_2' => '',
        'city' => 'Ballyaurgan',
        'county' => '',
        'postcode' => 'PA31 6NB',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '077 5959 7517',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ],  [
            'school' => 'University of Waterloo',
            'title' => 'BSc Mechanical Engineering',
            'grade' => '3.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Sussex',
            'title' => 'BSc Queens English',
            'grade' => '1.1',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'University of Hogwarts',
            'title' => 'BSc Wizardry',
            'grade' => '2.5',
            'degree' => true,
            'other' => false
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CCT Colklaboration',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'CyberOps',
            'grade' => 'Associate',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Professional',
            'degree' => false,
            'other' => true
        ], [
            'school' => 'Cisco Academy',
            'title' => 'DevNet',
            'grade' => 'Expert',
            'degree' => false,
            'other' => true
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/19.jpg',
        'profile_video_link' => 'https://www.youtube.com/embed/0JUN9aDxVmI',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "Hello there! I’m a full time private tutor who has moved back to London this year. I completed a master’s degree in maths at Leeds University and have been teaching ever since.",
        'profile_about_you' => "A highly professional and enthusiastic Maths and Physics tutor, with over 8 years experience of teaching 11+ to A-Level, now a masters engineering graduate of Imperial College London and the University of Southampton.

            I am flexible with my tutoring style and make sure to tailor lessons to target particular problem topics or areas! I know how exciting life in the STEM (Science, Engineering, Technology and Maths) world can be and I am passionate about setting the foundations for an exciting career!
            
            I am a masters graduate in both Mechanical Engineering and Business from Southampton University and Imperial College London. I always like to go the extra mile and aid in providing my students with the best possible advice on University choices.
            
            My work has taken me across the world, and I reflect the passion I hold for STEM subjects through my tutoring to inspire my students to achieve their potential.

            If you have any questions, please don't hesitate to get in touch!",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf', '21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf', '264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'female',
        'weekly_availability' => [
            'morning' => [true, true, true, true, true, false, false],
            'afternoon' => [false, false, true, true, true, false, false],
            'evening' => [false, true, false, true, false, true, false],
            'night' => [false, false, false, false, false, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 10,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 11,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 12,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 13,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 14,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ], [
            'subject_id' => 15,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 16,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 17,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 18,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'pending',
        'average_review_score' => 4,
        'reviews' => [[
            'reviewer_id' => 1,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 2,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 3,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 4,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 5,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 6,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ]],
        'banner_image' => "",
        'company_name' => "",
        'company_tagline' => '',
        'company_website' => '',
        'company_blurb' => "",
        'company_bios' => '[]',
        'qualification_proof_documents' => '[]'
    ], [
        'tutor_type' => 'agency',
        'name' => 'Agency',
        'surname' => 'Owner',
        'email' => 'agency@example.com',
        'password' => 'password1234',
        'address_line_1' => 'Wharford Ln',
        'address_line_2' => '',
        'city' => 'Runcorn',
        'county' => '',
        'postcode' => 'WA7 1QU',
        'enabled' => true,
        'draft' => false,
        'mobile_number' => '079 1813 4067',
        'qualifications' => [[
            'school' => 'University of Cambridge',
            'title' => 'BSc Chemistry',
            'grade' => '2.1',
            'degree' => true,
            'other' => false
        ]],
        'profile_image' => 'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/1.png',
        'profile_video_link' => 'https://www.youtube.com/embed/0JUN9aDxVmI',
        'profile_additional_images' => [
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/2.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/3.png',
            'https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/4.png'
        ],
        'profile_summary' => "We've successfully delivered small-group tuition to hundreds of young people in the UK with ever expanding venues and sessions. We offer face to face sessions in the Runcorn area and online sessions globally. Experienced DBS checked tutors. Please get in touch!",
        'profile_about_you' => "We are a tutoring company based in Runcorn, Frodsham and Helsby, teaching exam focused tuition to GCSE students in Maths, English and Science as well as the 11+ entrance exam. We also tutor Numeracy and Literacy Year 1 – 6.

            We are currently running our sessions online but as soon as it is safe to do so we will be back to our venues at Sandymoor School in Runcorn and Helsby Community Sports Centre in Helsby.
            
            Our sessions have a maximum of 6 students which allows students to develop confidence and receive individual support. For GCSE we rotate the 3 core subjects of Maths, Science and English over a 2 hour session. The cost of this £28 online.
            
            At Key stage 3 we rotate Maths and English over an hour and a half.
            
            We focus on exam technique and skills as well as covering the content at GCSE. If you are looking for a subject that we haven’t listed, we advise you to get in touch since we ae adding new tutors to our books every week.",
        'free_video_chat_enabled' => false,
        'verification_documents' => ['0079bb93-84ea-4fe9-80a4-53950ea4cd04/yFcru3FP6QjuQJ78cdq2mWCuy3Q2UJ5Lg2o6u5cT.pdf'],
        'qualification_documents' => ['21f4128e-2b17-4163-b5fe-4ce7f29324cf/hsh7lbXCtKFXafrO3p7n2swgmhk5N3szoygbYr0A.pdf'],
        'optional_documents' => ['264914d5-02ef-4801-bcd3-70a33ce85efc/j9DKaKZDKYt2ssBmN3giVXLbVDcZPp7bprc46YcN.pdf'],
        'opt_degree' => true,
        'opt_dbs' => true,
        'opt_enhanced_dbs' => true,
        'opt_examiner' => false,
        'opt_aqa' => false,
        'opt_ccea' => true,
        'opt_ocr' => false,
        'opt_edexel' => false,
        'opt_wjec' => true,
        'gender' => 'male',
        'weekly_availability' => [
            'morning' => [true, true, true, true, true, false, false],
            'afternoon' => [false, false, true, true, true, false, false],
            'evening' => [false, true, false, true, false, true, false],
            'night' => [false, false, false, false, false, true, true]
        ],
        'new_subjects' => [],
        'subjects' => [[
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 1,
            'level' => ESubjectLevels::Degree,
            'price_per_hour_online' => 2500,
            'price_per_hour_in_person' => 6500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 1,
            'level' => ESubjectLevels::Grade13,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ],[
            'subject_id' => 1,
            'level' => ESubjectLevels::ElevenPlus,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ],[
            'subject_id' => 1,
            'level' => ESubjectLevels::KS1,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ],[
            'subject_id' => 1,
            'level' => ESubjectLevels::KS2,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ],[
            'subject_id' => 1,
            'level' => ESubjectLevels::KS3,
            'price_per_hour_online' => 1500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel,
            'price_per_hour_online' => 2500,
            'online' => true,
            'in_person' => true
        ], [
            'subject_id' => 3,
            'level' => ESubjectLevels::National45,
            'price_per_hour_online' => 3500,
            'online' => true,
            'in_person' => false
        ]],
        'validation_status' => 'approved',
        'average_review_score' => 4,
        'reviews' => [[
            'reviewer_id' => 1,
            'rating' => 3,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 1,
            'level' => ESubjectLevels::ALevel
        ], [
            'reviewer_id' => 2,
            'rating' => 5,
            'review' => "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            'subject_id' => 2,
            'level' => ESubjectLevels::ALevel
        ]],
        'banner_image' => "https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/company-profile-id123.png",
        'company_name' => "Conexus",
        'company_tagline' => 'Education Centre, Tutoring Centre, Tuition Centre',
        'company_website' => 'https://google.com',
        'company_blurb' => "We've successfully delivered small-group tuition to hundreds of young people in the UK with ever expanding venues and sessions. We offer face to face sessions in the Runcorn area and online sessions globally. Experienced DBS checked tutors. Please get in touch!",
        'company_bios' => [[
            'name' => "Wanda Ditko",
            'blurb' => "Conexus was founded by experienced teacher and maths graduate Eleaner Pena. Eleanor tutors GCSE level students.",
            'imageUrl' => "https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/tutor-001.png"
        ], [
            'name' => "Blane Watson",
            'blurb' => "Lorem ipsum dolar sit amet, ipsum dolar sit amet.",
            'imageUrl' => "https://qualified-tutors-tmp.s3.ca-central-1.amazonaws.com/tutor-002.png"
        ]],
        'qualification_proof_documents' => '[]'
    ]];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $geocodingService = new GeocodingService;

        foreach($this->tutors as $tutor) {
            $user = new User;
            $user->tutor_type = $tutor['tutor_type'];
            $user->name = $tutor['name'];
            $user->surname = $tutor['surname'];
            $user->email = $tutor['email'];
            $user->password = $tutor['password'];
            $user->address_line_1 = $tutor['address_line_1'];
            $user->address_line_2 = $tutor['address_line_2'];
            $user->city = $tutor['city'];
            $user->county = $tutor['county'];
            $user->postcode = $tutor['postcode'];
            $user->enabled = $tutor['enabled'];
            $user->mobile_number = $tutor['mobile_number'];
            $user->draft = $tutor['draft'];
            $user->qualifications = json_encode($tutor['qualifications']);
            $user->profile_image = $tutor['profile_image'];
            $user->profile_video_link = $tutor['profile_video_link'];
            $user->profile_additional_images = json_encode($tutor['profile_additional_images']);
            $user->profile_summary = $tutor['profile_summary'];
            $user->profile_about_you = $tutor['profile_about_you'];
            $user->free_video_chat_enabled = $tutor['free_video_chat_enabled'];
            $user->verification_documents = json_encode($tutor['verification_documents']);
            $user->qualification_documents = json_encode($tutor['qualification_documents']);
            $user->optional_documents = json_encode($tutor['optional_documents']);
            $user->opt_degree = $tutor['opt_degree'];
            $user->opt_dbs = $tutor['opt_dbs'];
            $user->opt_enhanced_dbs = $tutor['opt_enhanced_dbs'];
            $user->opt_examiner = $tutor['opt_examiner'];
            $user->opt_aqa = $tutor['opt_aqa'];
            $user->opt_ccea = $tutor['opt_ccea'];
            $user->opt_ocr = $tutor['opt_ocr'];
            $user->opt_edexel = $tutor['opt_edexel'];
            $user->opt_wjec = $tutor['opt_wjec'];
            $user->role = 'tutor';
            $user->email_validation_token = (string)Str::orderedUuid();
            $user->message_uuid = (string)Str::orderedUuid(); 
            $user->favourite_tutors = "[]";
            $user->weekly_availability = json_encode($tutor['weekly_availability']);
            $user->new_subjects = json_encode($tutor['new_subjects']);
            $user->validation_status = $tutor['validation_status'];
            $user->average_review_score = $tutor['average_review_score'];
            $user->gender = $tutor['gender'];
            $loc = $geocodingService->GetLatLngForUser($user);
            $user->latitude = $loc[0];
            $user->longitude = $loc[1];

            $user->banner_image = $tutor['banner_image'];
            $user->company_name = $tutor['company_name'];
            $user->company_tagline = $tutor['company_tagline'];
            $user->company_website = $tutor['company_website'];
            $user->banner_image = $tutor['banner_image'];
            $user->company_blurb = $tutor['company_blurb'];
            $user->company_bios = $tutor['company_bios'] != '[]' ? json_encode($tutor['company_bios']) : '[]';
            $user->qualification_proof_documents = '[]';

            if (array_key_exists('references', $tutor)) {
                $user->references = json_encode($tutor['references']);
            } else {
                $user->references = '[]';
            }
         
            if (array_key_exists('verified_tutor_status', $tutor)) {
                $user->verified_tutor_status = $tutor['verified_tutor_status'];
            }

            if (array_key_exists('verified_tutor', $tutor)) {
                $user->verified_tutor = $tutor['verified_tutor'];
            }

            $user->save();
            $user->refresh();

            foreach($tutor['subjects'] as $subject) {
                $id = $subject['subject_id'];
                unset($subject['subject_id']);
                $user->subjects()->attach($id, $subject);
            }
            $user->save();

            foreach($tutor['reviews'] as $review) {
                $r = new Review;
                $r->user_id = $user->id;
                $r->reviewer_id = $review['reviewer_id'];
                $r->rating = $review['rating'];
                $r->review = $review['review'];
                $r->subject_id = $review['subject_id'];
                $r->level = $review['level'];
                $r->save();
            }
        }
    }
}
