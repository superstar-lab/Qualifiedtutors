<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;
use App\Enums\ESubjectLevels;
use Illuminate\Support\Str;

use App\Services\GeocodingService;

class LocationController extends Controller
{
    public function Search(Request $request, GeocodingService $geocodingService) {

        $validated = $request->validate([
            'term' => ['required', 'string']
        ]);

        return response()->json($geocodingService->GetAllCoordinatesForAddress($validated['term']));
    }
}
