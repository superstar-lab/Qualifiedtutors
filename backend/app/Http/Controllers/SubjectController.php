<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;
use App\Enums\ESubjectLevels;

class SubjectController extends Controller
{
    /**
     * Return a list of all subjects
     */
    public function GetSubjects(Request $request) {
        return response()->json(Subject::all());
    }

    /**
     * Return a list of all levels
     */
    public function GetSubjectLevels(Request $request) {
        return response()->json(ESubjectLevels::cases());
    }

    /**
     * Returns a paginated list of subjects
     * 
     * @param name          String          If present filters results based on subject name containing name
     * @param subjects      Array[String]   If present filters to a specific list of subjects
     * @param levels        Array[String]   If present filters to a specific list of levels
     * @param categories    Array[String]   If present filters to a specific list of categories
     */
    public function Paginate(Request $request) {
        
        $validated = $request->validate([
            'name' => ['string'],
            'subjects.*' => ['string'],
            'levels.*' => ['string'],
            'categories.*' => ['string']
        ]);
        
        $query = Subject::select();
        
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

        return $query->paginate();
    }

    /**
     * Create a new subject
     * 
     * @param subject   String          Name of the new subject
     * @param levels    Array[String]   The levels the new subject is offered in
     * @param category  String          The category fo the new subject
     */
    public function NewSubject(Request $request) {

        $validated = $request->validate([
            'subject' => ['string', 'required'],
            'levels' => ['required'],
            'levels.*' => ['string'],
            'category' => ['string', 'required']
        ]);

        $subject = new Subject;
        $subject->subject = $validated['subject'];
        $subject->levels = json_encode($validated['levels']);
        $subject->category = $validated['category'];
        $subject->save();
        $subject->refresh();

        return response()->json([
            'success' => true,
            'subject' => $subject
        ]);
    }

    /**
     * Edit an existing subject
     * 
     * @param id        Integer
     * @param subject   Array[String]
     * @param levels    Array[String]
     * @param category  String
     */
    public function EditSubject(Request $request) {

        $validated = $request->validate([
            'id' => ['integer', 'required'],
            'subject' => ['string', 'required'],
            'levels' => ['required'],
            'levels.*' => ['string'],
            'category' => ['string', 'required']
        ]);

        $subject = Subject::where('id', $validated['id'])->firstOrFail();

        $subject->subject = $validated['subject'];
        $subject->levels = json_encode($validated['levels']);
        $subject->category = $validated['category'];
        $subject->save();

        return response()->json([
            'success' => true,
            'subject' => $subject
        ]);
    }

    /**
     * Delete existing subjects
     * 
     * @param ids   Array[Integer]
     */
    public function DeleteSubjects(Request $request) {

        $validated = $request->validate([
            'ids' => ['required'],
            'ids.*' => ['integer']
        ]);

        Subject::whereIn('id', $validated['ids'])->delete();

        return response()->json([
            'success' => true
        ]);
    }
}
