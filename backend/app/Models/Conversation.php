<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;

/**
 * Conversation
 * 
 * Ties together streams of messages into a conversation between two users.
 * 
 * The intermediary table between this and users contains the fields for assigning the conversation active/archived/favourite for that given user
 */
class Conversation extends Model
{
    use HasFactory;

    public function users() {
        return $this->belongsToMany(User::class, 'users_conversations', 'conversation_id', 'user_id');
    }

    public function messages() {
        return $this->hasMany(Message::class);
    }
}
