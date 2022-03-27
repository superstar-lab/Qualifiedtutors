<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\TutorController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ReferenceController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\LocationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', [LoginController::class, 'Login']);
Route::post('/user/forgot_password', [LoginController::class, 'ForgotPassword']);
Route::post('/user/reset_password', [LoginController::class, 'ResetPassword']);

Route::post('/register/client', [RegistrationController::class, 'RegisterClient']);
Route::post('/register/tutor', [RegistrationController::class, 'RegisterTutor']);

Route::post('/upload/public', [FileController::class, 'UploadPublicFile']);
Route::post('/upload/private', [FileController::class, 'UploadPrivateFile']);

Route::get('/subjects', [SubjectController::class, 'GetSubjects']);
Route::get('/subjects/levels', [SubjectController::class, 'GetSubjectLevels']);
Route::get('/subjects/paginate', [SubjectController::class, 'Paginate']);

Route::post('/tutor/search', [TutorController::class, 'Search']);
Route::get('/tutor/top', [TutorController::class, 'TopTutors']);
Route::get('/tutor/{uuid}', [TutorController::class, 'GetTutor']);

Route::post('/contactus', [ContactController::class, 'ContactUs']);

Route::get('/reference/{uuid}', [ReferenceController::class, 'GetReference']);
Route::post('/reference/submit/{uuid}', [ReferenceController::class, 'SubmitReference']);

Route::get('/faqs/{category}', [FaqController::class, 'Faqs']);
Route::get('/faqs', [FaqController::class, 'TopFaqs']);

Route::get('/help/{category}', [FaqController::class, 'Help']);
Route::get('/help', [FaqController::class, 'TopHelp']);

Route::post('/locations', [LocationController::class, 'Search']);

Route::middleware(['auth:sanctum', 'extend.session'])->group(function() {
    Route::get('/me', [UserController::class, 'Me']);
    Route::post('/register/admin', [RegistrationController::class, 'RegisterAdmin']);
    Route::get('/user/verify_email/{token}', [RegistrationController::class, 'VerifyEmail']);
    Route::get('/logout', [LoginController::class, 'Logout']);

    Route::get('/user/messages/sent', [MessageController::class, 'GetSentMessages']);
    Route::get('/user/messages/received', [MessageController::class, 'GetReceivedMessages']);
    Route::get('/user/messages/archived', [MessageController::class, 'GetArchivedMessages']);
    Route::get('/user/messages/favourite', [MessageController::class, 'GetFavouriteMessages']);
    Route::get('/user/messages/unread_count', [MessageController::class, 'GetUnreadMessageCount']);
    Route::get('/user/messages/stats', [MessageController::class, 'GetConversationStats']);
    Route::get('/user/messages/conversation/{id}', [MessageController::class, 'GetConversation']);
    Route::get('/user/messages/{messageId}', [MessageController::class, 'GetMessage']);
    Route::post('/user/messages/send/{userMessageUuid}', [MessageController::class, 'SendMessage']);
    Route::post('/user/messages/add/{convoId}', [MessageController::class, 'AddMessageToConversation']);
    Route::post('/user/messages/favourite/{convoId}', [MessageController::class, 'FavouriteConversation']);
    Route::post('/user/messages/archive/{convoId}', [MessageController::class, 'ArchiveConversation']);
    Route::post('/user/messages/edit/{messageId}', [MessageController::class, 'EditMessage']);
    Route::post('/user/messages/delete/{messageId}', [MessageController::class, 'DeleteMessage']);
    Route::post('/user/messages/download_attachment', [MessageController::class, 'DownloadAttachment']);

    Route::post('/user/profile/personal_details', [UserController::class, 'UpdatePersonalDetails']);
    Route::post('/user/profile/notification_preferences', [UserController::class, 'UpdateNotificationPreferences']);
    Route::post('/user/profile/enable', [UserController::class, 'SetEnabled']);

    Route::get('/user/reviews/count', [TutorController::class, 'CountReviewsFrom']);

    Route::post('/user/close_account', [UserController::class, 'CloseAccount']);

    Route::post('/user/toggle_favourite_tutor', [UserController::class, 'ToggleFavouriteTutor']);
    Route::get('/user/favourite_tutors', [UserController::class, 'GetFavouriteTutors']);

    Route::post('/tutor/profile/subjects', [TutorController::class, 'SetSubjects']);
    Route::post('/tutor/profile/availability', [TutorController::class, 'SetAvailability']);
    Route::post('/tutor/profile/qualifications', [TutorController::class, 'SetQualifications']);
    Route::post('/tutor/profile/profile', [TutorController::class, 'SetProfile']);
    Route::post('/tutor/profile/documents', [TutorController::class, 'SetVerificationDocuments']);
    Route::post('/tutor/profile/photos', [TutorController::class, 'SetPhotos']);
    Route::post('/tutor/profile/references', [TutorController::class, 'SetReferences']);

    Route::post('/tutor/review/{uuid}', [TutorController::class, 'SubmitReview']);
    Route::post('/tutor/review/{id}/respond', [TutorController::class, 'RespondToReview']);
    Route::post('/tutor/review/approve/{id}', [TutorController::class, 'ApproveReview']);
    Route::post('/tutor/review/reject/{id}', [TutorController::class, 'RejectReview']);
    Route::post('/tutor/review/escalate/{id}', [TutorController::class, 'EscalateReview']);
    Route::post('/tutor/go_live', [TutorController::class, 'ApplyToGoLive']);
    Route::post('/tutor/get_verified', [TutorController::class, 'ApplyForVerificationStatus']);

    Route::post('/admin/users/return', [AdminController::class, 'ReturnToAdmin']); // needs to be outside admin middleware
    Route::middleware('admin')->group(function() {
        Route::get('/admin/pending_tutors', [AdminController::class, 'GetPendingTutors']);
        Route::get('/admin/pending_verification_tutors', [AdminController::class, 'GetPendingVerificationTutors']);
        Route::get('/admin/pending_students', [AdminController::class, 'GetPendingStudents']);
        Route::post('/admin/messages/force_delete/{messageId}', [MessageController::class, 'ForceDeleteMessage']);

        Route::post('/admin/tutor/verification/approve/{uuid}', [AdminController::class, 'ApproveTutorVerification']);
        Route::post('/admin/tutor/verification/reject/{uuid}', [AdminController::class, 'RejectTutorVerification']);

        Route::get('/admin/overview', [AdminController::class, 'GetOverview']);
        Route::get('/admin/users', [AdminController::class, 'GetUsers']);
        Route::get('/admin/users/totals', [AdminController::class, 'GetUserTotals']);
        Route::get('/admin/students/review_escalations', [AdminController::class, 'GetEscalatedReviews']);
        Route::get('/admin/subjects/pending', [AdminController::class, 'GetPendingSubjects']);
        Route::get('/admin/subjects/categories', [AdminController::class, 'GetSubjectCategories']);

        Route::get('/admin/select_all_users', [AdminController::class, 'SelectAllUsers']);
        Route::get('/admin/select_all_subjects', [AdminController::class, 'SelectAllSubjects']);

        Route::post('/admin/subjects/approve', [AdminController::class, 'ApproveSubject']);
        Route::post('/admin/subjects/reject', [AdminController::class, 'RejectSubject']);
        Route::post('/admin/reviews/approve', [AdminController::class, 'ApproveReview']);
        Route::post('/admin/reviews/reject', [AdminController::class, 'RejectReview']);
        Route::post('/admin/users/impersonate', [AdminController::class, 'ImpersonateUser']);

        Route::post('/admin/users/massemail', [AdminController::class, 'MassContactUsers']);
        Route::post('/admin/users/massdelete', [AdminController::class, 'MassDeleteUsers']);

        Route::get('/admin/tutor/{uuid}', [AdminController::class, 'GetTutor']);
        Route::get('/admin/student/{uuid}', [AdminController::class, 'GetStudent']);
        Route::post('/admin/tutor/reference/approve', [AdminController::class, 'ApproveReference']);
        Route::post('/admin/tutor/reference/reject', [AdminController::class, 'RejectReference']);
        Route::post('/admin/tutor/reference/no_contact', [AdminController::class, 'NoContactReference']);
        Route::post('/admin/tutor/contact', [AdminController::class, 'ContactTutorAboutRegistration']);
        Route::post('/admin/tutor/approve', [AdminController::class, 'ApproveTutor']);
        Route::post('/admin/tutor/reject', [AdminController::class, 'RejectTutor']);
        Route::post('/admin/student/approve', [AdminController::class, 'ApproveStudent']);
        Route::post('/admin/student/reject', [AdminController::class, 'RejectStudent']);
        Route::post('/admin/tutor/request_revision', [AdminController::class, 'RequestRevision']);

        Route::post('/admin/download/private', [AdminController::class, 'DownloadPrivateFile']);

        Route::post('/admin/subjects/new', [SubjectController::class, 'NewSubject']);
        Route::post('/admin/subjects/edit', [SubjectController::class, 'EditSubject']);
        Route::post('/admin/subjects/delete', [SubjectController::class, 'DeleteSubjects']);

        Route::get('/admin/faqs/ids', [FaqController::class, 'AllIds']);
        Route::get('/admin/faqs', [FaqController::class, 'AllFaqs']);
        Route::post('/admin/faqs/new', [FaqController::class, 'NewFaq']);
        Route::post('/admin/faqs/delete', [FaqController::class, 'DeleteFaqs']);
        Route::post('/admin/faqs/edit', [FaqController::class, 'EditFaq']);
        Route::get('/admin/faqs/categories', [FaqController::class, 'Categories']);
    });
});