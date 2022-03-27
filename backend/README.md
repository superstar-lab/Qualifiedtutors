# Qualified Tutors REST API

REST API that manages the applications data model and notifications.

Authorization is handled via Laravel Sanctum which issues users a session cookie on login.
    - @see https://laravel.com/docs/8.x/sanctum#main-content

All responses are content-type application/json

## Running it locally
- Have PHP & Composer installed
- `cp .env.dev .env`
- `vim .env` and edit as appropriate for your development environment
- `composer install`
- `php artisan key:generate`
- `php artisan migrate`
- `php artisan db:seed`
- `php artisan db:seed --class=FakeStudentSeeder`
- `php artisan db:seed --class=FakeTutorSeeder`
- `php artisan db:seed --class=FakeReviewSeeder`
- `php artisan db:seed --class=FakeFaqsSeeder`
- `php artisan db:seed --class=FakeAnalyticsSeeder`
- `php artisan serve`

## Deploying it
- Use the Deploy API to Staging/Production Github actions

## Artisan commands
- tutors:recalculateaverageresponsetimes
    - Calculates average response time of users to their conversations
- tutors:recalculatereviewscores
    - Calculates tutor average review scores
- tutors:recalculateprofileviews
    - Calculates tutor profile views based on analytic events

## Scheduled tasks
- The commands above are made asynchronous and run on a schedule via Laravels scheduler
    - @see https://laravel.com/docs/8.x/scheduling#running-the-scheduler-locally

## Structure
- Standard Laravel, except:
    - .ebextensions/
        - Configuration applied to the web server instances at deploy time
        - Used to set Apache/PHP/*nix options
    - @see https://laravel.com/docs/8.x/routing for explinations of Laravels structure/major functionality    

## API Documentation
- run `php artisan scribe:generate` to generate the API documentation site