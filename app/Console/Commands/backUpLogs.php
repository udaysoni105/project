<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\App;

class backUpLogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:back-up-logs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        if (!App::isLocal()) {
            $localDisk = Storage::disk('log');
            $contents = $localDisk->get(LOG_FILE_NAME);
            $pathPrefix = '/logs/' . LOG_FILE_NAME . ' ' . Carbon::now();
            Storage::disk('s3')->put($pathPrefix, $contents);
        } else {
        }
        Log::info('BackUpLogs not backing up in local env');
    }
}
