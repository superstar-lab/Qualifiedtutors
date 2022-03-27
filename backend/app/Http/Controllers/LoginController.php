<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Services\AnalyticsService;
use App\Services\NotificationService;
use App\Enums\EAnalyticsEvents;
use Illuminate\Support\Str;
/**
 * @group User Management
 */
class LoginController extends Controller
{
    /**
     * Login
     *
     * Logs user into the application.
     * Successful responses will contain a session cookie that must be presented with future requests.
     * @unauthenticated
     */
    public function Login(Request $request, AnalyticsService $analyticsService) {

        $creds = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
            'rememberMe' => ['boolean']
        ]);

        $rememberMe = false;
        if (array_key_exists('rememberMe', $creds)) {
            $rememberMe = $creds['rememberMe'];
            unset($creds['rememberMe']);
        }

        if (Auth::attempt($creds)) {
            $request->session()->regenerate();
            
            $authedUser = auth()->user();
            $type = null;

            if ($authedUser->closed) {
                return response()->json([
                    'errors' => ['email' => 'The provided credentials do not match our records.']
                ]);
            }

            if ($authedUser->role == 'tutor') {
                $user = User::with(['subjects', 'reviews.reviewer', 'notificationPreferences'])
                    ->where('id', $authedUser->id)
                    ->firstOrFail()
                    ->makeVisible(['verification_documents', 'qualification_documents', 'optional_documents', 'references']);
                $type = EAnalyticsEvents::TutorLogin;
            } else {
                $user = User::with(['notificationPreferences'])->where('id', $authedUser->id)->firstOrFail();

                if ($authedUser->role == 'admin') {
                    $type = EAnalyticsEvents::AdminLogin;
                } else {
                    $type = EAnalyticsEvents::StudentLogin;
                }
            }

            if ($user->return_token != null) {
                $user->return_token = null;
                $user->last_login = new \DateTime();
                $user->save();
            } else {
                $user->last_login = new \DateTime();
                $user->save();
            }

            $analyticsService->RecordEvent($user, $type);

            return response()->json([
                'success' => true,
                'user' => $user
            ]);
        }

        return response()->json([
            'success' => false,
            'errors' => [
                'email' => 'The provided credentials do not match our records.'
            ]
        ]);
    }

    /**
     * Forgot password
     * 
     * Sends emails to users who have forgotten their password with a reset link.
     * 
     * Will always report success even if the email doesn't exist for security reasons.
     */
    public function ForgotPassword(Request $request, NotificationService $notificationService) {

        $validated = $request->validate([
            'email' => ['required', 'email']
        ]);

        $user = User::where('email', $validated['email'])->first();

        if ($user && !$user->closed) {
            $mintNewtoken = false;
            if ($user->password_reset_token) {
                $dt = new \DateTime($user->password_reset_token_issued_at);
                $interval = $dt->diff(new \DateTime());
                
                if ($interval->d > 0) {
                    $mintNewtoken = true;
                }
            } else {
                $mintNewtoken = true;
            }
            
            if ($mintNewtoken) {
                $user->password_reset_token = (string)Str::orderedUuid();
                $user->password_reset_token_issued_at = (new \DateTime())->format('Y-m-d H:i:s');
                $user->save();
            }

            $notificationService->NotifyUserOfPasswordReset($user);
        }

        // Success is returned even when a user isn't found
        // This is to prevent bad actors from scraping the site for emails
        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Reset a users password
     * 
     * Used by the forgot password process to reset a users password
     */
    public function ResetPassword(Request $request) {

        $validated = $request->validate([
            'new_password' => ['required', 'string', 'min:8'],
            'token' => ['required', 'string', 'exists:users,password_reset_token']
        ]);

        $user = User::where('password_reset_token', $validated['token'])->firstOrFail();
        $user->password = $validated['new_password'];
        $user->password_reset_token = null;
        $user->password_reset_token_issued_at = null;
        $user->save();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Log out of the application
     */
    public function Logout(Request $request) {
        
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true
        ]);
    }
}
