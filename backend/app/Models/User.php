<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;
use App\Models\Subject;
use App\Models\Review;
use App\Models\Message;
use App\Models\NotificationPreference;
use App\Models\Conversation;
use App\Traits\HasLocation;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasLocation;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'return_token',
        'verification_documents',
        'qualification_documents',
        'optional_documents',
        'references'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function setPasswordAttribute($password) {
        $this->attributes['password'] = Hash::make($password);
    }

    public function subjects() {
        return $this->belongsToMany(
            Subject::class, 
            'tutor_subjects', 
            'user_id', 
            'subject_id'
        )->withPivot([
            'level', 
            'price_per_hour_online', 
            'price_per_hour_in_person', 
            'online', 
            'in_person'
        ]);
    }

    public function reviews() {
        return $this->hasMany(Review::class);
    }

    public function allConversations() {

        $user = auth()->user();
        return Conversation::whereHas('users', function($query) use ($user) { 
            $query->where(['user_id' => $user->id]); 
        })
            ->with(['messages' => function($query) {
                $query->orderBy('created_at', 'desc');
                $query->limit(1);
        }]);
    }

    public function countUnreadMessages() {

        $user = auth()->user();
        $convos = Conversation::whereHas('users', function($query) use ($user) { 
            $query->where(['user_id' => $user->id]); 
        })->with(['messages' => function($subquery) use ($user) {
            $subquery->where('user_id', '!=', $user->id);
            $subquery->where('read', false);
        }]);

        $total = 0;
        foreach($convos as $convo) {
            $total += count($convo->messages);
        }

        return $total;
    }

    public function receivedMessages($searchText = null) {

        $user = auth()->user();
        return Conversation::whereHas('users', function($query) use ($user) { 
            $query->where(['user_id' => $user->id, 'favourite' => false, 'archived' => false]); 
        })
            ->with(['messages' => function($query) use ($searchText) {
                $query->orderBy('created_at', 'desc');
                $query->limit(1);
                if ($searchText) {
                    $query->where('message', 'like', '%' . $searchText . '%');
                }
        }]);
    }

    public function favouriteMessages($searchText = null) {

        $user = auth()->user();
        return Conversation::whereHas('users', function($query) use ($user) { 
            $query->where(['user_id' => $user->id, 'favourite' => true, 'archived' => false]); 
        })
            ->with(['messages' => function($query) use ($searchText) {
                $query->orderBy('created_at', 'desc');
                $query->limit(1);
                if ($searchText) {
                    $query->where('message', 'like', '%' . $searchText . '%');
                }
        }]);
    }

    public function archivedMessages($searchText = null) {

        $user = auth()->user();
        return Conversation::whereHas('users', function($query) use ($user) { 
            $query->where(['user_id' => $user->id, 'favourite' => false, 'archived' => true]); 
        })
            ->with(['messages' => function($query) use ($searchText) {
                $query->orderBy('created_at', 'desc');
                $query->limit(1);
                if ($searchText) {
                    $query->where('message', 'like', '%' . $searchText . '%');
                }
        }]);
    }

    public function conversations() {
        return $this->belongsToMany(
            Conversation::class, 
            'users_conversations',
            'user_id',
            'conversation_id'
        )->withPivot([
            'favourite',
            'archived'
        ]);
    }

    public function notificationPreferences() {
        return $this->hasMany(NotificationPreference::class);
    }
    
    /**
     * Calculate distance using the Haversine formula and include it in query result
     * 
     * @see https://laravel.com/docs/8.x/eloquent#query-scopes
     */
    public function scopeIsWithinMaxDistance($query, $lat, $lng, $radius = 2500) {

         $haversine = "(6371 * acos(cos(radians($lat)) 
                         * cos(radians(latitude)) 
                         * cos(radians(longitude) 
                         - radians($lng)) 
                         + sin(radians($lat)) 
                         * sin(radians(latitude))))";
         return $query
            ->select('*') 
            ->selectRaw("{$haversine} AS distance")
            ->whereRaw("{$haversine} < ?", [$radius]);
    }
}
