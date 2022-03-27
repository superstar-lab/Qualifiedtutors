<?php

namespace App\Enums;

/**
 * Enum containing all notification types
 */
// If you upgrade the infrastrucutre to run PHP 8.1 you can rewrite this to use the new enum keyword
abstract class ENotificationTypes {
    const MessageReceived = 'message_received'; // Sent to users when they receive a message
    const NewTutorRegistration = 'new_tutor_registration'; // Sent to admins when a new tutor registers
    const EmailValidation = 'email_validation'; // Sent to users to validate their email address
    const TutorApproved = 'tutor_approved'; // Sent to tutors when their registration is approved
    const TutorRejected = 'tutor_rejected'; // Sent to tutors when their registration is rejected
    const SubjectApproved = 'subject_approved'; // Sent to tutors when a new subject they've entered is approved
    const SubjectRenamed = 'subject_renamed'; // Sent to tutors when a new subject they've entered is renamed
    const SubjectRemapped = 'subject_remapped'; // Sent to tutors when a new subject they've entered is remapped
    const SubjectRejected = 'subject_rejected'; // Sent to tutors when a new subject they've entered is rejected
    const FailedAddressLookup = 'failed_address_lookup'; // Sent to users when the Geolocation API can't parse their address
    const NewSubjects = 'new_subjects'; // Sent to admins when a tutor enters an unrecognized subject
    const ReferenceApproved = 'reference_approved'; // Sent to tutors when one of their references is approved
    const ReferenceRejected = 'reference_rejected'; // Sent to tutors when one of their references is rejected
    const ReferenceNoContact = 'reference_no_contact'; // Sent to tutors when one of their references can't be contacted
    const ReferenceSubmitted = 'reference_submitted'; // Sent to admins when a new reference is submitted
    const RegistrationInquiry = 'registration_inquiry'; // Sent to tutors when admins have a question about their pending registration
    const ReviewSubmitted = 'review_submitted'; // Sent to tutors when a student submits a review of them
    const ReviewRejected = 'review_rejected'; // Sent to students when a tutor rejects their review
    const ForgotPassword = 'forgot_password'; // Sent to users to reset their password
    const ContactUs = 'contact_us'; // Sent to the address defined by the CONTACT_US_EMAIL env var when users fill out the contact us form
    const MoreRegistrationInfoAccount = 'more_registration_info_account'; // Sent to tutors when admins mark their account info as needing more info
    const MoreRegistrationInfoAddress = 'more_registration_info_address'; // Sent to tutors when admins mark their address as needing more info
    const MoreRegistrationInfoSubjects = 'more_registration_info_subjects'; // Sent to tutors when admins mark their subjects as needing more info
    const MoreRegistrationInfoQualifications = 'more_registration_info_qualifications'; // Sent to tutors when admins mark their qualifications as needing more info
    const MoreRegistrationInfoProfile = 'more_registration_info_profile'; // Sent to tutors when admins mark their profile as needing more info
    const MoreRegistrationInfoPhotos = 'more_registration_info_photos'; // Sent to tutors when admins mark their photos as needing more info
    const MoreRegistrationInfoDocuments = 'more_registration_info_documents'; // Sent to tutors when admins mark their documents as needing more info
    const MoreRegistrationInfoAvailability = 'more_registration_info_availability'; // Sent to tutors when admins mark their availability as needing more info
    const MoreRegistrationInfoReferences = 'more_registration_info_references'; // Sent to tutors when admins mark their references as needing more info
    const MassEmail = 'mass_email'; // Sent when admins email multiple users from the user management interface

   
    // Naming this cases to fall inline with the upcoming enum keyword functionality
    public static function cases() {
        return [
            ENotificationTypes::MessageReceived,
            ENotificationTypes::NewTutorRegistration,
            ENotificationTypes::EmailValidation,
            ENotificationTypes::TutorApproved,
            ENotificationTypes::TutorRejected,
            ENotificationTypes::SubjectApproved,
            ENotificationTypes::SubjectRenamed,
            ENotificationTypes::SubjectRemapped,
            ENotificationTypes::SubjectRejected,
            ENotificationTypes::FailedAddressLookup,
            ENotificationTypes::NewSubjects,
            ENotificationTypes::ReferenceApproved,
            ENotificationTypes::ReferenceRejected,
            ENotificationTypes::ReferenceNoContact,
            ENotificationTypes::RegistrationInquiry,
            ENotificationTypes::ReviewSubmitted,
            ENotificationTypes::ReviewRejected,
            ENotificationTypes::ForgotPassword,
            ENotificationTypes::ContactUs,
            ENotificationTypes::MoreRegistrationInfoAccount,
            ENotificationTypes::MoreRegistrationInfoAddress,
            ENotificationTypes::MoreRegistrationInfoSubjects,
            ENotificationTypes::MoreRegistrationInfoQualifications,
            ENotificationTypes::MoreRegistrationInfoProfile,
            ENotificationTypes::MoreRegistrationInfoPhotos,
            ENotificationTypes::MoreRegistrationInfoDocuments,
            ENotificationTypes::MoreRegistrationInfoAvailability,
            ENotificationTypes::MoreRegistrationInfoReferences,
            ENotificationTypes::MassEmail
        ];
    }
}
