<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Analytics Event
 * 
 * Stores information about important events that occur within the system that are of interest to users.
 */
class AnalyticsEvent extends Model
{
    use HasFactory;

    protected $table = 'analytics';
}
