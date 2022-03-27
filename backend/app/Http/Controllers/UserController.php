<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AnalyticsEvent;
use App\Models\NotificationPreference;
use App\Services\GeocodingService;
use App\Services\NotificationService;
use App\Rules\MobileNumber;
use App\Rules\Postcode;
use App\Enums\ENotificationTypes;
use App\Enums\EAnalyticsEvents;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Enums\ESubjectLevels;

/**
 * @group User Management
 *
 * Endpoints for interacting with all types of user
 */
class UserController extends Controller
{
    /**
     * Me
     * 
     * Returns information about the currently authenticated user
     */
    public function Me(Request $request) {

        $authedUser = auth()->user();
        if ($authedUser->role == 'tutor') {
            $user = User::with([
                'subjects', 
                'notificationPreferences',
                'reviews' => function($q) {
                    $q->where('reviewee_acceptance', 'approved');
                    $q->orWhere('admin_action', 'approved');
                },
                'reviews.reviewer'
            ])->where('id', $authedUser->id)->firstOrFail();
            $user->makeVisible(['verification_documents', 'qualification_documents', 'optional_documents', 'references']);
        } else {
            $user = User::with(['notificationPreferences'])->where('id', $authedUser->id)->firstOrFail();
        }

        return response()->json($user);
    }

    /**
     * Update Personal Details
     * 
     * Used to updated name, contact information, password, and/or address.
     * 
     * <aside class="warning">Updating address may trigger an address lookup failure notification if Googles geocoding API fails to translate the provided address into lat/long.</aside>
     */
    public function UpdatePersonalDetails(Request $request, GeocodingService $geocodingService, NotificationService $notificationService) {

        $validated = $request->validate([
            'name' => ['string', 'nullable'],
            'surname' => ['string', 'nullable'],
            'email' => ['email', 'nullable'],
            'mobile_number' => [new MobileNumber, 'nullable'],
            'postcode' => [new Postcode, 'nullable'],
            'password' => ['min:8', 'required_with:new_password', 'nullable'],
            'new_password' => ['min:8', 'required_with:password', 'nullable'],
            'address_line_1' => ['string', 'nullable'],
            'address_line_2' => ['string', 'nullable'],
            'city' => ['string', 'nullable'],
            'county' => ['string', 'nullable'],
            'profile_image' => ['string', 'nullable']
        ]);

        $user = auth()->user();

        if (array_key_exists('new_password', $validated)) {
            if (
                $validated['password'] == $validated['new_password']
            ) {
                return response()->json([
                    'success' => false,
                    'error' => "New password can not be the same as current password."
                ], 400);
            }

            $user->password = $validated['new_password'];
        }

        if (array_key_exists('name', $validated)) { $user->name = $validated['name']; }
        if (array_key_exists('surname', $validated)) { $user->surname = $validated['surname']; }
        if (array_key_exists('email', $validated)) { $user->email = $validated['email']; }
        if (array_key_exists('mobile_number', $validated)) { $user->mobile_number = $validated['mobile_number']; }
        if (array_key_exists('profile_image', $validated)) { $user->profile_image = $validated['profile_image']; }

        $updatedAddress = false;
        if (array_key_exists('postcode', $validated)) { 
            $user->postcode = $validated['postcode']; 
            $updatedAddress = true;
        }
        if (array_key_exists('address_line_1', $validated)) { 
            $user->address_line_1 = $validated['address_line_1']; 
            $updatedAddress = true;
        }
        if (array_key_exists('address_line_2', $validated)) { 
            $user->address_line_2 = $validated['address_line_2']; 
            $updatedAddress = true;
        }
        if (array_key_exists('city', $validated)) { 
            $user->city = $validated['city']; 
            $updatedAddress = true;
        }
        if (array_key_exists('county', $validated)) { 
            $user->county = $validated['county']; 
            $updatedAddress = true;
        }

        if ($updatedAddress) {
            $latlng = $geocodingService->GetLatLngForUser($user);
            if ($latlng[0] == -256 || $latlng[1] == -256) {
                $notificationService->NotifyUserOfFailedAddressLookup($user);
            }
            
            $user->latitude = $latlng[0];
            $user->longitude = $latlng[1];
        }

        $user->save();

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    /**
     * Update notification preferences
     * 
     * Used to update email/SMS delivery preferences for notifications
     */
    public function UpdateNotificationPreferences(Request $request) {

        $validated = $request->validate([
            'message_received.email' => ['boolean'],
            'message_received.mobile' => ['boolean'],
            'tutor_approved.email' => ['boolean'],
            'tutor_approved.mobile' => ['boolean'],
            'tutor_rejected.email' => ['boolean'],
            'tutor_rejected.mobile' => ['boolean'],
            'subject_approved.email' => ['boolean'],
            'subject_approved.mobile' => ['boolean'],
            'subject_renamed.email' => ['boolean'],
            'subject_renamed.mobile' => ['boolean'],
            'subject_rejected.email' => ['boolean'],
            'subject_rejected.mobile' => ['boolean'],
            'failed_address_lookup.email' => ['boolean'],
            'failed_address_lookup.mobile' => ['boolean'],
            'new_subjects.email' => ['boolean'],
            'new_subjects.mobile' => ['boolean'],
            'reference_approved.email' => ['boolean'],
            'reference_approved.mobile' => ['boolean'],
            'reference_rejected.email' => ['boolean'],
            'reference_rejected.mobile' => ['boolean'],
            'reference_no_contact.email' => ['boolean'],
            'reference_no_contact.mobile' => ['boolean'],
            'registration_inquiry.email' => ['boolean'],
            'registration_inquiry.mobile' => ['boolean'],
            'review_submitted.email' => ['boolean'],
            'review_submitted.mobile' => ['boolean'],
            'review_rejected.email' => ['boolean'],
            'review_rejected.mobile' => ['boolean'],
            'more_registration_info_account.email' => ['boolean'],
            'more_registration_info_account.mobile' => ['boolean'],
            'more_registration_info_address.email' => ['boolean'],
            'more_registration_info_address.mobile' => ['boolean'],
            'more_registration_info_subjects.email' => ['boolean'],
            'more_registration_info_subjects.mobile' => ['boolean'],
            'more_registration_info_qualifications.email' => ['boolean'],
            'more_registration_info_qualifications.mobile' => ['boolean'],
            'more_registration_info_profile.email' => ['boolean'],
            'more_registration_info_profile.mobile' => ['boolean'],
            'more_registration_info_photos.email' => ['boolean'],
            'more_registration_info_photos.mobile' => ['boolean'],
            'more_registration_info_documents.email' => ['boolean'],
            'more_registration_info_documents.mobile' => ['boolean'],
            'more_registration_info_availability.email' => ['boolean'],
            'more_registration_info_availability.mobile' => ['boolean'],
            'more_registration_info_references.email' => ['boolean'],
            'more_registration_info_references.mobile' => ['boolean'],
        ]);

        $user = auth()->user();

        

        $prefs = $user->notificationPreferences()->whereIn('type', array_keys($validated))->get();
        foreach($validated as $type => $values) {
            
            $existingPref = null;
            foreach($prefs as $pref) {
                if ($pref->type == $type) {
                    $existingPref = $pref;
                    break;
                }
            }

            if (!$existingPref) {
                $existingPref = new NotificationPreference;
                $existingPref->user_id = $user->id;
                $existingPref->type = $type;
            }

            // email defaults on
            if (array_key_exists('email', $values)) {
                $existingPref->email = $values['email'];
            } else {
                $existingPref->email = true;
            }

            // sms defaults off
            if (array_key_exists('mobile', $values)) {
                $existingPref->mobile = $values['mobile'];
            } else {
                $existingPref->mobile = false;
            }
            
            $existingPref->save();
        }

        return response()->json([
            'success' => true,
            'user' => User::where('id', $user->id)->with(['notificationPreferences'])->first()
        ]);
    }

    /**
     * Enable/Disable account
     * 
     * Used to supress tutors from the tutor search results
     */
    public function SetEnabled(Request $request) {

        $validated = $request->validate([
            'enabled' => ['required', 'boolean']
        ]);

        $user = auth()->user();
        $user->enabled = $validated['enabled'];
        $user->save();

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    /**
     * Close account
     * 
     * Closes the users account.
     * 
     * <aside class="warning">This is permanant, there is no undo.</aside>
     */
    public function CloseAccount(Request $request) {

        $user = auth()->user();

        $user->closed = true;
        $user->email = "___closed___" . $user->email;
        $user->save();

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Adds or removes a tutor from a users list of favourite tutors
     * 
     * @param Integer   The tutors ID
     */
    public function ToggleFavouriteTutor(Request $request) {

        $validated = $request->validate([
            'tutorId' => ['required', 'integer']
        ]);

        $user = auth()->user();

        $favs = json_decode($user->favourite_tutors);

        if (array_search($validated['tutorId'], $favs) === false) {
            $favs[] = $validated['tutorId'];
        } else {
            $favs = array_filter($favs, function($id) use ($validated) {
                return $id != $validated['tutorId'];
            });
        }
        
        
        $user->favourite_tutors = json_encode(array_values($favs));
        $user->save();

        return response()->json([
            'success' => true,
            'favourites' => $user->favourite_tutors
        ]);
    }

    /**
     * Return a paginated list of a users favourite tutors
     */
    public function GetFavouriteTutors(Request $request) {

        $user = auth()->user();
        $favs = json_decode($user->favourite_tutors);

        return User::where('role', 'tutor')
            ->with(['subjects', 'reviews.reviewer', 'reviews.reviewee'])
            ->where('validation_status', 'approved')
            ->where('closed', false)
            ->whereIn('id', $favs)
            ->paginate();
    }
}
 