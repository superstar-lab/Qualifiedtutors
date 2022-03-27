<?php

namespace App\Services;

use Twilio;

use SendGrid\Mail\From;
use SendGrid\Mail\Mail;
use SendGrid\Mail\Personalization;
use SendGrid\Mail\Subject;
use SendGrid\Mail\To;

use App\Models\User;
use App\Models\Message;
use App\Models\Review;
use App\Enums\ENotificationTypes;
use Illuminate\Support\Facades\Log;

/**
 *
 * Sends email and SMS notifications 
 *
 * Email templating is handle by SendGrids "dynamic template" feature. To edit email templates log into sendgrid.
 * 
 * SMS templates are handled using Blade. To edit SMS templates modify the files under resources/views/sms
 *
 */
class NotificationService {
    
    /**
     * Send a formatted email to a list of users via Twilio SendGrid
     *
     * @param $data [
     *      'email@address.example' => [
     *          '__name' => 'users name', // REQUIRED
     *          'sendgrid_personalization_field' => value
     *      ] 
     * ]
     */
    public function SendTemplatedEmail($templateId, $subject, $templatedata, $replyTo = null) {

        $email = new Mail();
        $email->setFrom(env('SENDGRID_FROM_ADDRESS'), env('SENDGRID_FROM_NAME'));
        $email->setTemplateId($templateId);
        $email->setSubject($subject);
        
        if ($replyTo) {
            $email->setReplyTo($replyTo);
        }
        
        $personalization = new Personalization();
        foreach($templatedata as $emailAddress => $data) {
            
            if (!array_key_exists('subject', $data)) {
                $data['subject'] = $subject;   
            }

            $personalization->addTo(new To(
                $emailAddress, 
                $data['__name'], 
                $data,
                array_key_exists('subject', $templatedata) ? $templatedata['subject'] : $subject
            ));

            foreach($data as $key => $value) {
                $personalization->addDynamicTemplateData($key, $value);
            }
        }
        $email->addPersonalization($personalization);

        $sendgrid = new \SendGrid(env('SENDGRID_API_KEY'));
        try {
            $response = $sendgrid->send($email);
            $statusCode = $response->statusCode();

            if ($statusCode < 200 || $statusCode >= 300) {
                Log::error("Failed to send email due to SendGrid failure", [
                    'status_code' => $statusCode,
                    'response_body' => $response->body(),
                    'response_headers' => $response->headers()
                ]);
            }
        } catch (Exception $e) {
            Log::error("Failed to send email due to exception", [
                'exception' => $e->getMessage(),
                'exception_code' => $e->getCode()
            ]);
        }
    }

    /**
     * Send a formatted SMS message to a user
     * 
     * @param $templateName The blade template name located under resources/views/sms 
     * @param $data Associative array of variables to hand into the blade template
     * @param $user The user to text
     */
    public function SendSMS($templateName, $data, $user) {
        Twilio::message($user->mobile_number, view('sms.' . $templateName, $data));
    }

    /**
     * Notify admins of new tutor registrations
     * 
     * Only triggers once a newly registrered tutor has left 'draft' status
     */
    public function NotifyAdminsOfTutorRegistration(User $user) {
        $admins = User::where('role', 'admin')->get();
        $templatedata = [];
        foreach($admins as $admin) {
            if (!$admin->enabled || $admin->closed) { continue; }

            $pref = $admin->notificationPreferences()->where('type', ENotificationTypes::NewTutorRegistration)->first();
        
            $data = [
                '__name' => $admin->name,
                'tutor_name' => $user->name . " " . $user->surname,
                'tutor_email' => $user->email,
                'link' => env('FRONTEND_URL') . '/admin/pending-tutor-registrations/' . $user->message_uuid
            ];

            if (!$pref || $pref->email) {
                $templatedata[$admin->email] = $data;
            }

            if ($pref && $pref->mobile) {
                $this->SendSMS("tutorregistration", $data, $admin);
                break;
            }
        }
        $this->SendTemplatedEmail(env('SENDGRID_NEWTUTOR_TEMPLATE_ID'), "New Tutor Registration", $templatedata);
    }

    /**
     * Notify admins of new tutor registrations
     * 
     * Only triggers once a newly registrered tutor has left 'draft' status
     */
    public function NotifyAdminsOfTutorVerification(User $user) {
        $admins = User::where('role', 'admin')->get();
        $templatedata = [];
        foreach($admins as $admin) {
            if (!$admin->enabled || $admin->closed) { continue; }

            $pref = $admin->notificationPreferences()->where('type', ENotificationTypes::NewTutorRegistration)->first();
        
            $data = [
                '__name' => $admin->name,
                'tutor_name' => $user->name . " " . $user->surname,
                'tutor_email' => $user->email,
                'link' => env('FRONTEND_URL') . '/admin/pending-tutor-verifications/' . $user->message_uuid
            ];

            if (!$pref || $pref->email) {
                $templatedata[$admin->email] = $data;
            }

            if ($pref && $pref->mobile) {
                $this->SendSMS("tutorverification", $data, $admin);
                break;
            }
        }
        $this->SendTemplatedEmail(env('SENDGRID_NEWTUTORVERIFICATION_TEMPLATE_ID'), "New Tutor Verification", $templatedata);
    }

    /**
     * Notify admins of new unrecognized subjects
     */
    public function NotifyAdminsOfNewSubjects(User $user) {
        $admins = User::where('role', 'admin')->get();
        $templatedata = [];

        $subjects = array_reduce(json_decode($user->new_subjects, true), function($subs, $sub) {
            $subs[] = $sub['subject_name'];
            return $subs;
        }, []);

        foreach($admins as $admin) {
            if (!$admin->enabled || $admin->closed) { continue; }

            $data = [
                '__name' => $admin->name,
                'tutor_name' => $user->name . " " . $user->surname,
                'tutor_email' => $user->email,
                'new_subjects' => implode(', ', $subjects)
            ];

            $pref = $admin->notificationPreferences()->where('type', ENotificationTypes::NewTutorRegistration)->first();

            if (!$pref || $pref->email) {
                $templatedata[$admin->email] = $data;
            }

            if ($pref && $pref->mobile) {
                $this->SendSMS("newsubjects", $data, $admin);
            }
        }
        $this->SendTemplatedEmail(env('SENDGRID_NEWSUBJECTS_TEMPLATE_ID'), "New Subjects", $templatedata);
    }

    /**
     * Notify tutors they've received a new review
     */
    public function NotifyTutorOrReview(User $user, User $reviewer, Review $review, $subject, $level) {

        if (!$user->enabled || $user->closed) { return; }

        $templatedata = [];
        $data = [
            '__name' => $user->name,
            'reviewer' => $reviewer->name . ' ' . $reviewer->surname,
            'subject' => $subject,
            'level' => $level,
            'approve_url' => env('FRONTEND_URL') . '/tutor/review/' . $review->id . '/approve',
            'reject_url' => env('FRONTEND_URL') . '/tutor/review/' . $review->id . '/reject'
        ];
        $templatedata[$user->email] = $data;

        $pref = $user->notificationPreferences()->where('type', ENotificationTypes::ReviewSubmitted)->first();
        if ($pref && $pref->mobile) {
            $this->SendSMS("reviewsubmitted", $data, $user);
        }

        if (!$pref || $pref->email) {
            $this->SendTemplatedEmail(
                env('SENDGRID_REVIEWSUBMITTED_TEMPLATE_ID'), 
                "A student has submitted a review of you", 
                $templatedata
            );
        }
    }

    /**
     * Notify student that a tutor has disputed their review
     */
    public function NotifyUserOfReviewRejection(User $user, User $tutor, Review $review, $subject, $level) {

        if (!$user->enabled || $user->closed) { return; }

        $templatedata = [];
        $data = [
            '__name' => $user->name,
            'tutor' => $tutor->name . ' ' . $tutor->surname,
            'rejection_message' => $review->reviewee_rejection_message,
            'subject' => $subject,
            'level' => $level,
            'escalate_url' => env('FRONTEND_URL') . '/tutor/review/' . $review->id . '/escalate'
        ];
        $templatedata[$user->email] = $data;

        $pref = $user->notificationPreferences()->where('type', ENotificationTypes::ReviewRejected)->first();
        if ($pref && $pref->mobile) {
            $this->SendSMS("reviewrejected", $data, $user);
        }

        if (!$pref || $pref->email) {
            $this->SendTemplatedEmail(
                env('SENDGRID_REVIEWREJECTED_TEMPLATE_ID'), 
                "A tutor has rejected your review", 
                $templatedata
            );
        }
    }

    /**
     * Notify tutor that an admin has approved their new subject
     */
    public function NotifyTutorOfSubjectApproval(User $user, $subject) {

        if (!$user->enabled || $user->closed) { return; }

        $templatedata = [];
        $data = [
            '__name' => $user->name,
            'subject' => $subject
        ];
        $templatedata[$user->email] = $data;

        $pref = $user->notificationPreferences()->where('type', ENotificationTypes::SubjectApproved)->first();
        if ($pref && $pref->mobile) {
            $this->SendSMS("subjectapproved", $data, $user);
        }

        if (!$pref || $pref->email) {
            $this->SendTemplatedEmail(
                env('SENDGRID_SUBJECTAPPROVED_TEMPLATE_ID'), 
                "Your subject has been approved", 
                $templatedata
            );
        }
        
    }

    /**
     * Notify tutor that their new subject has been approved, but renamed
     * 
     * Uses the same SMS template as Subject Approval & notification preference is controlled by the same type value
     */
    public function NotifyTutorOfSubjectRename(User $user, $subject, $newName) {

        if (!$user->enabled || $user->closed) { return; }

        $templatedata = [];
        $data = [
            '__name' => $user->name,
            'subject' => $subject,
            'new_name' => $newName
        ];
        $templatedata[$user->email] = $data;

        $pref = $user->notificationPreferences()->where('type', ENotificationTypes::SubjectApproved)->first();
        if ($pref && $pref->mobile) {
            $this->SendSMS("subjectapproved", $data, $user);
        }

        if (!$pref || $pref->email) {
            $this->SendTemplatedEmail(
                env('SENDGRID_SUBJECTRENAMED_TEMPLATE_ID'), 
                "Your subject has been renamed", 
                $templatedata
            );
        }
    }

    /**
     * Notify tutor that their new subject has been approved, but remapped to an existing subject
     * 
     * Uses the same SMS template as Subject Approval & notification preference is controlled by the same type value
     */
    public function NotifyTutorOfSubjectRemap(User $user, $subject, $newName) {

        if (!$user->enabled || $user->closed) { return; }

        $templatedata = [];
        $data = [
            '__name' => $user->name,
            'subject' => $subject,
            'existing_subject' => $newName
        ];
        $templatedata[$user->email] = $data;

        $pref = $user->notificationPreferences()->where('type', ENotificationTypes::SubjectApproved)->first();
        if ($pref && $pref->mobile) {
            $this->SendSMS("subjectapproved", $data, $user);
        }

        if (!$pref || $pref->email) {
            $this->SendTemplatedEmail(
                env('SENDGRID_SUBJECTREMAPPED_TEMPLATE_ID'), 
                "Your subject has been changed to an existing subject", 
                $templatedata
            );
        }
    }

    /**
     * Notify tutor that their new subject has been rejected
     */
    public function NotifyTutorOfSubjectRejection(User $user, $subject) {

        if (!$user->enabled || $user->closed) { return; }

        $templatedata = [];
        $data = [
            '__name' => $user->name,
            'subject' => $subject
        ];
        $templatedata[$user->email] = $data;

        $pref = $user->notificationPreferences()->where('type', ENotificationTypes::SubjectRejected)->first();
        if ($pref && $pref->mobile) {
            $this->SendSMS("subjectrejected", $data, $user);
        }

        if (!$pref || $pref->email) {
            $this->SendTemplatedEmail(
                env('SENDGRID_SUBJECTREJECTED_TEMPLATE_ID'), 
                "Your subject has been rejected", 
                $templatedata
            );
        }
    }

    /**
     * Notify tutor that one of their references has been approved
     */
    public function NotifyTutorOfReferenceApproval(User $user, $reference) {

        if (!$user->enabled || $user->closed) { return; }

        $templatedata = [];
        $data = [
            '__name' => $user->name,
            'reference_name' => $reference->name,
            'reference_email' => $reference->email,
            'reference_relationship' => $reference->relationship
        ];
        $templatedata[$user->email] = $data;
        
        $pref = $user->notificationPreferences()->where('type', ENotificationTypes::ReferenceApproved)->first();
        if ($pref && $pref->mobile) {
            $this->SendSMS("referenceapproved", $data, $user);
        }

        if (!$pref || $pref->email) {
            $this->SendTemplatedEmail(
                env('SENDGRID_REFERENCEAPPROVED_TEMPLATE_ID'), 
                "A Reference has been Approved", 
                $templatedata
            );
        }
    }

    /**
     * Notify tutor one of their references has been rejected
     */
    public function NotifyTutorOfReferenceRejection(User $user, $reference) {

        if (!$user->enabled || $user->closed) { return; }

        $templatedata = [];
        $data = [
            '__name' => $user->name,
            'reference_name' => $reference->name,
            'reference_email' => $reference->email,
            'reference_relationship' => $reference->relationship
        ];
        $templatedata[$user->email] = $data;

        $pref = $user->notificationPreferences()->where('type', ENotificationTypes::ReferenceRejected)->first();
        if ($pref && $pref->mobile) {
            $this->SendSMS("referencerejected", $data, $user);
        }

        if (!$pref || $pref->email) {
            $this->SendTemplatedEmail(
                env('SENDGRID_REFERENCEREJECTED_TEMPLATE_ID'), 
                "A Reference has been Rejected", 
                $templatedata
            );
        }
    }

    /**
     * Notify tutor one of their references could not be contacted
     */
    public function NotifyTutorOfReferenceNoContact(User $user, $reference) {

        if (!$user->enabled || $user->closed) { return; }

        $templatedata = [];
        $data = [
            '__name' => $user->name,
            'reference_name' => $reference->name,
            'reference_email' => $reference->email,
            'reference_relationship' => $reference->relationship
        ];
        $templatedata[$user->email] = $data;

        $pref = $user->notificationPreferences()->where('type', ENotificationTypes::ReferenceNoContact)->first();
        if ($pref && $pref->mobile) {
            $this->SendSMS("referencenocontact", $data, $user);
        }

        if (!$pref || $pref->email) {
            $this->SendTemplatedEmail(
                env('SENDGRID_REFERENCENOCONTACT_TEMPLATE_ID'), 
                "A Reference Could not be Contacted", 
                $templatedata
            );
        }
    }

    /**
     * Send tutor an email from an admin asking a question about their pending registration
     */
    public function ContactTutorAboutRegistration(User $user, $message, $replyTo) {
        
        $templatedata = [];
        $templatedata[$user->email] = [
            '__name' => $user->name,
            'message' => $message
        ];

        $this->SendTemplatedEmail(
            env('SENDGRID_REGISTRATIONINQUIRY_TEMPLATE_ID'), 
            "A Question About Your Registration", 
            $templatedata,
            $replyTo
        );
    }

    /**
     * Send tutor an email asking for more info about a specific portion of their pending registration
     */
    public function ContactTutorForMoreRegistrationInformation($section, User $user, $message, $replyTo) {
        
        $templatedata = [];
        $templatedata[$user->email] = [
            '__name' => $user->name,
            'message' => $message
        ];

        $templateId = "";
        switch($section) {
            case "account":
                $templateId = env('SENDGRID_MOREREGISTRATIONINFO_ACCOUNT_TEMPLATE_ID');
                break;
            case "address":
                $templateId = env('SENDGRID_MOREREGISTRATIONINFO_ADDRESS_TEMPLATE_ID');
                break;
            case "subjects":
                $templateId = env('SENDGRID_MOREREGISTRATIONINFO_SUBJECTS_TEMPLATE_ID');
                break;
            case "qualifications":
                $templateId = env('SENDGRID_MOREREGISTRATIONINFO_QUALIFICATIONS_TEMPLATE_ID');
                break;
            case "profile":
                $templateId = env('SENDGRID_MOREREGISTRATIONINFO_PROFILE_TEMPLATE_ID');
                break;
            case "photos":
                $templateId = env('SENDGRID_MOREREGISTRATIONINFO_PHOTOS_TEMPLATE_ID');
                break;
            case "documents":
                $templateId = env('SENDGRID_MOREREGISTRATIONINFO_DOCUMENTS_TEMPLATE_ID');
                break;
            case "availability":
                $templateId = env('SENDGRID_MOREREGISTRATIONINFO_AVAILABILITY_TEMPLATE_ID');
                break;
            case "references":
                $templateId = env('SENDGRID_MOREREGISTRATIONINFO_REFERENCES_TEMPLATE_ID');
                break;
            default:
                $templateId = env('SENDGRID_REGISTRATIONINQUIRY_TEMPLATE_ID');
                break;
        }

        $this->SendTemplatedEmail(
            $templateId, 
            "More information required to process your registration", 
            $templatedata,
            $replyTo
        );
    }

    /**
     * Used by admins to email multiple users at once
     */
    public function MassEmailUsers($users, $message, $replyTo = null, $subject = null) {

        foreach($users as $user) {
            $templatedata = [];
            $templatedata[$user->email] = [
                '__name' => $user->name,
                'message' => $message
            ];
            if ($subject) {
                $templatedata[$user->email]['subject'] = $subject;
            }

            $this->SendTemplatedEmail(
                env('SENDGRID_MASSEMAIL_TEMPLATE_ID'),
                $subject ? $subject : "Message from Qualified Tutors",
                $templatedata,
                $replyTo
            );
        }
    }

    /**
     * Send an email to the sites contact us email on contact us form submission
     */
    public function ContactUs($name, $replyTo, $message) {
        
        $templatedata = [];
        $templatedata[env('CONTACT_US_EMAIL')] = [
            '__name' => $name,
            'message' => $message
        ];

        $this->SendTemplatedEmail(
            env('SENDGRID_REGISTRATIONINQUIRY_TEMPLATE_ID'), 
            "Contact us submission", 
            $templatedata,
            $replyTo
        );
    }

    /**
     * Notify tutor that their account has been approved
     */
    public function NotifyTutorOfAccountApproval(User $user) {

        if (!$user->enabled || $user->closed) { return; }

        $templatedata = [];
        $data = [
            '__name' => $user->name
        ];
        $templatedata[$user->email] = $data;

        $pref = $user->notificationPreferences()->where('type', ENotificationTypes::TutorApproved)->first();
        if ($pref && $pref->mobile) {
            $this->SendSMS("tutorapproved", $data, $user);
        }

        if (!$pref || $pref->email) {
            $this->SendTemplatedEmail(
                env('SENDGRID_TUTORAPPROVED_TEMPLATE_ID'), 
                "Your Registration has been Approved", 
                $templatedata
            );
        }
    }

    /**
     * Notify tutor that their account has been rejected
     */
    public function NotifyTutorOfAccountRejection(User $user) {

        if (!$user->enabled || $user->closed) { return; }

        $templatedata = [];
        $data = [
            '__name' => $user->name
        ];
        $templatedata[$user->email] = $data;

        $pref = $user->notificationPreferences()->where('type', ENotificationTypes::TutorRejected)->first();
        if ($pref && $pref->mobile) {
            $this->SendSMS("tutorrejected", $data, $user);
        }

        if (!$pref || $pref->email) {
            $this->SendTemplatedEmail(
                env('SENDGRID_TUTORREJECTED_TEMPLATE_ID'),
                "Your Registration has been Rejected",
                $templatedata
            );
        }
    }

    /**
     * Send email validation email to user
     */
    public function NotifyUserOfEmailValidation(User $user) {

        $templatedata = [];
        $templatedata[$user->email] = [
            '__name' => $user->name,
            'link' => env('FRONTEND_URL') . '/verify-email/' . $user->email_validation_token
        ];

        $this->SendTemplatedEmail(
            env('SENDGRID_EMAILVALIDATION_TEMPLATE_ID'),
            "Verify your email address",
            $templatedata
        );
    }

    /**
     * Send password reset email to user
     */
    public function NotifyUserOfPasswordReset(User $user) {

        Log::debug("Sending forgot password email", [
            'user' => $user->email,
            'token' => $user->password_reset_token
        ]);

        $templatedata = [];
        $templatedata[$user->email] = [
            '__name' => $user->name,
            'link' => env('FRONTEND_URL') . '/reset-password/' . $user->password_reset_token
        ];

        $this->SendTemplatedEmail(
            env('SENDGRID_FORGOTPASSWORD_TEMPLATE_ID'),
            "Password Reset",
            $templatedata
        );
    }

    /**
     * Notify user that they've received a new message
     */
    public function NotifyUserOfReceivedMessage(User $to, User $from, Message $message) {
        
        $pref = $to->notificationPreferences()->where('type', ENotificationTypes::MessageReceived)->first();
        
        $templatedata = [];
        $data = [
            '__name' => $to->name,
            'from' => $from->name . " " . $from->surname,
            'message' => $message->message
        ];
        $templatedata[$to->email] = $data;

        if (!$pref || $pref->email) {
            $this->SendTemplatedEmail(
                env('SENDGRID_MESSAGERECEIVED_TEMPLATE_ID'),
                "New Message Received",
                $templatedata
            );
        }
        
        if ($pref && $pref->mobile) {
            $this->SendSMS("messagereceived", $data, $to);
        }
    }

    /**
     * Notify user that the Geolocation API failed to find their address
     */
    public function NotifyUserOfFailedAddressLookup(User $user) {
        $templatedata = [];
        $data = [
            '__name' => $user->name,
            'address_line_1' => $user->address_line_1,
            'address_line_2' => $user->address_line_2,
            'county' => $user->county,
            'city' => $user->city,
            'postcode' => $user->postcode
        ];
        $templatedata[$user->email] = $data;

        if ($pref && $pref->mobile) {
            $this->SendSMS("addresslookupfailed", $data, $to);
        }

        if (!$pref || $pref->email) {
            $this->SendTemplatedEmail(
                env('SENDGRID_FAILEDADDRESSLOOKUP_TEMPLATE_ID'),
                "Address Lookup Failure",
                $templatedata
            );
        }
    }

    /**
     * Contact a tutors reference 
     */
    public function ContactTutorReference(User $user, $reference) {
        $templatedata = [];
        $templatedata[$reference['email']] = [
            '__name' => $reference['name'],
            'user_name' => $user->name . ' ' . $user->surname,
            'reference_name' => $reference['name'],
            'link' => env('FRONTEND_URL') . '/reference/' . $reference['uuid']
        ];

        $this->SendTemplatedEmail(
            env('SENDGRID_CONTACT_REFERENCE_TEMPLATE_ID'),
            "Reference request for " . $user->name . " " . $user->surname,
            $templatedata
        );
    }

    /**
     * Notify admins of new reference submission
     */
    public function NotifyAdminsOfReferenceSubmission(User $tutor, $reference) {
        $admins = User::where('role', 'admin')->get();
        $templatedata = [];
        foreach($admins as $admin) {
            if (!$admin->enabled || $admin->closed) { continue; }

            $pref = $admin->notificationPreferences()->where('type', ENotificationTypes::ReferenceSubmitted)->first();
        
            $data = [
                '__name' => $admin->name,
                'tutor' => $tutor->name . " " . $tutor->surname,
                'tutor_email' => $tutor->email,
                'title' => $reference->title,
                'name' => $reference->name,
                'surname' => $reference->surname,
                'email' => $reference->email,
                'school' => $reference->school,
                'addressLine1' => $reference->addressLine1,
                'addressLine2' => $reference->addressLine2,
                'town' => $reference->town,
                'postcode' => $reference->postcode,
                'phone' => $reference->phone,
                'howLong' => $reference->howLong,
                'howDoYouKnow' => $reference->howDoYouKnow,
                'confident' => $reference->confident,
                'rating' => $reference->rating,
                'professionalism' => $reference->professionalism,
                'managementSkills' => $reference->managementSkills,
                'reliability' => $reference->reliability,
                'trustworthyness' => $reference->trustworthyness,
                'comments' => $reference->comments
            ];

            

            if (!$pref || $pref->email) {
                $templatedata[$admin->email] = $data;
            }

            if ($pref && $pref->mobile) {
                $this->SendSMS("referencesubmission", $data, $admin);
                break;
            }
        }

        $this->SendTemplatedEmail(env('SENDGRID_REFERENCE_SUBMITTED_TEMPLATE_ID'), "New Reference Submitted", $templatedata);
    }
}
