<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Task; 
use Illuminate\Support\Facades\Mail;
use App\Mail\UncompletedTaskReminderMail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class SendUncompletedTaskReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reminder:uncompleted_tasks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send email reminder for uncompleted tasks to project manager';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Get uncompleted tasks
        $uncompletedTasks = Task::where('status', 'pending')->get();

        // If there are no uncompleted tasks, don't send an email
        if ($uncompletedTasks->isEmpty()) {
            $this->info('No uncompleted tasks found.');
            Log::info('No uncompleted tasks found.');
            return;
        }

        // Send email to the project manager
        $projectManagerEmail = 'soniuday235@example.com'; // Replace with the actual email address of the project manager

        Mail::to($projectManagerEmail)->send(new UncompletedTaskReminderMail($uncompletedTasks));

            // Log a message with the 'info' level
    Log::info('Uncompleted task reminder email sent successfully to ' . $projectManagerEmail);
        $this->info('Uncompleted task reminder email sent successfully.');
    }
}
// <?php
// namespace App\Console\Commands;

// use Illuminate\Console\Command;
// use App\Models\Task; 
// use Illuminate\Support\Facades\Mail;
// use App\Mail\UncompletedTaskReminderMail;

// class SendUncompletedTaskReminder extends Command
// {
//     /**
//      * The name and signature of the console command.
//      *
//      * @var string
//      */
//     protected $signature = 'reminder:uncompleted_tasks';


//     /**
//      * The console command description.
//      *
//      * @var string
//      */
//     protected $description = 'Send email reminder for uncompleted tasks to project manager';

//     /**
//      * Execute the console command.
//      */
//     public function handle()
//     {
//         // Get uncompleted tasks
//         $uncompletedTasks = Task::where('completed', false)->get();

//         // If there are no uncompleted tasks, don't send an email
//         if ($uncompletedTasks->isEmpty()) {
//             $this->info('No uncompleted tasks found.');
//             return;
//         }
//                 // Convert Angular template to string
//                 $angularEmailContent = <<<EOT
//                 <!DOCTYPE html>
//                 <html>
//                 <head>
//                     <title>Uncompleted Task Reminder</title>
//                 </head>
//                 <body>
//                     <h1>Uncompleted Task Reminder</h1>
//                     <p>Dear Project Manager,</p>
//                     <p>The following tasks are still uncompleted:</p>
//                     <ul>
//                         @foreach ($uncompletedTasks as $task)
//                             <li>{{ $task->title }}</li>
//                         @endforeach
//                     </ul>
//                     <p>Please ensure that these tasks are addressed promptly.</p>
//                     <p>Thank you!</p>
//                 </body>
//                 </html>
//                 EOT;

//         // Send email to the project manager
//         $projectManagerEmail = 'k@gmail.com'; // Replace with the actual email address of the project manager

//         Mail::to($projectManagerEmail)->send(new UncompletedTaskReminderMail($uncompletedTasks));

//         $this->info('Uncompleted task reminder email sent successfully.');
//     }
// }


// <?php

// namespace App\Console\Commands;

// use Illuminate\Console\Command;
// use App\Models\Task; 
// use Illuminate\Support\Facades\Mail;
// use App\Mail\UncompletedTaskReminderMail;

// class SendUncompletedTaskReminder extends Command
// {
//     /**
//      * The name and signature of the console command.
//      *
//      * @var string
//      */
//     protected $signature = 'reminder:uncompleted_tasks';

//     /**
//      * The console command description.
//      *
//      * @var string
//      */
//     protected $description = 'Send email reminder for uncompleted tasks to project manager';

//     /**
//      * Execute the console command.
//      */
//     public function handle()
//     {
//         // Get uncompleted tasks
//         $uncompletedTasks = Task::where('completed', false)->get();

//         // If there are no uncompleted tasks, don't send an email
//         if ($uncompletedTasks->isEmpty()) {
//             $this->info('No uncompleted tasks found.');
//             return;
//         }

//         // Construct the email content as before
//         $emailContent = '<!DOCTYPE html>
//                         <html>
//                         <head>
//                             <title>Uncompleted Task Reminder</title>
//                         </head>
//                         <body>
//                             <h1>Uncompleted Task Reminder</h1>
//                             <p>Dear Project Manager,</p>
//                             <p>The following tasks are still uncompleted:</p>
//                             <ul>';

//         foreach ($uncompletedTasks as $task) {
//             $emailContent .= '<li>' . $task->title . '</li>';
//         }

//         $emailContent .= '</ul>
//                         <p>Please ensure that these tasks are addressed promptly.</p>
//                         <p>Thank you!</p>
//                         </body>
//                         </html>';

//         // Send email to the project manager with the correct arguments
//         $projectManagerEmail = 'ks@gmail.com'; // Replace with the actual email address of the project manager

//         // Create an instance of the UncompletedTaskReminderMail class with the correct arguments
//         $reminderMail = new UncompletedTaskReminderMail($emailContent, $projectManagerEmail);

//         // Send the email using the Mail facade
//         Mail::to($projectManagerEmail)->send($reminderMail);

//         $this->info('Uncompleted task reminder email sent successfully.');
//     }
// }

