# Authenticating requests

This API is authenticated by sending 

All authenticated endpoints are marked with a `requires authentication` badge in the documentation below.

Laravel session based auth is used for this API. To auth/use the API first make a successful call to the login endpoint and include the value returned in the Set-Cookie header in future requests as a header called Cookie. https://laravel.com/docs/8.x/sanctum#spa-authentication
