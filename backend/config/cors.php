<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        // local dev env
        'http://localhost', 
        'http://localhost:3000', 

        // react-snap pre-renderer
        'http://localhost:45678',
    
        // local android dev env
        'http://10.0.2.2',
        'http://10.0.2.2:3000',

        // staging env
        'https://qualifiedtutors.bypass.systems',

        // production env
        'https://qualifiedtutors.co.uk'
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
