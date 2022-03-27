<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Review;
use App\Models\Subject;
use App\Models\AnalyticsEvent;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

/**
 * @group Administration
 *
 * Endpoints used by admins to manage the site
 */
class AdminController extends Controller
{

    /**
     * Get data for dashboard overview
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function GetOverview(Request $request) {

        $events = AnalyticsEvent::where('created_at', '>=', \Carbon\Carbon::now()->subDays(31))
            ->select('*', DB::raw('count(event) as total'))
            ->groupBy(DB::raw('Date(created_at)'), 'event')
            ->get();

        $data = [];
        foreach($events as $event) {
            $dt = new \DateTime($event['created_at']);
            $label = $dt->format('D d');
            if (!array_key_exists($label, $data)) {
                $data[$label] = [];
            }

            if (!array_key_exists($event['event'], $data[$label])) {
                $data[$label][$event['event']] = 0;
            }

            $data[$label][$event['event']] += $event['total'];
        }

        $pendingSubjects = User::whereJsonLength('new_subjects', '>', 0)
            ->select(DB::raw("SUM(JSON_LENGTH(new_subjects)) as total"))
            ->first();

        $pending = [
            'tutors' => User::where(['role' => 'tutor', 'validation_status' => 'pending'])->count(),
            'students' => User::where(['role' => 'client', 'validation_status' => 'pending'])->count(),
            'subjects' => intval($pendingSubjects['total']),
            'reviews' => Review::where(['reviewer_escalated' => 1, 'admin_action' => 'pending'])->count()
        ];


        return [
            'analytics' => $data,
            'pending' => $pending
        ];
    }

    /**
     * Get a list of tutors waiting for admin review
     *
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     *
     */
    public function GetPendingTutors(Request $request) {
        
        $validated = $request->validate([
            'subjects.*' => ['integer', 'exists:subjects,id'],
            'levels.*' => ['string'],
            'availability' => ['string'],
            'search' => 'string'
        ]);

        $query = User::where([
            'role' => 'tutor', 
            'validation_status' => 'pending',
            'closed' => false
        ])->with(['subjects']);

        if (array_key_exists('subjects', $validated)) {
            $query->whereRelation('subjects', function($subquery) use($validated) {

                $subquery->whereIn('subjects.id', $validated['subjects']);

                if (array_key_exists('levels', $validated)) {
                    $subquery->whereIn('level', $validated['levels']);
                }
            });
        } else {
            if (array_key_exists('levels', $validated)) {
                $query->whereRelation('subjects', function($subquery) use($validated) {
                    $subquery->whereIn('level', $validated['levels']);
                });
            }
        }

        if (array_key_exists('availability', $validated)) {
            $availability = json_decode($validated['availability'], true);
            
            if (
                in_array(true, $availability['morning']) ||
                in_array(true, $availability['afternoon']) ||
                in_array(true, $availability['evening'])
            ) {
                $query->where(function ($subquery) use ($validated, $availability) {
                    foreach($availability['morning'] as $index => $slot) {
                        if ($slot) {
                            $subquery->orWhereRaw('JSON_SEARCH(weekly_availability, "one", "true", null, "$.morning[' . $index . ']") is not null');
                        }
                    }
                    foreach($availability['afternoon'] as $index => $slot) {
                        if ($slot) {
                            $subquery->orWhereRaw('JSON_SEARCH(weekly_availability, "one", "true", null, "$.afternoon[' . $index . ']") is not null');
                        }
                    }
                    foreach($availability['evening'] as $index => $slot) {
                        if ($slot) {
                            $subquery->orWhereRaw('JSON_SEARCH(weekly_availability, "one", "true", null, "$.evening[' . $index . ']") is not null');
                        }
                    }
                });
            }
        }

        if (array_key_exists('search', $validated) && $validated['search']) {
            $query->where('name', 'like', '%' . $validated['search'] . '%');
            $query->orwhere('surname', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('email', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('profile_summary', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('profile_about_you', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('address_line_1', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('address_line_2', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('city', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('county', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('mobile_number', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('postcode', 'like', '%' . $validated['search'] . '%');
        }

        return $query->paginate();
    }

    /**
     * Get a list of tutors waiting for verified status review
     *
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     *
     */
    public function GetPendingVerificationTutors(Request $request) {
        
        $validated = $request->validate([
            'subjects.*' => ['integer', 'exists:subjects,id'],
            'levels.*' => ['string'],
            'availability' => ['string'],
            'search' => 'string'
        ]);

        $query = User::where([
            'role' => 'tutor', 
            'verified_tutor_status' => 'pending',
            'closed' => false
        ]);

        if (array_key_exists('subjects', $validated)) {
            $query->whereRelation('subjects', function($subquery) use($validated) {

                $subquery->whereIn('subjects.id', $validated['subjects']);

                if (array_key_exists('levels', $validated)) {
                    $subquery->whereIn('level', $validated['levels']);
                }
            });
        } else {
            if (array_key_exists('levels', $validated)) {
                $query->whereRelation('subjects', function($subquery) use($validated) {
                    $subquery->whereIn('level', $validated['levels']);
                });
            }
        }

        if (array_key_exists('availability', $validated)) {
            $availability = json_decode($validated['availability'], true);
            
            if (
                in_array(true, $availability['morning']) ||
                in_array(true, $availability['afternoon']) ||
                in_array(true, $availability['evening'])
            ) {
                $query->where(function ($subquery) use ($validated, $availability) {
                    foreach($availability['morning'] as $index => $slot) {
                        if ($slot) {
                            $subquery->orWhereRaw('JSON_SEARCH(weekly_availability, "one", "true", null, "$.morning[' . $index . ']") is not null');
                        }
                    }
                    foreach($availability['afternoon'] as $index => $slot) {
                        if ($slot) {
                            $subquery->orWhereRaw('JSON_SEARCH(weekly_availability, "one", "true", null, "$.afternoon[' . $index . ']") is not null');
                        }
                    }
                    foreach($availability['evening'] as $index => $slot) {
                        if ($slot) {
                            $subquery->orWhereRaw('JSON_SEARCH(weekly_availability, "one", "true", null, "$.evening[' . $index . ']") is not null');
                        }
                    }
                });
            }
        }

        if (array_key_exists('search', $validated) && $validated['search']) {
            $query->where('name', 'like', '%' . $validated['search'] . '%');
            $query->orwhere('surname', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('email', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('profile_summary', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('profile_about_you', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('address_line_1', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('address_line_2', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('city', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('county', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('mobile_number', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('postcode', 'like', '%' . $validated['search'] . '%');
        }

        return $query->paginate();
    }

    /**
     * Approve a for "background check" status
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function ApproveTutorVerification(Request $request) {

        $tutor = User::where('message_uuid', $request->route('uuid'))->firstOrfail();
        $tutor->verified_tutor_status = 'approved';
        $tutor->save();

        return response()->json([
            'success' => 'true'
        ]);
    }

    /**
     * Reject a tutor for "background check" status
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function RejectTutorVerification(Request $request) {

        $tutor = User::where('message_uuid', $request->route('uuid'))->firstOrfail();
        $tutor->verified_tutor_status = 'rejected';
        $tutor->save();

        return response()->json([
            'success' => 'true'
        ]);
    }

    /**
     * Get a tutors profile
     * 
     * @param uuid  String  Route parameter identifying the tutor to retreive by their message_uuid
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function GetTutor(Request $request) {

        return User::where([
                'message_uuid' => $request->route('uuid'),
                'closed' => false,
            ])
            ->with(['subjects', 'reviews.reviewer'])
            ->firstOrFail()
            ->makeVisible([
                'verification_documents',
                'qualification_documents',
                'optional_documents',
                'references'
            ]);
    }

    /**
     * Get a students profile
     * 
     * @param uuid  String  Route parameter identifying the student to retreive by their message_uuid
     */
    public function GetStudent(Request $request) {

        return User::where([
                'message_uuid' => $request->route('uuid'),
                'closed' => false,
            ])
            ->firstOrFail();
    }

    /**
     * Get a list of students waiting for admin review
     *
     * @param search    String  If present all text-based fields will be compared to this value
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     *
     */
    public function GetPendingStudents(Request $request) {
        
        $validated = $request->validate([
            'search' => 'string'
        ]);

        $query = User::where([
            'role' => 'client', 
            'validation_status' => 'pending',
            'closed' => false
        ]);

        if (array_key_exists('search', $validated) && $validated['search']) {
            $query->where('name', 'like', '%' . $validated['search'] . '%');
            $query->orwhere('surname', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('email', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('address_line_1', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('address_line_2', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('city', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('county', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('mobile_number', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('postcode', 'like', '%' . $validated['search'] . '%');
        }

        return $query->paginate();
    }

    /**
     * Get all reviews escalated by students
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function GetEscalatedReviews(Request $request) {

        return Review::where('reviewer_escalated', 1)
            ->where('admin_action', 'pending')
            ->with(['reviewer', 'reviewee'])
            ->paginate();
    }

    /**
     * Reject a review escalation
     * 
     * @param review_id Integer The ID of the review to reject
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function RejectReview(Request $request) {

        $validated = $request->validate([
            'review_id' => ['required', 'exists:tutor_reviews,id']
        ]);

        $review = Review::where('id', $validated['review_id'])->firstOrFail();

        $review->admin_action = 'rejected';
        $review->save();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Approve a review escalation
     * 
     * This will override a tutors rejection and set the review live.
     * 
     * @param review_id Integer The ID of the review to approve
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function ApproveReview(Request $request) {

        $validated = $request->validate([
            'review_id' => ['required', 'exists:tutor_reviews,id']
        ]);

        $review = Review::where('id', $validated['review_id'])->firstOrFail();

        $review->admin_action = 'approved';
        $review->save();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Get all unrecognized subjects entered by tutors
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function GetPendingSubjects(Request $request) {

        $users = User::whereJsonLength('new_subjects', '>', 0)->get();
        $newSubjects = [];
        $subjectNames = [];
        foreach($users as $user) {
            $subjects = json_decode($user->new_subjects, true);
            foreach($subjects as $subject) {
                if (array_search($subject['subject_name'], $subjectNames) === false) {
                    $newSubjects[] = $subject;
                    $subjectNames[] = $subject['subject_name'];
                }
            }
        }

        return $newSubjects;
    }

    /**
     * Get a list of all unique subject categories
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function GetSubjectCategories(Request $request) {

        return DB::table('subjects')->select('category')->groupBy('category')->get();
    }

    /**
     * Approve an unrecognized subject entered by an admin
     * 
     * @param subject_name      String  The name of the subject to approve
     * @param subject_id        Integer If it's to be remapped to an existing subject-- the id of that subject
     * @param rename_subject    String  If it's to be renamed-- the new name to use in place of subject_name
     * @param category          String  The subject category
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function ApproveSubject(Request $request, NotificationService $notificationService) {

        $validated = $request->validate([
            'subject_name' => ['required', 'string'],
            'subject_id' => ['integer'],
            'rename_subject' => ['string'],
            'category' => ['string']
        ]);

        $users = User::whereJsonContains('new_subjects', ['subject_name' => $validated['subject_name']])->get();

        foreach($users as $user) {
            $newSubjects = json_decode($user->new_subjects);
            $indiciesToRemove = [];
            foreach($newSubjects as $index => $subject) {
                if ($subject->subject_name == $validated['subject_name']) {
                    $indiciesToRemove[] = $index;
                    
                    if (!array_key_exists('subject_id', $validated)) {
                        $sub = new Subject;
                        $sub->subject = array_key_exists('rename_subject', $validated) ? $validated['rename_subject'] : $subject->subject_name;
                        $sub->category = array_key_exists('category', $validated) ? $validated['category'] : '';
                        $sub->save();
                        $sub->refresh();

                        $newsub = json_decode(json_encode($subject), true);
                        unset($newsub['subject_name']);
                        if (array_key_exists('rename_subject', $newsub)) {
                            unset($newsub['rename_subject']);
                        }
                        $user->subjects()->attach($sub->id, $newsub);
                    } else {
                        $sub = Subject::where('id', $validated['subject_id'])->first();
                        
                        $newsub = json_decode(json_encode($subject), true);
                        unset($newsub['subject_id']);
                        unset($newsub['subject_name']);
                        
                        if (array_key_exists('rename_subject', $newsub)) {
                            unset($newsub['rename_subject']);
                        }
                        $user->subjects()->attach($sub->id, $newsub);
                    }
                    
                    $user->save();

                    if (array_key_exists('rename_subject', $validated)) {
                        $notificationService->NotifyTutorOfSubjectRename($user, $validated['subject_name'], $validated['rename_subject']);
                    } else if (array_key_exists('subject_id', $validated)) {
                        $sub = Subject::where('id', $validated['subject_id'])->first();
                        $notificationService->NotifyTutorOfSubjectRemap($user, $validated['subject_name'], $sub->subject);
                    } else {
                        $notificationService->NotifyTutorOfSubjectApproval($user, $validated['subject_name']);
                    }
                    
                }
            }

            foreach($indiciesToRemove as $index) {
                unset($newSubjects[$index]);
            }

            $user->new_subjects = json_encode(array_values($newSubjects));
            $user->save();
        }

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Reject an unrecognized subject entered by an tutor
     * 
     * @param subject_name  String  The name of the subject to reject
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function RejectSubject(Request $request, NotificationService $notificationService) {

        $validated = $request->validate([
            'subject_name' => ['required', 'string']
        ]);

        $users = User::whereJsonContains('new_subjects', ['subject_name' => $validated['subject_name']])->get();

        foreach($users as $user) {
            $newSubjects = json_decode($user->new_subjects);
            $indiciesToRemove = [];
            foreach($newSubjects as $index => $subject) {
                if ($subject->subject_name == $validated['subject_name']) {
                    $indiciesToRemove[] = $index;
                }
            }

            foreach($indiciesToRemove as $index) {
                unset($newSubjects[$index]);
            }

            $user->new_subjects = json_encode(array_values($newSubjects));
            $user->save();

            $notificationService->NotifyTutorOfSubjectRejection($user, $validated['subject_name']);
        }

        return response()->json([
            'success' => true
        ]);;
    }

    /**
     * Download a file from private storage
     * 
     * @param file  String  The name of the file to download
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function DownloadPrivateFile(Request $request) {
        
        $validated = $request->validate([
            'file' => ['required', 'string']
        ]);

        return Storage::disk('s3_private')->download(str_replace(env('AWS_S3_PRIVATE_TMP_BUCKET_URL'), '', $validated['file']));
    }

    /**
     * Approve a tutors reference
     * 
     * @param tutorId   Integer The tutor for whom the reference belongs
     * @param email     String  The email of the referee
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function ApproveReference(Request $request, NotificationService $notificationService) {

        $validated = $request->validate([
            'tutorId' => ['required', 'exists:users,id'],
            'email' => ['required', 'string']
        ]);

        $tutor = User::where('id', $validated['tutorId'])->firstOrFail();
        $refs = json_decode($tutor->references);

        $found = false;
        foreach($refs as $key => $reference) {
            if ($reference->email == $validated['email']) {
                $found = true;
                break;
            }
        }

        if ($found) {
            $refs[$key]->status = "approved";
        }

        $tutor->references = json_encode($refs);
        $tutor->save();

        $notificationService->NotifyTutorOfReferenceApproval($tutor, $refs[$key]);

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Reject a tutors reference
     * 
     * @param tutorId   Integer The tutor for whom the reference belongs
     * @param email     String  The email of the referee
     *  
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function RejectReference(Request $request, NotificationService $notificationService) {

        $validated = $request->validate([
            'tutorId' => ['required', 'exists:users,id'],
            'email' => ['required', 'string']
        ]);

        $tutor = User::where('id', $validated['tutorId'])->firstOrFail();
        $refs = json_decode($tutor->references);

        $found = false;
        foreach($refs as $key => $reference) {
            if ($reference->email == $validated['email']) {
                $found = true;
                break;
            }
        }

        if ($found) {
            $refs[$key]->status = "rejected";
        }

        $tutor->references = json_encode($refs);
        $tutor->save();

        $notificationService->NotifyTutorOfReferenceRejection($tutor, $refs[$key]);

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Mark a tutors reference as un-contactable
     * 
     * @param tutorId   Integer The tutor for whom the reference belongs
     * @param email     String  The email of the referee
     *  
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function NoContactReference(Request $request, NotificationService $notificationService) {

        $validated = $request->validate([
            'tutorId' => ['required', 'exists:users,id'],
            'email' => ['required', 'string']
        ]);

        $tutor = User::where('id', $validated['tutorId'])->firstOrFail();
        $refs = json_decode($tutor->references);

        $found = false;
        foreach($refs as $key => $reference) {
            if ($reference->email == $validated['email']) {
                $found = true;
                break;
            }
        }

        if ($found) {
            $refs[$key]->status = "no_contact";
        }

        $tutor->references = json_encode($refs);
        $tutor->save();

        $notificationService->NotifyTutorOfReferenceNoContact($tutor, $refs[$key]);

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Contact tutor about their pending registration
     * 
     * @param tutorId   Integer
     * @param message   String
     * @param replyTo   String
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function ContactTutorAboutRegistration(Request $request, NotificationService $notificationService) {

        $validated = $request->validate([
            'tutorId' => ['required', 'exists:users,id'],
            'message' => ['required', 'string'],
            'replyTo' => ['required', 'email']
        ]);

        $tutor = User::where('id', $validated['tutorId'])->firstOrFail();
        $notificationService->ContactTutorAboutRegistration($tutor, $validated['message'], $validated['replyTo']);

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Send email to many users at once
     *
     * @param userIds   Array[String]   Collection of user IDs for users to email
     * @param message   String          Message to send to users
     * @param replyTo   String          If present used to override the default reply-to address
     * @param subject   String          If present used to override the default subject line
     *  
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function MassContactUsers(Request $request, NotificationService $notificationService) {

        $validated = $request->validate([
            'userIds' => ['required'],
            'userIds.*' => ['integer'],
            'message' => ['required', 'string'],
            'replyTo' => ['email'],
            'subject' => ['string']
        ]);

        $users = User::select(['email', 'name'])
            ->whereIn('id', $validated['userIds'])
            ->chunk(25, function($users) use ($notificationService, $validated) {
                $notificationService->MassEmailUsers(
                    $users, 
                    $validated['message'], 
                    array_key_exists('replyTo', $validated) ? $validated['replyTo'] : null,
                    array_key_exists('subject', $validated) ? $validated['subject'] : null
                );
            });
        

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Delete many users at once
     * 
     * @param userIds   Array[String]   Collection of user IDs for users to delete
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function MassDeleteUsers(Request $request) {

        $validated = $request->validate([
            'userIds' => ['required'],
            'userIds.*' => ['integer']
        ]);

        User::whereIn('id', $validated['userIds'])->chunk(25, function($users) {
            foreach($users as $user) {
                $user->closed = true;
                $user->email = "___closed___" . $user->email;
                $user->save();
            }
        });
        
        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Approve a tutor account
     *
     * Used by admins after reviewing a tutors registration to approve it for going live
     * 
     * @param tutorId   Integer ID of tutor to approve
     *
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     *
     */
    public function ApproveTutor(Request $request, NotificationService $notificationService) {

        $validated = $request->validate([
            'tutorId' => ['required', 'exists:users,id']
        ]);

        $tutor = User::where('id', $validated['tutorId'])->firstOrFail();
        if ($tutor->validation_status == 'approved') {
            return response()->json([
                'success' => false,
                'error' => 'Tutor is already approved'
            ], 400);
        }

        $tutor->enabled = true;
        $tutor->validation_status = "approved";
        $tutor->save();
        $notificationService->NotifyTutorOfAccountApproval($tutor);

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Reject a tutor account
     *
     * Used by admins after reviewing a tutors registration to reject the application
     *
     * @param tutorId   Integer ID of tutor to reject
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function RejectTutor(Request $request, NotificationService $notificationService) {
        
        $validated = $request->validate([
            'tutorId' => ['required', 'exists:users,id']
        ]);

        $tutor = User::where('id', $validated['tutorId'])->firstOrFail();
        if ($tutor->validation_status == 'rejected') {
            return response()->json([
                "success" => false,
                "error" => "Tutor is already rejected"
            ], 400);
        }

        $tutor->enabled = false;
        $tutor->validation_status = "rejected";
        $tutor->save();
        $notificationService->NotifyTutorOfAccountRejection($tutor);

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Approve a student account
     *
     * Used by admins after reviewing a students registration to approve it for going live
     * 
     * @param studentId   Integer ID of student to approve
     *
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     *
     */
    public function ApproveStudent(Request $request, NotificationService $notificationService) {

        $validated = $request->validate([
            'studentId' => ['required', 'exists:users,id']
        ]);

        $tutor = User::where('id', $validated['studentId'])->firstOrFail();
        if ($tutor->validation_status == 'approved') {
            return response()->json([
                'success' => false,
                'error' => 'Tutor is already approved'
            ], 400);
        }

        $tutor->validation_status = "approved";
        $tutor->save();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Reject a tutor account
     *
     * Used by admins after reviewing a students registration to reject the application
     * 
     * @param studentId   Integer ID of student to reject
     *
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function RejectStudent(Request $request, NotificationService $notificationService) {
        
        $validated = $request->validate([
            'studentId' => ['required', 'exists:users,id']
        ]);

        $tutor = User::where('id', $validated['studentId'])->firstOrFail();
        if ($tutor->validation_status == 'rejected') {
            return response()->json([
                "success" => false,
                "error" => "Tutor is already rejected"
            ], 400);
        }

        $tutor->validation_status = "rejected";
        $tutor->save();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Get the total number of various types of user
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function GetUserTotals(Request $request) {
        return response()->json([
            'success' => true,
            'tutors' => User::where('role', 'tutor')->count(),
            'students' => User::where('role', 'client')->count(),
            'pendingTutors' => User::where(['role' => 'tutor', 'validation_status' => 'pending'])->count(),
            'pendingStudents' => User::where(['role' => 'client', 'validation_status' => 'pending'])->count()
        ]);
    }

    private function BuildGetUsersQuery(Request $request) {
        $validated = $request->all();

        $query = User::select()
            ->where(['closed' => false, 'validation_status' => 'approved'])
            ->with(['subjects']);

        if (array_key_exists('tutorFilter', $validated) || array_key_exists('studentFilter', $validated) || array_key_exists('adminFilter', $validated)) {
            $roles = [];
            if (array_key_exists('tutorFilter', $validated) && $validated['tutorFilter'] == 'true') {
                $roles[] = 'tutor';
            }
            if (array_key_exists('studentFilter', $validated) && $validated['studentFilter'] == 'true') {
                $roles[] = 'client';
            }
            if (array_key_exists('adminFilter', $validated) && $validated['adminFilter'] == 'true') {
                $roles[] = 'admin';
            }

            if (count($roles) > 0) {
                $query->whereIn('role', $roles);
            }
            
        }

        if (array_key_exists('search', $validated) && $validated['search']) {
            $query->where('name', 'like', '%' . $validated['search'] . '%');
            $query->orwhere('surname', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('email', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('profile_summary', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('profile_about_you', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('address_line_1', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('address_line_2', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('city', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('county', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('mobile_number', 'like', '%' . $validated['search'] . '%');
            $query->orWhere('postcode', 'like', '%' . $validated['search'] . '%');
        }

        if (array_key_exists('subjects', $validated)) {
            $query->whereRelation('subjects', function($subquery) use($validated) {
                $subquery->whereIn('subjects.id', $validated['subjects']);
            });
        }

        if (array_key_exists('levels', $validated)) {
            $query->whereRelation('subjects', function($subquery) use ($validated) {
                $subquery->whereIn('level', $validated['levels']);
            });
        }

        if (array_key_exists('availability', $validated)) {
            $availability = json_decode($validated['availability'], true);

            if (
                in_array(true, $availability['morning']) ||
                in_array(true, $availability['afternoon']) ||
                in_array(true, $availability['evening'])
            ) {
                $query->where(function ($subquery) use ($validated, $availability) {
                    foreach($availability['morning'] as $index => $slot) {
                        if ($slot) {
                            $subquery->orWhereRaw('JSON_SEARCH(weekly_availability, "one", "true", null, "$.morning[' . $index . ']") is not null');
                        }
                    }
                    foreach($availability['afternoon'] as $index => $slot) {
                        if ($slot) {
                            $subquery->orWhereRaw('JSON_SEARCH(weekly_availability, "one", "true", null, "$.afternoon[' . $index . ']") is not null');
                        }
                    }
                    foreach($availability['evening'] as $index => $slot) {
                        if ($slot) {
                            $subquery->orWhereRaw('JSON_SEARCH(weekly_availability, "one", "true", null, "$.evening[' . $index . ']") is not null');
                        }
                    }
                });
            }
        }

        return $query;
    }

    /**
     * Returns a paginated list of all users
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function GetUsers(Request $request) {

        $query = $this->BuildGetUsersQuery($request);

        return response()->json($query->paginate());
    }

    /**
     * Returns the ids of all users matching criteria
     * 
     * Used by admins to select all users across paginated results
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function SelectAllUsers(Request $request) {

        $query = $this->BuildGetUsersQuery($request);
        $users = $query->get();

        $ids = [];
        foreach($users as $user) {
            $ids[] = $user->id;
        }

        return response()->json([
            'ids' => $ids
        ]);
    }

    /**
     * Returns the ids of all subjects matching criteria
     * 
     * Used by admins to select all subjects across paginated results
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function SelectAllSubjects(Request $request) {

        $validated = $request->validate([
            'name' => ['string'],
            'subjects.*' => ['string'],
            'levels.*' => ['string'],
            'categories.*' => ['string']
        ]);
        
        $query = Subject::select('id');
        
        if (array_key_exists('name', $validated)) {
            $query->where('subject', 'like', '%' . $validated['name'] . '%');
        }

        if (array_key_exists('subject', $validated)) {
            $query->whereIn('subject', $validated['subjects']);
        }

        if (array_key_exists('categories', $validated)) {
            $query->whereIn('category', $validated['categories']);
        }

        if (array_key_exists('levels', $validated)) {
            $query->whereJsonContains('levels', $validated['levels']);
        }

        $subjects = $query->get();

        $ids = [];
        foreach($subjects as $subject) {
            $ids[] = $subject->id;
        }

        return response()->json([
            'ids' => $ids
        ]);
    }

    /**
     * Used to "log in" as a specific user
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function ImpersonateUser(Request $request) {

        $validated = $request->validate([
            'user_id' => ['required', 'integer']
        ]);

        $user = User::where('id', $validated['user_id'])->with(['subjects', 'reviews.reviewer', 'notificationPreferences'])->firstOrFail();
        
        if ($user->role == 'admin') {
            return response()->json([
                'success' => false,
                'error' => 'You can not impersonate an admin'
            ], 400);
        }

        $returnToken = (string)Str::orderedUuid();
        $admin = auth()->user();
        $admin->return_token = $returnToken;
        $admin->save();

        Log::info("Admin {$admin->id} ({$admin->email}) is impersonating {$user->id} ({$user->email})");

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'user' => $user->makeVisible([
                'verification_documents',
                'qualification_documents',
                'optional_documents',
                'references'
            ]),
            'return_token' => $returnToken
        ]);
    }

    /**
     * Used to return to admin session after impersonating a user
     */
    public function ReturnToAdmin(Request $request) {

        $validated = $request->validate([
            'return_token' => ['required', 'string']
        ]);

        $user = User::where('return_token', $validated['return_token'])->with(['notificationPreferences'])->firstOrFail();
        $user->return_token = null;
        $user->save();

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    /**
     * Request a revision to a particular section of a tutors registration
     * 
     * <aside class="notice">Only admins may invoke this endpoint</aside>
     */
    public function RequestRevision(Request $request, NotificationService $notificationService) {

        $validated = $request->validate([
            'replyTo' => ['email'],
            'tutorId' => ['required', 'integer'],
            'message' => ['required', 'string'],
            'section' => ['required', 'in:account,address,subjects,qualifications,profile,photos,documents,availability,references']
        ]);

        $tutor = User::where('id', $validated['tutorId'])->firstOrFail();
        $notificationService->ContactTutorForMoreRegistrationInformation(
            $validated['section'], 
            $tutor, 
            $validated['message'], 
            array_key_exists('replyTo', $validated) ? $validated['replyTo'] : null
        );

        switch($validated['section']) {
            case "account":
                $tutor->admin_account_status = 'more info';
                break;
            case "address":
                $tutor->admin_address_status = 'more info';
                break;
            case "subjects":
                $tutor->admin_subjects_status = 'more info';
                break;
            case "qualifications":
                $tutor->admin_qualifications_status = 'more info';
                break;
            case "profile":
                $tutor->admin_profile_status = 'more info';
                break;
            case "photos":
                $tutor->admin_photos_status = 'more info';
                break;
            case "documents":
                $tutor->admin_documents_status = 'more info';
                break;
            case "availability":
                $tutor->admin_availability_status = 'more info';
                break;
            case "references":
                $tutor->admin_references_status = 'more info';
                break;
        }

        $tutor->save();

        return response()->json([
            'success' => true
        ]);
    }
}
