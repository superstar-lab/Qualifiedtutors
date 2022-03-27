<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Faq;

class FaqController extends Controller
{
    /**
     * Returns six FAQs per FAQ category
     */
    public function TopFaqs(Request $request) {
        $categories = Faq::select('category')->where('type', 'faq')->distinct()->get();
        $faqs = [];
        foreach($categories as $cat) {
            $faqs[$cat['category']] = [
                'articles' => Faq::where(['category' => $cat['category'], 'type' => 'faq'])->limit(6)->get(),
                'total' => Faq::where(['category' => $cat['category'], 'type' => 'faq'])->count()
            ];
        }

        return $faqs;
    }

    /**
     * Returns 6 help articles per help article category
     */
    public function TopHelp(Request $request) {
        $categories = Faq::select('category')->where('type', 'help')->distinct()->get();
        $faqs = [];
        foreach($categories as $cat) {
            $faqs[$cat['category']] = [
                'articles' => Faq::where(['category' => $cat['category'], 'type' => 'help'])->limit(6)->get(),
                'total' => Faq::where(['category' => $cat['category'], 'type' => 'help'])->count()
            ];
        }

        return $faqs;
    }

    /**
     * Returns all Faqs for a given category
     * 
     * @param category  String  Route parameter specifying which Faq category to return Faqs for
     */
    public function Faqs(Request $request) {
        return Faq::where(['type' => 'faq'])
            ->whereRaw("UPPER(category) LIKE ?", [strtoupper(str_replace("-", " ", $request->route('category')))])
            ->get();
    }

    /**
     * Returns all help articles for a given category
     * 
     * @param category  String  Route parameter specifying which help category to return help articles for
     */
    public function Help(Request $request) {
        return Faq::where(['type' => 'help'])
            ->whereRaw("UPPER(category) LIKE ?", [strtoupper(str_replace("-", " ", $request->route('category')))])
            ->get();
    }

    /**
     * Returns a paginated list of Faqs optionally filtered
     * 
     * 
     */
    public function AllFaqs(Request $request) {

        $validated = $request->validate([
            'title' => ['string', 'nullable'],
            'type' => ['string', 'nullable'],
            'categories' => ['nullable'],
            'categories.*' => ['string']
        ]);

        $query = Faq::select('*');

        if (array_key_exists('title', $validated)) {
            $query->where('title', 'like', '%' . $validated['title'] . '%');
        }

        if (array_key_exists('type', $validated)) {
            $query->where('title', $validated['title']);
        }

        if (array_key_exists('categories', $validated)) {
            $query->whereIn('category', $validated['categories']);
        }

        return $query->paginate();
    }

    /**
     * Returns all Faq & Help categories
     */
    public function Categories(Request $request) {

        $faqs = Faq::select('category')->distinct()->get();
        $categories = [];
        foreach($faqs as $faq) {
            $categories[] = $faq->category;
        }

        return response()->json($categories);
    }

    /**
     * Create a new Faq
     * 
     * @param title     String  
     * @param type      Enum(faq, help)
     * @param category  String 
     * @param body      String
     */
    public function NewFaq(Request $request) {

        $validated = $request->validate([
            'title' => ['required', 'string'],
            'type' => ['required', 'in:faq,help'],
            'category' => ['required', 'string'],
            'body' => ['required', 'string']
        ]);

        $faq = new Faq;
        $faq->title = $validated['title'];
        $faq->type = $validated['type'];
        $faq->category = $validated['category'];
        $faq->body = $validated['body'];
        $faq->save();
        $faq->refresh();

        return response()->json([
            'success' => true,
            'faq' => $faq
        ]);
    }

    /**
     * Edit a FAQ or help article
     */
    public function EditFaq(Request $request) {

        $validated = $request->validate([
            'id' => ['required', 'integer'],
            'title' => ['required', 'string'],
            'type' => ['required', 'in:faq,help'],
            'category' => ['required', 'string'],
            'body' => ['required', 'string']
        ]);

        $faq = Faq::where('id', $validated['id'])->firstOrFail();
        $faq->title = $validated['title'];
        $faq->type = $validated['type'];
        $faq->category = $validated['category'];
        $faq->body = $validated['body'];
        $faq->save();

        return response()->json([
            'success' => true,
            'faq' => $faq
        ]);
    }

    /**
     * Delete a FAQ or Help article
     */
    public function DeleteFaqs(Request $request) {
        $validated = $request->validate([
            'ids' => ['required'],
            'ids.*' => ['integer']
        ]);

        Faq::whereIn('id', $validated['ids'])->delete();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Return ids for all FAQs/Help articles
     * 
     * Used to select all across many pages
     */
    public function AllIds(Request $request) {
        return response()->json(array_map(function($faq) {return $faq['id'];}, Faq::select('id')->get()->toArray()));
    }
}
