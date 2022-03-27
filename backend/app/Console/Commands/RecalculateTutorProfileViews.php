<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\TutorService;

class RecalculateTutorProfileViews extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tutors:recalculateprofileviews';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Recalculates profile views stats for all tutors';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(TutorService $tutorService)
    {
        $tutorService->RecalculateProfileViews();
        return 0;
    }
}
