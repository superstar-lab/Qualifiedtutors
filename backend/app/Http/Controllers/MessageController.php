<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\NotificationService;
use App\Models\Message;
use App\Models\User;
use App\Models\Conversation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{

    /**
     * Get a paginated list of a users active conversations
     * 
     * @param text  String  If present only messages containing this string will be returned
     */
    public function GetReceivedMessages(Request $request) {
        
        $validated = $request->validate([
            'text' => ['string']
        ]);

        $user = auth()->user();

        $query = null;
        if (array_key_exists('text', $validated)) {
            $query = $user->receivedMessages($validated['text']);
        } else {
            $query = $user->receivedMessages();
        }

        return $query->with('users')
                    ->orderby('created_at', 'desc')
                    ->paginate();
    }

    /**
     * Get a paginated list of a users archived conversations
     * 
     * @param text  String  If present only messages containing this string will be returned
     */
    public function GetArchivedMessages(Request $request) {
        
        $validated = $request->validate([
            'text' => ['string']
        ]);

        $user = auth()->user();

        $query = null;
        if (array_key_exists('text', $validated)) {
            $query = $user->archivedMessages($validated['text']);
        } else {
            $query = $user->archivedMessages();
        }

        return $query->with('users')
                    ->orderby('created_at', 'desc')
                    ->paginate();
    }

    /**
     * Get a paginated list of a users favourited conversations
     * 
     * @param text  String  If present only messages containing this string will be returned
     */
    public function GetFavouriteMessages(Request $request) {
        
        $validated = $request->validate([
            'text' => ['string']
        ]);

        $user = auth()->user();

        $query = null;
        if (array_key_exists('text', $validated)) {
            $query = $user->favouriteMessages($validated['text']);
        } else {
            $query = $user->favouriteMessages();
        }

        return $query->with('users')
                    ->orderby('created_at', 'desc')
                    ->paginate();
    }

    /**
     * Get a users total number of unread messages
     */
    public function GetUnreadMessageCount(Request $request) {

        $user = auth()->user();
        return $user->countUnreadMessages();
    }

    /**
     * Get stats about a users conversations for their dashboard
     */
    public function GetConversationStats(Request $request) {
        
        $user = auth()->user();
        $total = $user->receivedMessages()
            ->orderby('created_at', 'desc')
            ->count();

        return response()->json([
            'success' => true,
            'unread' => $user->countUnreadMessages(),
            'total' => $total
        ]);
    }

    /**
     * Get a paginated list of messages in a given conversation
     * 
     * A side effect of calling this endpoint is that the messages returned in the current page will be marked as read.
     * 
     * @param id    Integer Conversation ID
     * @param text  String  If present only messages containing this string will be returned
     */
    public function GetConversation(Request $request) {

        $validated = $request->validate([
            'text' => ['string']
        ]);

        $user = auth()->user();

        $query = Message::where('conversation_id', $request->route('id'));

        if (array_key_exists('text', $validated)) {
            $query->where('message', 'like', '%' . $validated['text'] . '%');
        }

        $query->with('conversation.users');

        $messages = $query->paginate();

        foreach($messages as $message) {
            if ($user->cannot('view', $message)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Unauthorized.'
                ], 403);
            }
        }

        foreach($messages as $message) {
            if (!$message->read && $message->user_id != $user->id) {
                $message->read = true;
                $message->read_at = date("Y-m-d H:i:s");
                $message->save();
            }
        }

        return $messages;
    }

    /**
     * Start a new conversation with a given user
     * 
     * All emails/phone numbers present in the message will be stripped.
     * 
     * @param message           String          Message to send
     * @param attachments       Array[String]   Array of file URLs
     * @param userMessageUuid   String          message_uuid of the user to conversate
     * 
     */
    public function SendMessage(Request $request, NotificationService $notificationService) {

        $validated = $request->validate([
            'message' => ['string', 'required'],
            'attachments' => ['nullable'],
            'attachments.*' => ['string']
        ]);

        $toUser = User::where('message_uuid', $request->route('userMessageUuid'))->first();
        $fromUser = auth()->user();

        if ($toUser->id === $fromUser->id) {
            return response()->json([
                'success' => false,
                'error' => 'You can not message yourself.'
            ], 400);
        }

        if ($toUser->role == 'tutor' && $fromUser->role == 'tutor') {
            return response()->json([
                'success' => false,
                'error' => "Tutors can not message other tutors."
            ], 403);
        }

        if ($fromUser->validation_status == 'pending') {
            return response()->json([
                'success' => false,
                'error' => 'You can not send messages before your account has been verified.'
            ], 403);
        }

        // Remove emails and phone numbers
        $msg = $validated['message'];
        $msg = preg_replace("/[^@\s]*@[^@\s]*\.[^@\s]*/", "", $msg);
        $msg = preg_replace('/([0-9]+[\- ]?[0-9]{6,})/', '', $msg);


        $message = new Message;
        $message->message = $msg;
        $message->user_id = $fromUser->id;

        if (array_key_exists('attachments', $validated)) {
            $message->attachments = json_encode($validated['attachments']);
        } else {
            $message->attachments = "[]";
        }
        

        if (auth()->user()->cannot('create', $message)) {
            return response()->json([
                'success' => false,
                'error' => "You are not authorized to create messages."
            ], 403);
        }

        $convo = new Conversation;
        $convo->save();
        $convo->refresh();

        $message->conversation_id = $convo->id;
        $convo->users()->attach($toUser, ['conversation_id' => $convo->id, 'user_id' => $toUser->id]);
        $convo->users()->attach($fromUser, ['conversation_id' => $convo->id, 'user_id' => $fromUser->id]);

        $message->save();
        $notificationService->NotifyUserOfReceivedMessage($toUser, $fromUser, $message);

        return response()->json([
            'success' => true,
            'message' => $message
        ]);
    }

    /**
     * Add a new message to an existing conversation
     * 
     * Sends notifications to message recipiant
     * 
     * @param message       String
     * @param attachments   Array[String]
     * @param convoId       Integer
     */
    public function AddMessageToConversation(Request $request, NotificationService $notificationService) {

        $validated = $request->validate([
            'message' => ['string', 'required'],
            'attachments.*' => ['url']
        ]);

        $convo = Conversation::where('id', $request->route('convoId'))->with(['users'])->firstOrFail();
        $fromUser = auth()->user();
        $toUser = null;
        foreach($convo->users as $user) {
            if ($user->id != $fromUser->id) {
                $toUser = $user;
                break;
            }
        }

        $msg = $validated['message'];
        $msg = preg_replace("/[^@\s]*@[^@\s]*\.[^@\s]*/", "", $msg);
        $msg = preg_replace('/([0-9]+[\- ]?[0-9]{6,})/', '', $msg);

        $message = new Message;
        $message->message = $msg;
        $message->user_id = $fromUser->id;
        $message->attachments = json_encode(array_key_exists('attachments', $validated) ? $validated['attachments'] : []);
        $message->conversation_id = $convo->id;

        $message->save();

        $notificationService->NotifyUserOfReceivedMessage($toUser, $fromUser, $message);

        return response()->json([
            'success' => true,
            'message' => $message
        ]);
    }

    /**
     * Move a given conversation to a users archived convos
     * 
     * @param convoId
     */
    public function ArchiveConversation(Request $request) {

        $user = auth()->user();
        $convo = $user->conversations()->where(['user_id' => $user->id, 'conversation_id' => $request->route('convoId')])->firstOrFail();
        $convo->pivot->favourite = false;
        $convo->pivot->archived = !$convo->pivot->archived;
        $convo->pivot->save();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Move a given conversation to a users favourite convos
     * 
     * @param convoId
     */
    public function FavouriteConversation(Request $request) {

        $user = auth()->user();
        $convo = $user->conversations()->where(['user_id' => $user->id, 'conversation_id' => $request->route('convoId')])->firstOrFail();
        $convo->pivot->favourite = !$convo->pivot->favourite;
        $convo->pivot->archived = false;
        $convo->pivot->save();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Modify the body of a given message
     * 
     * @param message   String
     * @param messageId Integer
     */
    public function EditMessage(Request $request) {

        $validated = $request->validate([
            'message' => ['string', 'required']
        ]); 

        $user = auth()->user();
        $message = Message::where('id', $request->route('messageId'))->first();

        if (!$message) {
            return response()->json([
                'success' => false,
                'error' => "Message not found."
            ], 404);
        }

        if ($user->cannot('update', $message)) {
            return response()->json([
                'success' => false,
                'error' => "You are not authorizted to update this message."
            ], 403);
        }

        $message->message = $validated['message'];
        $message->edited = true;
        $message->save();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Soft delete a given message
     * 
     * @param messageId Integer
     */
    public function DeleteMessage(Request $request) {

        $user = auth()->user();
        $message = Message::where('id', $request->route('messageId'))->first();

        if (!$message) {
            return response()->json([
                'success' => false,
                'error' => "Message not found."
            ], 404);
        }

        if ($user->cannot('delete', $message)) {
            return response()->json([
                'success' => false,
                'error' => "You are not authorized to delete this message."
            ], 403);
        }

        $message->deleted = true;
        $message->save();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Hard delete a given message
     * 
     * @param messageId Integer
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function ForceDeleteMessage(Request $request) {

        $user = auth()->user();
        $message = Message::where('id', $request->route('messageId'))->first();

        if ($user->cannot('forceDelete', $message)) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized.'
            ], 403);
        }

        $message->delete();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Download an attachment from a conversation
     * 
     * @param file String
     */
    public function DownloadAttachment(Request $request) {
        
        $validated = $request->validate([
            'file' => ['required', 'string']
        ]);

        return Storage::disk('s3_private')->download(str_replace(env('AWS_S3_PRIVATE_TMP_BUCKET_URL'), '', str_replace('%2F', '/', $validated['file'])));
    }
}
