<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;
use App\Enums\ESubjectLevels;
use Illuminate\Support\Str;

class FileController extends Controller
{
    /**
     * Upload a file to public storage
     *
     * Used to store files that need to be served publically (profile pics and the like)
     * 
     * @unauthenticated
     */
    public function UploadPublicFile(Request $request) {
        
        $request->validate([
            'file' => ['required', 'mimes:jpg,jpeg,png,webp,gif,bmp', 'max:18240']
        ]);

        $file = $request->file('file');
        $uuid = (string)Str::uuid();
        $path = $file->storeAs($uuid, $file->getClientOriginalName(), 's3');

        return response()->json([
            'path' => $path,
            'url' => env('AWS_S3_PUBLIC_TMP_BUCKET_URL') . urlencode($path),
            'uuid' => $uuid
        ]);
    }

    /**
     * Upload a file to private storage
     *
     * Used to store files that shouldn't be publically accessible (registration documents, message attachments, etc)
     * 
     * @unauthenticated
     */
    public function UploadPrivateFile(Request $request) {
        
        $request->validate([
            'file' => ['required', 'mimes:jpg,jpeg,png,webp,gif,bmp,pdf,doc,docx,odf', 'max:18240']
        ]);

        $file = $request->file('file');
        $uuid = (string)Str::uuid();
        $path = $file->storeAs($uuid, $file->getClientOriginalName(), 's3_private');

        return response()->json([
            'path' => $path,
            'url' => env('AWS_S3_PRIVATE_TMP_BUCKET_URL') . urlencode($path),
            'uuid' => $uuid
        ]);
    }
}
