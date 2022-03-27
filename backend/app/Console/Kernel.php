<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Console\Commands\RecalculateAverageReviewScores;
use App\Console\Commands\RecalculateAverageResponseTimes;
use App\Console\Commands\RecalculateTutorProfileViews;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')->hourly();
        $schedule->command(RecalculateAverageResponseTimes::class, [])
            ->timezone('Europe/London')
            ->dailyAt('2:00');

        $schedule->command(RecalculateAverageReviewScores::class, [])
            ->timezone('Europe/London')
            ->dailyAt('03:00');

        $schedule->command(RecalculateTutorProfileViews::class, [])
            ->timezone('Europe/London')
            ->dailyAt('04:00');
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
