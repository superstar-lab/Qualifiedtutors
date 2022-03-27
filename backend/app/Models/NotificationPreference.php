<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Notification Preference
 * 
 * Contains a users email & SMS preferences for a given notification type
 * 
 * @see Enums/ENotificationTypes
 */
class NotificationPreference extends Model
{
    use HasFactory;
}
