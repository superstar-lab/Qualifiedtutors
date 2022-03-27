<?php

namespace App\Services;

use App\Models\User;
use App\Models\Message;
use App\Models\AnalyticsEvent;
use App\Enums\EAnalyticsEvents;
use Illuminate\Support\Facades\Log;

/**
 * Handles various asynchronus tasks around tutors
 *
 */
class TutorService {

    /**
     * Recalculate average review scores
     * 
     * Calculates each active tutors average review score. Scheduled to run daily.
     */
    public function RecalculateAverageReviewScores() {

        User::with('reviews')
            ->where([
                'role' => 'tutor',
                'enabled' => true,
                'validation_status' => 'approved'
            ])
            ->chunk(25, function($tutors) {
                
                foreach($tutors as $tutor) {
                    $totalScore = 0;
                    $totalReviews = 0;

                    foreach($tutor->reviews as $review) {
                        if ($review->reviewee_acceptance == 'approved' || $review->admin_action == 'approved') {
                            $totalReviews += 1;
                            $totalScore += $review->rating;
                        }
                    }

                    if ($totalScore > 0 && $totalReviews > 0) {
                        $tutor->average_review_score = round($totalScore / $totalReviews);
                        $tutor->review_score_based_on = $totalReviews;
                        $tutor->save();
                    }
                }
            });
    }

    /**
     * Recalculate average response time
     * 
     * Calculates the average response time for each active tutor. Scheduled to run daily.
     */
    public function RecalculateAverageResponseTimes() {

        User::where([
                'role' => 'tutor',
                'enabled' => true,
                'validation_status' => 'approved'
            ])
            ->chunk(25, function($tutors) {
                foreach($tutors as $tutor) {

                    $responseTimes = [];
                    $userId = $tutor->id;
                    $dt = null;

                    $messages = Message::where(function ($query) use ($tutor) {
                        $query->where('to_id', $tutor->id);
                        $query->orWhere('from_id', $tutor->id);
                    })->orderBy('created_at', 'asc')->chunk(25, function($messages) use ($tutor, $userId, $dt, &$responseTimes) {

           
                        foreach($messages as $message) {
                            if ($dt == null) {
                                if ($message->from_id != $tutor->id) {
                                    $userId = $message->from_id;
                                    $dt = $message->created_at;
                                }
                            } else {
                                if ($userId != $tutor->id && $message->from_id == $tutor->id) {
                                    $responseTimes[] = ((new \DateTime($message->created_at))->getTimestamp() - (new \DateTime($dt))->getTimestamp());
                                    $dt = null;
                                }
                            }
                        }
                    });

                    if (count($responseTimes) > 0) {
                        $tutor->average_response_time = round(array_sum($responseTimes) / count($responseTimes));
                        $tutor->save();
                    }
                }
            });
            
    }

    /**
     * Recalculate profile views
     * 
     * Calculates total profile views for each active tutor. Scheduled to run daily.
     */
    public function RecalculateProfileViews() {

        $now = new \DateTime();

        User::where([
            'role' => 'tutor',
            'enabled' => true,
            'validation_status' => 'approved'
        ])
        ->chunk(25, function($tutors) use (&$now) {

            foreach($tutors as $tutor) {
                $totalViews = 0;
                $lastMonth = 0;
                $thisMonth = 0;
                $thisWeek = 0;

                AnalyticsEvent::where([
                    'event' => EAnalyticsEvents::TutorProfileView,
                    'object_id' => $tutor->id
                ])
                ->chunk(25, function($events) use (&$totalViews, &$lastMonth, &$thisMonth, &$thisWeek, &$now) {
                    foreach($events as $event) {
                        $totalViews += 1;
                        $interval = $now->diff(new \DateTime($event->created_at));
                        if ($interval->m >= 1 && $interval->m < 2) {
                            $lastMonth += 1;
                        }
                        
                        if ($interval->m == 0) {
                            $thisMonth += 1;

                            if ($interval->d <= 7) {
                                $thisWeek += 1;
                            }
                        }
                    }
                });

                $tutor->profile_views_all_time = $totalViews;
                $tutor->profile_views_last_month = $lastMonth;
                $tutor->profile_views_month = $thisMonth;
                $tutor->profile_views_week = $thisWeek;
                $tutor->save();
            }
        });
    }
    
}
