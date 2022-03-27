<?php

namespace App\Services;

use App\Models\User;
use App\Models\AnalyticsEvent;
use App\Enums\EAnalyticsEvents;
use Illuminate\Support\Facades\Log;

/**
 * Handles recording analytics events
 *
 */
class AnalyticsService {

    /**
     * Record an analytics event
     * 
     * @param User $user The user who performed the action being recorded
     * @param EAnalyticsEvents $type The type of event being recorded
     * @param int $objectId Optional ID of the entity being acted against
     */
    public function RecordEvent($user, $type, $objectId = null) {

        if (!in_array($type, EAnalyticsEvents::cases())) {
            Log::error("Unrecognized analytics event type: " . $type);
            throw new \Exception("Unrecognized analytics event type: " . $type);
        }

        $event = new AnalyticsEvent;
        if ($user) {
            $event->user_id = $user->id;
        }
        $event->event = $type;

        if ($objectId) {
            $event->object_id = $objectId;
        }

        $event->save();
    }
}
