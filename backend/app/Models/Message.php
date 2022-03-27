<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Conversation;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;

/**
 * Message
 * 
 * Represents a message sent as a part of a conversation between users.
 */
class Message extends Model
{
    use HasFactory;

    public function from() {
        return $this->belongsTo(User::class, 'from_id', 'id');
    }

    public function to() {
        return $this->belongsTo(User::class, 'to_id', 'id');
    }

    public function conversation() {
        return $this->belongsTo(Conversation::class, 'conversation_id', 'id');
    }

    /**
     * Subquery to include the latest message
     * 
     * @see https://laravel.com/docs/8.x/eloquent#query-scopes
     */
    public function scopeLastPerGroup(Builder $query, ?array $fields = null) : Builder
    {
        return $query->whereIn('id', function (QueryBuilder $query) use ($fields) {
            return $query->from(static::getTable())
                ->selectRaw('max(`id`)')
                ->groupBy($fields ?? static::$groupedLastScopeFields);
        });
    }
}
