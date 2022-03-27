<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

/**
 * Review
 * 
 * Represents a students review of a tutor, including fields for the back and forth approval and escalation processes
 */
class Review extends Model
{
    use HasFactory;

    protected $table = "tutor_reviews";

    public function reviewer() {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function reviewee() {
        return $this->belongsTo(User::class, 'user_id');
    }
}
