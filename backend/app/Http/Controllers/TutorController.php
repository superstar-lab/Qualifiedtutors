<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Enums\ESubjectLevels;
use App\Enums\EAnalyticsEvents;
use App\Rules\Postcode;
use App\Rules\MobileNumber;
use App\Models\User;
use App\Models\Review;
use App\Models\Subject;
use App\Models\AnalyticsEvent;
use App\Services\GeocodingService;
use App\Services\NotificationService;
use App\Services\AnalyticsService;
use Stevebauman\Location\Facades\Location;

class TutorController extends Controller
{

    /**
     * Search for a tutor
     * 
     * Used by the "Find a Tutor" page to query for tutors.
     * 
     * @param subject           Integer Subject ID 
     * @param level             String  
     * @param min_price         Integer 
     * @param max_price         Integer 
     * @param latlng            String  Comma separated latitude,longitude values used to scope results geographically
     * @param online            Boolean 
     * @param in_person         Boolean 
     * @param verified          Boolean 
     * @param qualified_teacher Boolean 
     * @param examiner          Boolean 
     * @param gender            String  male|female
     * @param dbs               Boolean 
     * @param order_by          String  distance|price_low|price_high|rating
     * @param availability      Object  Object with three keys: morning, afternoon, & evening, each of which map to an array of 7 bools 
     * @param type              String  private|agency
     */
    public function Search(Request $request, GeocodingService $geocodingService) {
    
        $validated = $request->validate([
            'subject' => ['integer', 'exists:subjects,id'],
            'level' => [Rule::in(ESubjectLevels::cases())],
            'min_price' => ['integer'],
            'max_price' => ['integer'],
            //'postcode' => ['string'],
            'latlng' => ['string'],
            'distance' => ['numeric'],
            'online' => ['boolean'],
            'in_person' => ['boolean'],
            'verified' => ['boolean'],
            'qualified_teacher' => ['boolean'],
            'examiner' => ['boolean'],
            'gender' => ['in:male,female'],
            'dbs' => ['boolean'],
            'order_by' => ['in:distance,price_low,price_high,rating'],
            'availability.morning.*' => ['boolean'],
            'availability.afternoon.*' => ['boolean'],
            'availability.evening.*' => ['boolean'],
            'type' => ['in:private,agency']
        ]);

        $query = User::where('role', 'tutor')
            ->with(['subjects', 'reviews.reviewer'])
            ->where('validation_status', 'approved')
            ->where('enabled', true)
            ->where('closed', false);

        if (array_key_exists('verified', $validated)) {
            $query->where('verified_tutor_status', 'approved');
        }

        if (
            array_key_exists('subject', $validated) ||
            array_key_exists('level', $validated) || 
            array_key_exists('online', $validated) || 
            array_key_exists('in_person', $validated) || 
            array_key_exists('max_price', $validated) || 
            array_key_exists('min_price', $validated)
        ) {
            $query->whereRelation('subjects', function($subquery) use($validated) {
                
                if (array_key_exists('subject', $validated)) {
                    $subquery->where('subjects.id', $validated['subject']);
                }
                
                if (array_key_exists('level', $validated)) {
                    $subquery->where('level', $validated['level']);
                }

                if (array_key_exists('max_price', $validated)) {
                    $subquery->where(function($q) use ($validated) {
                        $q->where('price_per_hour_online', '<=', $validated['max_price']);
                        $q->where('price_per_hour_in_person', '<=', $validated['max_price']);
                    });
                }        

                if (array_key_exists('min_price', $validated)) {
                    $subquery->where(function($q) use ($validated) {
                        $q->where('price_per_hour_online', '>=', $validated['min_price']); 
                        $q->orWhere('price_per_hour_in_person', '>=', $validated['min_price']);    
                    });
                }        

                if (array_key_exists('online', $validated)) {
                    $subquery->where('online', $validated['online']);
                }

                if (array_key_exists('in_person', $validated)) {
                    $subquery->where('in_person', $validated['in_person']);
                }
            });
        }

        if (array_key_exists('dbs', $validated)) {
            $query->where('opt_dbs', $validated['dbs']);
        }

        if (array_key_exists('examiner', $validated)) {
            $query->where('opt_examiner', $validated['examiner']);
        }

        if (array_key_exists('qualified_teacher', $validated)) {
            $query->where('tutor_type', 'teacher');
        }

        if (array_key_exists('gender', $validated)) {
            $query->where('gender', $validated['gender']);
        }

        if (array_key_exists('type', $validated)) {
            if ($validated['type'] == 'agency') {
                $query->where('tutor_type', 'agency');
            } else if ($validated['type'] == 'private') {
                $query->whereIn('tutor_type', ['tutor', 'teacher']);
            }
        }

        $loc = null;
        $maxdist = PHP_INT_MAX;

        if (array_key_exists('latlng', $validated)) {
            $loc =  explode(',', $validated['latlng']); 
            $maxdist = 50;
        } 

        if (!$loc && array_key_exists('postcode', $validated)) {
            $response = $geocodingService->GetCoordinatesForAddress($validated['postcode']);
            if (!$response) {
                return response()->json([
                    'error' => 'Geolocation lookup for postcode failed.'
                ], 500);
            } else if ($response['formatted_address'] == 'result_not_found') {
                return response()->json([
                    'error' => 'Invalid postcode.'
                ], 400);
            } else {
                $loc = [$response['lat'], $response['lng']];
                $maxdist = 50;
            }
        } else if (!$loc && auth()->user()) {    
            $user = auth()->user();
            $loc = [$user->latitude, $user->longitude];
        } else if (!$loc && $position = Location::get()) {
            $loc = [$position->latitude, $position->longitude];
        }
        
        if ($loc) {
            $query->isWithinMaxDistance($loc[0], $loc[1], $maxdist);
        }

        if (array_key_exists('order_by', $validated)) {
            $orderBy = $validated['order_by'];
            if ($orderBy == 'distance' && $loc) {
                $query->orderBy('distance', 'asc');
            } else if ($orderBy == 'rating') {
                $query->orderBy('average_review_score', 'desc');
            } else if ($orderBy == 'price_low') {
                $query->join('tutor_subjects', 'users.id', '=', 'tutor_subjects.user_id');
                $query->orderByRaw('LEAST(IFNULL(price_per_hour_online, 0), IFNULL(price_per_hour_in_person, 0)) DESC');
                $query->distinct('users.id');
            } else if ($orderBy == 'price_high') {
                $query->join('tutor_subjects', 'users.id', '=', 'tutor_subjects.user_id');
                $query->orderByRaw('LEAST(IFNULL(price_per_hour_online, 0), IFNULL(price_per_hour_in_person, 0)) ASC');
                $query->distinct('users.id');
            }
        } else if ($loc) {
            $query->orderBy('distance', 'asc');
            $query->orderBy('average_rating', 'desc');
        }

        if (array_key_exists('availability', $validated)) {
            if (
                in_array(true, $validated['availability']['morning']) ||
                in_array(true, $validated['availability']['afternoon']) ||
                in_array(true, $validated['availability']['evening'])
            ) {
                $query->where(function ($subquery) use ($validated) {
                    foreach($validated['availability']['morning'] as $index => $slot) {
                        if ($slot) {
                            $subquery->orWhereRaw("weekly_availability->'$.morning[$index]' = true");
                        }
                    }
                    foreach($validated['availability']['afternoon'] as $index => $slot) {
                        if ($slot) {
                            $subquery->orWhereRaw("weekly_availability->'$.afternoon[$index]' = true");
                        }
                    }
                    foreach($validated['availability']['evening'] as $index => $slot) {
                        if ($slot) {
                            $subquery->orWhereRaw("weekly_availability->'$.evening[$index]' = true");
                        }
                    }
                });
            }
        }

        return $query->select('users.*')->paginate($request->query('limit', 15));
    }

    public function TopTutors(Request $request) {

        $query = User::where('role', 'tutor')
            ->with(['subjects', 'reviews.reviewer'])
            ->where('validation_status', 'approved')
            ->where('enabled', true)
            ->where('closed', false);

        $user = auth()->user();
        if ($user && $user->latitude != '-256' && $user->longitude != '-256') {
            $query->isWithinMaxDistance($user->latitude, $user->longitude, PHP_INT_MAX);
            $query->orderBy('distance', 'asc');
        }
        else if ($position = Location::get()) {
            $query->isWithinMaxDistance($position->latitude, $position->longitude, PHP_INT_MAX);
            $query->orderBy('distance', 'asc');
        }

        return $query->orderBy('average_review_score', 'desc')
            ->paginate();
    }

    /**
     * Get a tutors profile
     * 
     * @param uuid  String  Tutors message_uuid
     */
    public function GetTutor(Request $request, AnalyticsService $analyticsService) {

        $uuid = $request->route('uuid');
        $user = auth()->user();

        $tutor = User::where('role', 'tutor')
            ->with(['subjects', 'reviews.reviewer', 'reviews.reviewee'])
            ->where('message_uuid', $uuid)
            ->where('validation_status', 'approved')
            ->where('closed', false)
            ->firstOrFail();

        if ($user && $user->message_uuid == $uuid) {
            // if the tutor is requesting their own profile pass back protected data
            $tutor->makeVisible([
                'verification_documents',
                'qualification_documents',
                'optional_documents',
                'references'
            ]);
        } else {
            // if anybody else is requesting it track the event
            $analyticsService->RecordEvent($user, EAnalyticsEvents::TutorProfileView, $tutor->id);
        }

        return response()->json($tutor);
    }

    /**
     * Sets the tutors subjects/prices
     * 
     * Used by tutors to update their subjects/prices. Any manually entered subjects that don't match an existing subject will need to go through admin approval.
     * 
     * <aside class="warning">This will detach ALL existing subjects from the user. Make sure you are passing ALL their subject data in.</aside>
     * <aside class="info">Can trigger notifications to admins if the user submits an unrecognized subject.</aside>
     */
    public function SetSubjects(Request $request, NotificationService $notificationService) {

        $user = auth()->user();
        if ($user->role != 'tutor' && $user->role != 'admin') {
            return response()->json([
                'success' => false,
                'error' => 'unauthorized'
            ], 401);
        }

        $validated = $request->validate([
            'subjects' => ['required'],
            'subjects.*.subject_id' => ['required_without:subjects.*.subject_name', 'exists:subjects,id'],
            'subjects.*.subject_name' => ['required_without:subjects.*.subject_id', 'string'],
            'subjects.*.level' => ['required', Rule::in(ESubjectLevels::cases())],
            'subjects.*.price_per_hour_online' => ['integer'],
            'subjects.*.price_per_hour_in_person' => ['integer'],
            'subjects.*.online' => ['required', 'boolean'],
            'subjects.*.in_person' => ['required', 'boolean']
        ]);

        $user->subjects()->detach();

        $newSubjects = [];
        foreach ($validated['subjects'] as &$subject) {
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

        if (count($newSubjects) > 0) {
            $notificationService->NotifyAdminsOfNewSubjects($user);
        }

        return response()->json([
            'success' => true,
            'user' => User::where('id', $user->id)->with(['subjects'])->first()
        ]);
    }

    /**
     * Set weekly availability
     * 
     * Used by tutors to update their availability
     */
    public function SetAvailability(Request $request) {

        $user = auth()->user();
        if ($user->role != "tutor" && $user->role != "admin") {
            return response()->json([
                'success' => false,
                'error' => 'unauthorized'
            ], 401);
        }

        $validated = $request->validate([
            'weekly_availability' => ['required'],
            'weekly_availability.morning' => ['required'],
            'weekly_availability.afternoon' => ['required'],
            'weekly_availability.evening' => ['required'],
            'weekly_availability.night' => ['required'],
            'weekly_availability.*.*' => ['boolean']
        ]);

        $user->weekly_availability = json_encode($validated['weekly_availability']);
        $user->save();

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    /**
     * Sets qualifications
     * 
     * Used by tutors to update their qualifications
     */
    public function SetQualifications(Request $request) {
        
        $user = auth()->user();
        if ($user->role != "tutor" && $user->role != "admin") {
            return response()->json([
                'success' => false,
                'error' => 'unauthorized'
            ], 401);
        }
        
        $validated = $request->validate([
            'qualifications' => ['required'],
            'qualifications.*.school' => ['required'],
            'qualifications.*.title' => ['required'],
            'qualifications.*.grade' => ['required'],
            'qualifications.*.degree' => ['required', 'boolean'],
            'qualifications.*.other' => ['required', 'boolean']
        ]);

        $user->qualifications = json_encode($validated['qualifications']);
        $user->save();

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    /**
     * Updates tutor profile
     * 
     * Used by tutors to update the main portion of their profile (pic, summary, etc.)
     */
    public function SetProfile(Request $request) {

        $user = auth()->user();
        if ($user->role != "tutor" && $user->role != "admin") {
            return response()->json([
                'success' => false,
                'error' => 'unauthorized'
            ], 401);
        }

        $validated = $request->validate([
            'profile_image' => ['url', 'nullable'],
            'profile_summary' => ['string', 'nullable'],
            'profile_about_you' => ['string', 'nullable'],
            'gender' => ['in:male,female', 'nullable']
        ]);

        if (array_key_exists('profile_image', $validated) && $validated['profile_image']) { $user->profile_image = $validated['profile_image']; }
        if (array_key_exists('profile_summary', $validated) && $validated['profile_summary']) { $user->profile_summary = $validated['profile_summary']; }
        if (array_key_exists('profile_about_you', $validated) && $validated['profile_about_you']) { $user->profile_about_you = $validated['profile_about_you']; }
        if (array_key_exists('gender', $validated) && $validated['gender']) { $user->gender = $validated['gender']; }

        $user->save();
        
        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    /**
     * Updates tutor verification documents
     * 
     * Used by tutors to update their vertification documents
     */
    public function SetVerificationDocuments(Request $request) {

        $user = auth()->user();
        if ($user->role != "tutor" && $user->role != "admin") {
            return response()->json([
                'success' => false,
                'error' => 'unauthorized'
            ], 401);
        }

        $validated = $request->validate([
            'verification_documents' => ['present', 'array'],
            'verification_documents.*' => ['string'],
            'qualification_documents' => ['present', 'array'],
            'qualification_documents.*' => ['string'],
            'optional_documents.*' => ['string'],
            'opt_degree' => ['boolean'],
            'opt_dbs' => ['boolean'],
            'opt_enhanced_dbs' => ['boolean'],
            'opt_examiner' => ['boolean'],
            'opt_aqa' => ['boolean'],
            'opt_ccea' => ['boolean'],
            'opt_ocr' => ['boolean'],
            'opt_edexel' => ['boolean'],
            'opt_wjec' => ['boolean']
        ]);

        $user->verification_documents = json_encode($validated['verification_documents']);
        $user->qualification_documents = json_encode($validated['qualification_documents']);
        
        if (array_key_exists('optional_documents', $validated)) {
            $user->optional_documents = json_encode($validated['optional_documents']);
        }

        $user->opt_degree = $validated['opt_degree'] ?? false;
        $user->opt_dbs = $validated['opt_dbs'] ?? false;
        $user->opt_enhanced_dbs = $validated['opt_enhanced_dbs'] ?? false;
        $user->opt_examiner = $validated['opt_examiner'] ?? false;
        $user->opt_aqa = $validated['opt_aqa'] ?? false;
        $user->opt_ccea = $validated['opt_ccea'] ?? false;
        $user->opt_ocr = $validated['opt_ocr'] ?? false;
        $user->opt_edexel = $validated['opt_edexel'] ?? false;
        $user->opt_wjec = $validated['opt_wjec'] ?? false;

        $user->save();

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    /**
     * Submit a new review of a tutor
     * 
     * @param rating        Integer
     * @param review        String
     * @param subject_id    Integer
     * @param level         String
     */
    public function SubmitReview(Request $request, NotificationService $notificationService) {

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'review' => ['required', 'string'],
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'level' => ['required', 'string']
        ]);

        $reviewer = auth()->user();
        $tutor = User::where('message_uuid', $request->route('uuid'))->firstOrFail();

        $review = new Review;
        $review->user_id = $tutor->id;
        $review->reviewer_id = $reviewer->id;
        $review->rating = $validated['rating'];
        $review->review = $validated['review'];
        $review->subject_id = $validated['subject_id'];
        $review->level = $validated['level'];
        $review->reviewee_acceptance = 'pending';
        $review->reviewer_escalated = false;
        $review->reviewee_rejection_message = "";
        $review->reviewer_escalation_message = "";
        $review->admin_action = "pending";
        $review->save();

        $subject = Subject::where('id', $review->subject_id)->firstOrFail();

        $notificationService->NotifyTutorOrReview($tutor, $reviewer, $review, $subject->subject, $review->level);

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Used by tutors to respond to a review they've received & approved
     * 
     * @param message   String
     */
    public function RespondToReview(Request $request) {

        $validated = $request->validate([
            'message' => ['required', 'string']
        ]);

        $reviewId = $request->route('id');
        $review = Review::where('id', $reviewId)->firstOrFail();
        $user = auth()->user();

        if ($user->id != $review->user_id) {
            return response()->json([
                'error' => 'Unauthorized'
            ], 401);
        }

        $review->tutor_response = $validated['message'];
        $review->save();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Used by tutors to approve a review submitted of them
     * 
     * @param id    Integer ID of the review to approved
     */
    public function ApproveReview(Request $request) {

        $user = auth()->user();
        $review = Review::where('id', $request->route('id'))->firstOrFail();
        
        if ($user->id != $review->user_id) {
            return response()->json([
                'error' => 'Unauthorized.'
            ], 401);
        }

        $review->reviewee_acceptance = 'approved';
        $review->save();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Used by tutors to reject a review submitted of them
     * 
     * @param message   String  Message to send back to the student explaining why the review is being rejected
     */
    public function RejectReview(Request $request, NotificationService $notificationService) {

        $validated = $request->validate([
            'message' => ['required', 'string']
        ]);

        $user = auth()->user();
        $review = Review::where('id', $request->route('id'))->firstOrFail();
        
        if ($user->id != $review->user_id) {
            return response()->json([
                'error' => 'Unauthorized.'
            ], 401);
        }

        if ($review->reviewee_acceptance != 'pending') {
            return response()->json([
                'error' => 'Not needed.'
            ], 401);
        }

        $review->reviewee_acceptance = 'rejected';
        $review->reviewee_rejection_message = $validated['message'];
        $review->save();

        $student = User::where('id', $review->reviewer_id)->firstOrFail();
        $subject = Subject::where('id', $review->subject_id)->firstOrFail();

        $notificationService->NotifyUserOfReviewRejection($student, $user, $review, $subject->subject, $review->level);

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Used by students to escalate a rejected review to an admin
     * 
     * @param message   String  Message from the student to the admin explaining why they believe the rejection of the review is inappropriate
     */
    public function EscalateReview(Request $request, NotificationService $notificationService) {

        $validated = $request->validate([
            'message' => ['required', 'string']
        ]);

        $user = auth()->user();
        $review = Review::where('id', $request->route('id'))->firstOrFail();

        if ($user->id != $review->reviewer_id) {
            return response()->json([
                'error' => 'Unauthorized.'
            ], 401);
        }

        if ($review->reviewee_acceptance != 'rejected' || $review->reviewer_escalated != 0) {
            return response()->json([
                'error' => 'Not needed.'
            ], 401);
        }

        $review->reviewer_escalated = true;
        $review->reviewer_escalation_message = $validated['message'];
        $review->save();

        return response()->json([
            'success' => true
        ]);

    }

    /**
     * Updates additional profile images & video
     * 
     * @param profile_video_link        String          Youtube embed format link
     * @param profile_additional_images Array[String]   Array of file URLs
     */
    public function SetPhotos(Request $request) {

        $user = auth()->user();
        if ($user->role != "tutor" && $user->role != "admin") {
            return response()->json([
                'success' => false,
                'error' => 'unauthorized'
            ], 401);
        }

        $data = $request->validate([
            'profile_video_link' => ['url'],
            'profile_additional_images.*' => ['url'],
        ]);

        $user->profile_video_link = array_key_exists('profile_video_link', $data) ? $data['profile_video_link'] : null;
        $user->profile_additional_images = array_key_exists('profile_additional_images', $data) ? json_encode($data['profile_additional_images']) : '[]';

        $user->save();

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    /**
     * Updates tutor references
     */
    public function SetReferences(Request $request, NotificationService $notificationService) {

        $user = auth()->user();
        if ($user->role != "tutor" && $user->role != "admin") {
            return response()->json([
                'success' => false,
                'error' => 'unauthorized'
            ], 401);
        }
        $user->makeVisible(['references']);

        $validated = $request->validate([
            'references' => ['required'],
            'references.*.name' => ['required', 'string'],
            'references.*.email' => ['required', 'string'],
            'references.*.mobile' => ['required', new MobileNumber],
            'references.*.relationship' => ['required', 'string'],
            'references.*.status' => ['required', 'string'],
            'references.*.contacted' => ['required', 'boolean'],
            'references.*.uuid' => ['required', 'string'],
            'references.*.response' => ['nullable']
        ]);

        $sentEmail = false;

        foreach($validated['references'] as $index => $reference) {
            if (!array_key_exists('response', $reference)) {
                $reference['response'] = (object)[];
                $validated['references'][$index] = $reference;
            }

            if (!$reference['contacted']) {
                $notificationService->ContactTutorReference($user, $reference);
                $reference['contacted'] = true;
                $validated['references'][$index] = $reference;
                $sentEmail = true;
            }
        }

        $user->references = json_encode($validated['references']);
        $user->save();

        return response()->json([
            'success' => true,
            'user' => $user,
            'sentEmail' => $sentEmail
        ]);
    }

    /**
     * Returns the total number of reviews submitted by the current user
     */
    public function CountReviewsFrom(Request $request) {

        $user = auth()->user();

        return response()->json([
            'success' => true,
            'count' => Review::where('reviewer_id', $user->id)->count()
        ]);
    }

    /**
     * Used by tutors in draft to request their profile be reviewed
     */
    public function ApplyToGoLive(Request $request, NotificationService $notificationService) {

        $user = auth()->user();
        
        if ($user->role == 'tutor' && $user->validation_status == 'pending' && $user->draft) {
            $user->draft = false;
            $user->save();

            $notificationService->NotifyAdminsOfTutorRegistration($user);

            return response()->json([
                'success' => true
            ]);
        } 

        return response()->json([
            'error' => 'unauthorized'
        ], 400);
    }

    /**
     * Used by tutors to apply to have their background check status reviewed
     */
    public function ApplyForVerificationStatus(Request $request, NotificationService $notificationService) {

        $user = auth()->user();
        
        if ($user->role == 'tutor' && !$user->verified_tutor_status) {
            $user->verified_tutor_status = 'pending';
            $user->save();

            $notificationService->NotifyAdminsOfTutorVerification($user);

            return response()->json([
                'success' => true
            ]);
        } 

        return response()->json([
            'error' => 'unauthorized'
        ], 400);
    }
}