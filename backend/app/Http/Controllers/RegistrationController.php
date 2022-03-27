<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Enums\ESubjectLevels;
use Illuminate\Support\Str;
use App\Services\NotificationService;
use App\Services\GeocodingService;
use App\Rules\MobileNumber;
use App\Rules\Postcode;
use Illuminate\Support\Facades\Auth;

/**
 * @group User Registration
 *
 * Endpoints for registering the various types of user.
 */
class RegistrationController extends Controller
{

    public function __construct() {
        $this->commonValidationRules = [
            'name' => ['string', 'nullable'],
            'surname' => ['string', 'nullable'],
            'gender' => ['in:male,female', 'nullable'],
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8'],
            'accept_tos' => ['required', 'boolean'],
            'address_line_1' => ['string', 'nullable'],
            'address_line_2' => ['string', 'nullable'],
            'city' => ['string', 'nullable'],
            'county' => ['string', 'nullable'],
            'mobile_number' => ['string', 'nullable'],
            'postcode' => ['string', 'nullable'] 
        ];
    }

    /**
     * Register a new Client type user (student/parent)
     *
     * Registers a new student for use with the site.
     * 
     * <aside class="notice">Triggers email validation notification</aside>
     *
     * @unauthenticated
     */
    public function RegisterClient(Request $request, NotificationService $notificationService, GeocodingService $geocodingService) {
        $data = $request->validate($this->commonValidationRules + [
            'profile_image' => ['string', 'nullable'],
            'no_login' => ['boolean', 'nullable'],
            'verification_status' => ['in:pending,approved', 'nullable']
        ]);        

        if (!$data['accept_tos']) {
            return response()->json([
                'success' => false,
                'error' => 'You must accept the Terms of Service in order to register.',
                'errors' => [
                    'accept_tos' => 'You must accept the Terms of Service in order to register.'
                ]
            ], 400);
        }

        $existingUser = User::where('email', $data['email'])->first();
        if ($existingUser) {
            return response()->json([
                'success' => false,
                'error' => 'This email address is already registered.',
                'errors' => [
                    'email' => 'This email address is already registered.'
                ]
            ], 400);
        }

        $user = new User;
        $user->name = $data['name'] ?? "";
        $user->surname = $data['surname'] ?? "";
        $user->email = $data['email'];
        $user->password = $data['password'];
        $user->address_line_1 = $data['address_line_1'] ?? null;
        $user->address_line_2 = $data['address_line_2'] ?? null;
        $user->city = $data['city'] ?? null;
        $user->county = $data['county'] ?? null;
        $user->postcode = $data['postcode'] ?? null;
        $user->enabled = true;
        $user->profile_image = $data['profile_image'] ?? null;
        $user->email_validation_token = (string)Str::orderedUuid();
        $user->profile_additional_images = "[]";
        $user->favourite_tutors = "[]";
        $user->weekly_availability = "{}";
        $user->qualifications = "[]";
        $user->verification_documents = "[]";
        $user->qualification_documents = "[]";
        $user->optional_documents = "[]";
        $user->new_subjects = "[]";
        $user->mobile_number = $data['mobile_number'] ?? "";
        $user->message_uuid = (string)Str::orderedUuid();
        $user->validation_status = 'pending';
        $user->company_bios = "[]";
        $user->qualification_proof_documents = "[]";

        if (array_key_exists('gender', $data)) {
            $user->gender = $data['gender'];
        }

        $loc = $geocodingService->GetLatLngForUser($user);
        $user->latitude = $loc[0];
        $user->longitude = $loc[1];

        $user->save();

        $notificationService->NotifyUserOfEmailValidation($user);
        if ($user->latitude == -256) {
           $notificationService->NotifyUserOfFailedAddressLookup($user); 
        }

        $authedUser = auth()->user();
        if (array_key_exists('verification_status', $data) && $authedUser && $authedUser->role == 'admin') {
            $user->verification_status = $data['verification_status'];
        }

        if (array_key_exists('no_login', $data) && $data['no_login']) {
            return response()->json([
                'success' => true,
                'user' => User::with(['notificationPreferences'])
                    ->where('id', $user->id)
                    ->firstOrFail()
            ]);
        }

        $creds = [
            'email' => $data['email'],
            'password' => $data['password']
        ];

        if (Auth::attempt($creds)) {
            $request->session()->regenerate();
            
            return response()->json([
                'success' => true,
                'user' => User::with(['notificationPreferences'])
                    ->where('id', $user->id)
                    ->firstOrFail()
            ]);
        } else {
            return response()->json([
                'success' => false,
                'errors' => [
                    'auth' => 'Failed to login to new account'
                ]
            ]);
        }
    }

    /**
     * Register a new Tutor type user
     *
     * Registers a new tutor for use with the site. Registered tutors will not automatically be visible to other users of the site, they must first be approved by an admin.
     * 
     * <aside class="notice">Triggers notifications to admin type users to review the registration unless the 'draft' field is true.</aside>
     * <aside class="notice">Triggers email validation notification</aside>
     *
     * @unauthenticated
     */
    public function RegisterTutor(Request $request, NotificationService $notificationService, GeocodingService $geocodingService) {
        $validator = Validator::make($request->all(), [
            'name' => ['nullable'],
            'surname' => ['nullable'],
            'gender' => ['in:male,female', 'nullable'],
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8'],
            'accept_tos' => ['required', 'boolean'],
            'address_line_1' => ['nullable'],
            'address_line_2' => ['nullable'],
            'city' => ['nullable'],
            'county' => ['nullable'],
            'mobile_number' => [new MobileNumber, 'nullable'],
            'postcode' => [new Postcode, 'nullable'],

            'tutor_type' => ['required', 'in:teacher,tutor,agency'],
            'subjects' => ['nullable'],
            'subjects.*.subject_id' => ['required_without:subjects.*.subject_name', 'exists:subjects,id'],
            'subjects.*.subject_name' => ['required_without:subjects.*.subject_id', 'string'],
            'subjects.*.level' => ['required', Rule::in(ESubjectLevels::cases())],
            'subjects.*.price_per_hour_online' => ['integer', 'nullable'],
            'subjects.*.price_per_hour_in_person' => ['integer', 'nullable'],
            'subjects.*.online' => ['required', 'boolean'],
            'subjects.*.in_person' => ['required', 'boolean'],
            'qualifications' => ['nullable'],
            'qualifications.*.school' => ['required'],
            'qualifications.*.title' => ['required'],
            'qualifications.*.grade' => ['required'],
            'qualifications.*.degree' => ['required', 'boolean'],
            'qualifications.*.other' => ['required', 'boolean'],

            'availability' => ['nullable'],
            'availability.morning.*' => ['boolean'],
            'availability.afternoon.*' => ['boolean'],
            'availability.evening.*' => ['boolean'],

            'references' => ['nullable'],
            'references.*.name' => ['required', 'string'],
            'references.*.email' => ['required', 'email'],
            'references.*.mobile' => ['required', new MobileNumber],
            'references.*.relationship' => ['required', 'string'],

            'profile_image' => ['url', 'nullable'],
            'profile_video_link' => ['url', 'nullable'],
            'profile_additional_images' => ['nullable'],
            'profile_additional_images.*' => ['url'],
            'profile_summary' => ['string', 'nullable'],
            'profile_about_you' => ['string', 'nullable'],
            'draft' => ['boolean', 'nullable'],
            'free_video_chat_enabled' => ['boolean', 'nullable'],
            'verification_documents' => ['nullable'],
            'verification_documents.*' => ['required', 'string'],
            'qualification_documents' => ['nullable'],
            'qualification_documents.*' => ['required', 'string'],
            'optional_documents' => ['nullable'],
            'optional_documents.*' => ['string'],
            'opt_degree' => ['boolean', 'nullable'],
            'opt_dbs' => ['boolean', 'nullable'],
            'opt_enhanced_dbs' => ['boolean', 'nullable'],
            'opt_examiner' => ['boolean', 'nullable'],
            'opt_aqa' => ['boolean', 'nullable'],
            'opt_ccea' => ['boolean', 'nullable'],
            'opt_ocr' => ['boolean', 'nullable'],
            'opt_edexel' => ['boolean', 'nullable'],
            'opt_wjec' => ['boolean', 'nullable'],

            'banner_image' => ['url', 'nullable'],
            'company_name' => ['string', 'nullable'],
            'company_tagline' => ['string', 'nullable'],
            'company_website' => ['string', 'nullable'],
            'company_blurb' => ['string', 'nullable'],
            'years_of_experience' => ['integer', 'nullable'],
            'company_bios' => ['nullable'],
            'company_bios.*.imageUrl' => ['string', 'nullable'],
            'company_bios.*.name' => ['string', 'nullable'],
            'company_bios.*.blurb' => ['string', 'nullable'],
            'qualification_proof_documents' => ['nullable'],
            'qualification_proof_documents.*' => ['required', 'string'],

            'no_login' => ['boolean', 'nullable'],
            'verification_status' => ['in:pending,approved', 'nullable']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->messages()
            ]);
        }

        $data = $request->all();

        $existingUser = User::where('email', $data['email'])->first();
        if ($existingUser) {
            return response()->json([
                'success' => false,
                'errors' => [
                    'email' => 'This email address is already registered.'
                ]
            ], 400);
        }

        $user = new User;
        $user->name = $data['name'] ?? "";
        $user->surname = $data['surname'] ?? "";
        $user->email = $data['email'];
        $user->password = $data['password'];
        $user->address_line_1 = $data['address_line_1'] ?? null;
        $user->address_line_2 = $data['address_line_2'] ?? null;
        $user->city = $data['city'] ?? null;
        $user->county = $data['county'] ?? null;
        $user->postcode = $data['postcode'] ?? null;
        $user->tutor_type = $data['tutor_type'];
        $user->enabled = false;
        $user->draft = $data['draft'] ?? false;
        $user->qualifications = array_key_exists('qualifications', $data) ? json_encode($data['qualifications']) : "[]";
        $user->profile_image = $data['profile_image'] ?? null;
        $user->profile_video_link = array_key_exists('profile_video_link', $data) ? $data['profile_video_link'] : null;
        $user->profile_additional_images = array_key_exists('profile_additional_images', $data) ? json_encode($data['profile_additional_images']) : '[]';
        $user->profile_summary = array_key_exists('profile_summary', $data) ? $data['profile_summary'] : '';
        $user->profile_about_you = array_key_exists('profile_about_you', $data) ? $data['profile_about_you'] : '';
        $user->free_video_chat_enabled = $data['free_video_chat_enabled'] ?? false;
        $user->verification_documents = array_key_exists('verification_documents', $data) ? json_encode($data['verification_documents']) : '[]';
        $user->qualification_documents = array_key_exists('qualification_documents', $data) ? json_encode($data['qualification_documents']) : '[]';
        $user->optional_documents = array_key_exists('optional_documents', $data) ? json_encode($data['optional_documents']) : '[]';
        $user->opt_degree = $data['opt_degree'] ?? false;
        $user->opt_dbs = $data['opt_dbs'] ?? false;
        $user->opt_enhanced_dbs = $data['opt_enhanced_dbs'] ?? false;
        $user->opt_examiner = $data['opt_examiner'] ?? false;
        $user->opt_aqa = $data['opt_aqa'] ?? false;
        $user->opt_ccea = $data['opt_ccea'] ?? false;
        $user->opt_ocr = $data['opt_ocr'] ?? false;
        $user->opt_edexel = $data['opt_edexel'] ?? false;
        $user->opt_wjec = $data['opt_wjec'] ?? false;
        $user->role = 'tutor';
        $user->email_validation_token = (string)Str::orderedUuid();
        $user->message_uuid = (string)Str::orderedUuid(); 

        $loc = $geocodingService->GetLatLngForUser($user);
        $user->latitude = $loc[0];
        $user->longitude = $loc[1];

        $user->favourite_tutors = "[]";
        $user->weekly_availability = array_key_exists('availability', $data) ? json_encode($data['availability']) : '{
            "morning": [false, false, false, false, false, false, false],
            "afternoon": [false, false, false, false, false, false, false],
            "evening": [false, false, false, false, false, false, false]
        }';
        $user->new_subjects = "[]";

        if ($user->tutor_type == 'agency') {
            $user->banner_image = $data['banner_image'] ?? null;
            $user->company_name = $data['company_name'] ?? null;
            $user->company_tagline = $data['company_tagline'] ?? null;
            $user->company_website = $data['company_website'] ?? null;
            $user->company_bios = array_key_exists('company_bios', $data) ? json_encode($data['company_bios']) : '[]';
        } else {
            $user->company_bios = '[]';
        }

        if ($user->tutor_type == 'tutor') {
            $user->years_of_experience = $data['years_of_experience'] ?? 0;
            $user->qualification_proof_documents = array_key_exists('qualification_proof_documents', $data) ? json_encode($data['qualification_proof_documents']) : '[]';
        } else {
            $user->qualification_proof_documents = '[]';
        }

        $authedUser = auth()->user();
        if (array_key_exists('verification_status', $data) && $authedUser && $authedUser->role == 'admin') {
            $user->verification_status = $data['verification_status'];
        }

        $user->save();
        $user->refresh();

        if (array_key_exists('subjects', $data) && is_array($data['subjects'])) {
            $newSubjects = [];
            foreach ($data['subjects'] as &$subject) {
                if(array_key_exists('subject_id', $subject)) { 
                    $subjectId = $subject['subject_id'];
                    unset($subject['subject_id']);
                    $user->subjects()->attach($subjectId, $subject); 
                } else {
                    $newSubjects[] = $subject;
                }
            }    
            $user->new_subjects = json_encode($newSubjects);

            $user->save();
        }
        
        $refs = [];
        if (array_key_exists('references', $data)) {
            foreach($data['references'] as $reference) {
                $reference['contacted'] = false;
                $reference['uuid'] = (string)Str::orderedUuid();
                $reference['response'] = (object)([]);
                $refs[] = $reference;
            }
        }
        $user->references = json_encode($refs);

        $completeProfile = false;
        if (
            $user->name &&
            $user->surname &&
            $user->email &&
            $user->address_line_1 &&
            $user->city &&
            $user->postcode &&
            $user->mobile_number &&
            (count($user->subjects()) > 0 || count($newSubjects) > 0) &&
            ($data['qualifications'] && count($data['qualifications']) > 0) &&
            $user->profile_image &&
            $user->gender &&
            $user->profile_summary &&
            $user->profile_about_you &&
            (array_key_exists('verification_documents', $data) && count($data['verification_documents']) > 0) &&
            (array_key_exists('qualification_documents', $data) && count($data['qualification_documents']) > 0)
        ) {
            if (
                array_key_exists('availability', $data) &&
                is_array($data['availability']) && 
                array_key_exists('morning', $data['availability']) &&
                array_key_exists('afternoon', $data['availability']) &&
                array_key_exists('evening', $data['availability'])
            ) {
                if (
                    array_search(true, $data['availability']['morning'], true) !== false ||
                    array_search(true, $data['availability']['afternoon'], true) !== false ||
                    array_search(true, $data['availability']['evening'], true) !== false
                ) {
                    $completeProfile = true;
                }
            }
        }

        if ($completeProfile && $user->tutor_type == 'tutor') {
            if (!array_key_exists('references', $data) || count($data['references']) < 2) {
                $completeProfile = false;
            }

            if (!$user->years_of_experience) {
                $completeProfile = false;
            }

            if (!array_key_exists('qualification_proof_documents', $data) || count($data['qualification_proof_documents']) < 1) {
                $completeProfile = false;
            }
        }

        if ($completeProfile && $user->tutor_type == 'agency') {
            if (
                !$user->banner_image ||
                !$user->company_name ||
                !$user->company_tagline ||
                !$user->company_website ||
                (!array_key_exists('company_bios', $data) || count($data['company_bios']) < 1)
            ) {
                $completeProfile = false;
            }
        }

        if ($completeProfile && !$user->draft) {
            $notificationService->NotifyAdminsOfTutorRegistration($user);
        } else if (!$completeProfile && !$user->draft) {
            $user->draft = true;
            $user->save();
        }

        $notificationService->NotifyUserOfEmailValidation($user);
        if ($user->latitude == -256) {
            $notificationService->NotifyUserOfFailedAddressLookup($user); 
        }
        
        if (count($refs) > 0) {
            foreach($refs as $index => $reference) {
                $notificationService->ContactTutorReference($user, $reference);
                $reference['contacted'] = true;
                $refs[$index] = $reference;
            }
            $user->references = json_encode($refs);
            $user->save();
        }

        if (!array_key_exists('no_login', $data) || !$data['no_login']) {
            $creds = [
                'email' => $data['email'],
                'password' => $data['password']
            ];
    
            if (Auth::attempt($creds)) {
                $request->session()->regenerate();
                
                return response()->json([
                    'success' => true,
                    'user' => User::with(['subjects', 'reviews.reviewer', 'notificationPreferences'])
                        ->where('id', $user->id)
                        ->firstOrFail()
                        ->makeVisible(['verification_documents', 'qualification_documents', 'optional_documents', 'references'])
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'errors' => [
                        'auth' => 'Failed to login to new account'
                    ]
                ]);
            }
        } else {
            return response()->json([
                'success' => true
            ]);
        }
    }

    

    /**
     * Register a new Admin type user
     *
     * Registers a new admin for the site.
     *
     * <aside class="notice">Only current admins may invoke this endpoint.</aside>
     */
    public function RegisterAdmin(Request $request) {
        $user = auth()->user();
        if ($user->role != 'admin') {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized'
            ], 401);
        } 

        $validated = $request->validate([
            'email' => ['required', 'email'],
            'name' => ['required'],
            'surname' => ['required'],
            'password' => ['required', 'min:8'],
            'address_line_1' => ['string'],
            'city' => ['string']
        ]);

        $existingUser = User::where('email', $validated['email'])->first();
        if ($existingUser) {
            return response()->json([
                'success' => false,
                'errors' => [
                    'email' => 'This email address is already registered.'
                ]
            ], 400);
        }

        $user = new User;
        $user->email = $validated['email'];
        $user->name = $validated['name'];
        $user->surname = $validated['surname'];
        $user->password = $validated['password'];
        $user->address_line_1 = array_key_exists('address_line_1', $validated) ? $validated['address_line_1'] : '';
        $user->city = array_key_exists('city', $validated) ? $validated['city'] : '';
        $user->role = 'admin';
        $user->message_uuid = (string)Str::orderedUuid();

        $user->save();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Verify a users email address
     *
     * Users on registration are sent an email with a link to verify their email. That link leads here.
     */
    public function VerifyEmail(Request $request) {

        $user = User::where('email_validation_token', $request->route('token'))->first();
            
        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => "Invalid token"
            ], 400);
        }

        $authUser = auth()->user();
        if ($authUser->id != $user->id) {
            return response()->json([
                'success' => false,
                'error' => "Wrong user"
            ], 400);
        }

        if ($user->email_validated) {
            return response()->json([
                'success' => false,
                'error' => 'Already verified'
            ], 400);
        }

        $user->email_validated = true;
        $user->save();

        return response()->json([
            'success' => true
        ]);
    }
}
