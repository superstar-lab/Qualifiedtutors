<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Enums\EAnalyticsEvents;

function dt($offset) {
    return (new \DateTime($offset));
}

class FakeAnalyticsSeeder extends Seeder
{
    private $analytics = [[
        'user' => 1,
        'events' => [
            '-30days' => [EAnalyticsEvents::StudentRegistration],
            '-28days' => [EAnalyticsEvents::StudentLogin],
            '-21days' => [EAnalyticsEvents::StudentLogin],
            '-14days' => [EAnalyticsEvents::StudentLogin],
            '-7days' => [EAnalyticsEvents::StudentLogin],
            '-7days +5minutes' => [EAnalyticsEvents::StudentLogin],
            '-7days +20minutes' => [EAnalyticsEvents::StudentSentMessage],
            '-7days +22minutes' => [EAnalyticsEvents::StudentSentMessage],
            '-7days +26minutes' => [EAnalyticsEvents::StudentSentMessage],
            '-7days +38minutes' => [EAnalyticsEvents::StudentSentMessage],
            '-6days +1hour' => [EAnalyticsEvents::StudentLogin],
            '-6days +1hour +5minutes' => [EAnalyticsEvents::StudentReadMessage, EAnalyticsEvents::StudentSentMessage],
            '-6days +1hour +15minutes' => [EAnalyticsEvents::StudentReadMessage, EAnalyticsEvents::StudentSentMessage],
            '-6days +1hour +25minutes' => [EAnalyticsEvents::StudentReadMessage],
            '-4days +6hour' => [EAnalyticsEvents::StudentLogin],
            '-4days +6hour +5minutes' => [EAnalyticsEvents::StudentSentMessage],
            '-3days +6hour' => [EAnalyticsEvents::StudentLogin],
            '-3days +6hour +5minutes' => [EAnalyticsEvents::StudentSentMessage],
            '-1days +6hour' => [EAnalyticsEvents::StudentLogin],
            '-1days +6hour +5minutes' => [EAnalyticsEvents::StudentReadMessage],
            '-1hour' => [EAnalyticsEvents::StudentLogin],
            '-1hour +5minutes' => [EAnalyticsEvents::StudentReadMessage],
        ]
    ], [
        'user' => 2,
        'events' => [
            '-30days' => [EAnalyticsEvents::StudentRegistration],
            '-28days' => [EAnalyticsEvents::StudentLogin],
            '-21days' => [EAnalyticsEvents::StudentLogin],
            '-14days' => [EAnalyticsEvents::StudentLogin],
            '-7days' => [EAnalyticsEvents::StudentLogin],
            '-7days +5minutes' => [EAnalyticsEvents::StudentLogin],
            '-7days +20minutes' => [EAnalyticsEvents::StudentSentMessage],
            '-3days +6hour' => [EAnalyticsEvents::StudentLogin],
            '-3days +6hour +5minutes' => [EAnalyticsEvents::StudentSentMessage],
            '-1days +6hour' => [EAnalyticsEvents::StudentLogin],
            '-1hour' => [EAnalyticsEvents::StudentLogin],
            '-1hour +5minutes' => [EAnalyticsEvents::StudentReadMessage],
        ]
    ], [
        'user' => 4,
        'events' => [
            '-30days' => [EAnalyticsEvents::TutorRegistration],
            '-28days' => [EAnalyticsEvents::TutorLogin],
            '-21days' => [EAnalyticsEvents::TutorLogin],
            '-14days' => [EAnalyticsEvents::TutorLogin],
            '-7days' => [EAnalyticsEvents::TutorLogin],
            '-7days +8minutes' => [EAnalyticsEvents::TutorLogin],
            '-7days +27minutes' => [EAnalyticsEvents::TutorSentMessage],
            '-7days +29minutes' => [EAnalyticsEvents::TutorSentMessage],
            '-7days +31minutes' => [EAnalyticsEvents::TutorSentMessage],
            '-7days +48minutes' => [EAnalyticsEvents::TutorSentMessage],
            '-6days +2hour' => [EAnalyticsEvents::TutorLogin],
            '-6days +2hour +5minutes' => [EAnalyticsEvents::TutorReadMessage, EAnalyticsEvents::TutorSentMessage],
            '-6days +3hour +15minutes' => [EAnalyticsEvents::TutorReadMessage, EAnalyticsEvents::TutorSentMessage],
            '-6days +3hour +25minutes' => [EAnalyticsEvents::TutorReadMessage],
            '-4days +4hour' => [EAnalyticsEvents::TutorLogin],
            '-4days +4hour +5minutes' => [EAnalyticsEvents::TutorSentMessage],
            '-3days +5hour' => [EAnalyticsEvents::TutorLogin],
            '-3days +5hour +5minutes' => [EAnalyticsEvents::TutorSentMessage],
            '-1days +6hour' => [EAnalyticsEvents::TutorLogin],
            '-1days +6hour +8minutes' => [EAnalyticsEvents::TutorReadMessage],
            '-2hour' => [EAnalyticsEvents::TutorLogin],
            '-2hour +15minutes' => [EAnalyticsEvents::TutorReadMessage],
        ]
    ], [
        'user' => 5,
        'events' => [
            '-30days' => [EAnalyticsEvents::TutorRegistration],
            '-28days' => [EAnalyticsEvents::TutorLogin],
            '-21days' => [EAnalyticsEvents::TutorLogin],
            '-14days' => [EAnalyticsEvents::TutorLogin],
            '-6days' => [EAnalyticsEvents::TutorLogin],
            '-6days +8minutes' => [EAnalyticsEvents::TutorLogin],
            '-6days +27minutes' => [EAnalyticsEvents::TutorSentMessage],
            '-5days +2hour' => [EAnalyticsEvents::TutorLogin],
            '-5days +2hour +5minutes' => [EAnalyticsEvents::TutorReadMessage, EAnalyticsEvents::TutorSentMessage],
            '-5days +3hour +15minutes' => [EAnalyticsEvents::TutorReadMessage, EAnalyticsEvents::TutorSentMessage],
            '-5days +3hour +25minutes' => [EAnalyticsEvents::TutorReadMessage],
            '-3days +5hour' => [EAnalyticsEvents::TutorLogin],
            '-3days +5hour +5minutes' => [EAnalyticsEvents::TutorSentMessage],
            '-1days +6hour' => [EAnalyticsEvents::TutorLogin],
            '-6hour' => [EAnalyticsEvents::TutorLogin],
            '-6hour +15minutes' => [EAnalyticsEvents::TutorReadMessage],
        ]
    ], [
        'user' => 6,
        'events' => [
            '-5days' => [EAnalyticsEvents::AdminLogin],
            '-3days' => [EAnalyticsEvents::AdminLogin],
            '-1days' => [EAnalyticsEvents::AdminLogin],
        ]
    ]];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach ($this->analytics as $user) {
            foreach($user['events'] as $date => $events) {
                $dt = dt($date);

                foreach($events as $event) {
                    DB::table('analytics')->insert([
                        'created_at' => $dt,
                        'updated_at' => $dt,
                        'event' => $event,
                        'user_id' => $user['user']
                    ]);
                }
                
            }
        }
    }
}
