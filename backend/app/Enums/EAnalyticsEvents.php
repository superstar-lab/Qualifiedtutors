<?php

namespace App\Enums;

/**
 * Enum containing all analytics event types
 */
// If you upgrade the infrastrucutre to run PHP 8.1 you can rewrite this to use the new enum keyword
abstract class EAnalyticsEvents {
    const TutorLogin = 'tutor_login';
    const StudentLogin = 'student_login';
    const AdminLogin = 'admin_login';

    const TutorRegistration = 'tutor_registration';
    const StudentRegistration = 'student_registration';

    const TutorSentMessage = 'tutor_sent_message';
    const TutorReadMessage = 'tutor_read_message';
    const StudentSentMessage = 'student_sent_message';
    const StudentReadMessage = 'student_read_message';

    const TutorProfileView = 'tutor_profile_view';

   
    // Naming this cases to fall inline with the upcoming enum keyword functionality
    public static function cases() {
        return [
            EAnalyticsEvents::TutorLogin,
            EAnalyticsEvents::StudentLogin,
            EAnalyticsEvents::AdminLogin,
            EAnalyticsEvents::TutorRegistration,
            EAnalyticsEvents::StudentRegistration,
            EAnalyticsEvents::TutorSentMessage,
            EAnalyticsEvents::TutorReadMessage,
            EAnalyticsEvents::StudentSentMessage,
            EAnalyticsEvents::StudentReadMessage,
            EAnalyticsEvents::TutorProfileView
        ];
    }
}
