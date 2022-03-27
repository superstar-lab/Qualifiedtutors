<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\NotificationPreference;
use App\Services\GeocodingService;
use App\Services\NotificationService;
use App\Rules\MobileNumber;
use App\Rules\Postcode;
use App\Enums\ENotificationTypes;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Enums\ESubjectLevels;

use Illuminate\Support\Facades\Http;

/**
 * @group 
 *
 * 
 */
class ContactController extends Controller
{
    /**
     * Handles submissions from the Contact Us form
     * 
     * Validates against reCAPTCHA v3. Emails are sent to CONTACT_US_EMAIL as defined in the relavent .env 
     */
    public function ContactUs(Request $request, NotificationService $notifService) {

        $validated = $request->validate([
            'token' => ['required', 'string'],
            'name' => ['required', 'string'],
            'email' => ['required', 'string'],
            'message' => ['required', 'string']
        ]);

        $response = Http::asForm()->post(env('GOOGLE_RECAPTCHA_VALIDATION_ENDPOINT'), [
            'secret' => env('GOOGLE_RECAPTCHA_SECRET_KEY'),
            'response' => $validated['token']
        ]);

        if (!$response->json('success')) {
            return response()->json([
                'error' => 'reCAPTCHA verification failed: ' . json_encode($response->json('error-codes'))
            ], 400);
        }

        $notifService->ContactUs($validated['name'], $validated['email'], $validated['message']);

        return response()->json([
            'success' => true
        ]);
    }
    
}
 