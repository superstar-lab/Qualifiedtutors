<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\NotificationService;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Rules\MobileNumber;
use App\Rules\Postcode;

class ReferenceController extends Controller
{
    /**
     * Get a specific reference from a users references
     * 
     * @param uuid  String
     */
    public function GetReference(Request $request) {

        $user = User::select(['references', 'name', 'surname'])
            ->whereRaw("JSON_SEARCH(`references`, 'one', '" . $request->route('uuid') . "', null, '$[*].uuid') is not null")
            ->firstOrFail();
        $references = json_decode($user->references);

        $ref = null;
        foreach($references as $reference) {
            if ($reference->uuid == $request->route('uuid')) {
                $ref = $reference;
                $ref->tutor_name = $user->name;
                $ref->tutor_surname = $user->surname;
            } 
        }

        return response()->json([
            'success' => true,
            'reference' => $ref
        ]);
    }

    /**
     * Submit a new reference of a tutor
     * 
     * Used by referees to submit their reference for a tutor
     * 
     * @param title             String
     * @param name              String
     * @param surname           String
     * @param email             String
     * @param school            String
     * @param addressLine1      String
     * @param addressLine2      String
     * @param town              String
     * @param postcode          String
     * @param phone             String
     * @param howLong           String
     * @param howDoYouKnow      String
     * @param confident         String
     * @param rating            Integer
     * @param professionalism   String
     * @param managementSkills  String
     * @param reliability       String
     * @param trustworthyness   String
     * @param comments          String
     */
    public function SubmitReference(Request $request, NotificationService $notificationService) {

        $validated = $request->validate([
            'title' => ['string', 'nullable'],
            'name' => ['required', 'string'],
            'surname' => ['required', 'string'],
            'email' => ['required', 'email'],
            'school' => ['required', 'string'],
            'addressLine1' => ['required', 'string'],
            'addressLine2' => ['string', 'nullable'],
            'town' => ['required', 'string'],
            'postcode' => ['required', new Postcode],
            'phone' => ['required', new MobileNumber],

            'howLong' => ['required', 'string'],
            'howDoYouKnow' => ['required', 'string'],
            'confident' => ['required', 'string'],
            'rating' => ['required', 'integer'],
            'professionalism' => ['required', 'string'],
            'managementSkills' => ['required', 'string'],
            'reliability' => ['required', 'string'],
            'trustworthyness' => ['required', 'string'],
            'comments' => ['required', 'string'],
        ]);

        $user = User::whereRaw("JSON_SEARCH(`references`, 'one', '" . $request->route('uuid') . "', null, '$[*].uuid') is not null")
            ->firstOrFail();
        $references = json_decode($user->references);

        foreach($references as $index => $reference) {
            if ($reference->uuid == $request->route('uuid')) {
                $reference->response = $validated;
                $reference->status = "submitted";
                $references[$index] = $reference;
                break;
            }
        }

        $notificationService->NotifyAdminsOfReferenceSubmission($user, (object)$reference->response);

        $user->references = json_encode($references);
        $user->save();

        return response()->json([
            'success' => true
        ]);
    }
}
