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

    // public function handle()
    // {
    //     $invoice = Task::where('status', '!=', 'completed')->get();
    //     // Log pending task data
    //     info('Pending tasks:', $invoice->toArray());
    //     // Send email to project manager
    //     $projectManagerEmail = 'us300350@gmail.com'; // Replace with actual email

    //     $emailContent = view('invoice', compact('invoice'))->render();

    //     $subject = 'Uncompleted Task Reminder'; // Set the email subject

    //     return 0;

    //     Mail::send([], [], function ($message) use ($projectManagerEmail, $emailContent, $subject) {
    //         $message->to($projectManagerEmail)
    //             ->subject($subject)
    //             ->setBody($emailContent, 'text/html');
    //     });

    //     $this->info('Uncompleted task reminder email sent successfully.');
    // }

    public function __construct()
    {
        parent::__construct();
    }
    public function handle()
    {
        // Retrieve uncompleted tasks from the database
        $invoice = Task::where('status', '!=', 'completed')->get();

        // Retrieve the project manager's email address
        $projectManagerEmail = 'us300350@gmail.com'; // Replace with actual email

        // Generate email content using Blade view
        $emailContent = '<!DOCTYPE html>
        <html>
        <head>
            <title>Uncompleted Task Reminder</title>
        </head>
        <body>
            <h1>Uncompleted Task Reminder</h1>
            <p>Dear Project Manager,</p>
            <p>The following tasks are still uncompleted:</p>
            <table border="1">
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Project ID</th>
                </tr>';
    
    foreach ($invoice as $task) {
        $emailContent .= "
            <tr>
                <td>{$task->name}</td>
                <td>{$task->description}</td>
                <td>{$task->start_date}</td>
                <td>{$task->end_date}</td>
                <td>{$task->status}</td>
                <td>{$task->project_id}</td>
            </tr>";
    }
    
    $emailContent .= '</table>
    <p>Please ensure that these tasks are addressed promptly.</p>
    <p>Thank you!</p>
</body>
</html>';
    

        // info($emailContent);
        // Set email subject
        $subject = 'Uncompleted Task Reminder';

        // Prepare data for Mandrill API request
        $data = [
            'key' => env('MANDRILL_API_KEY'),
            'template_name' => env('MANDRILL_Name'),
            'template_content' => [
                [
                    'name' => 'table',
                    'content' => $emailContent
                ],
                // Add more template content if needed
            ],
            'message' => [
                'to' => [
                    [
                        'email' => $projectManagerEmail,
                    ]
                ],
                'subject' => $subject,
            ],
        ];
        info($data);

        // Send email using cURL
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, env('MANDRILL_PRODUCTION_URL'));
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));

        $result = curl_exec($ch);
        $result = (array) json_decode($result);

        curl_close($ch);

        // Check for errors and log if necessary
        if (array_key_exists('error', $result)) {
            Log::error('Error sending uncompleted task reminder email: ' . $result['error']);
        } else {
            $this->info('Uncompleted task reminder email sent successfully.');
        }
    }
}

