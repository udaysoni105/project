<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Task;

class UncompletedTaskReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $uncompletedTasks;

    /**
     * Create a new message instance.
     */
    public function __construct($uncompletedTasks)
    {
        $this->uncompletedTasks = $uncompletedTasks;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Uncompleted Task Reminder')
                    ->view('emails.uncompleted_tasks'); // Use the email template "emails.uncompleted_tasks.blade.php"
    }
}



// namespace App\Mail;

// use Illuminate\Bus\Queueable;
// use Illuminate\Contracts\Queue\ShouldQueue;
// use Illuminate\Mail\Mailable;
// use Illuminate\Mail\Mailables\Content;
// use Illuminate\Mail\Mailables\Envelope;
// use Illuminate\Queue\SerializesModels;
// use App\Models\User;

// class UncompletedTaskReminderMail extends Mailable
// {
//     use Queueable, SerializesModels;
//     // public $user;
//     public $uncompletedTasks;
//     public $angularEmailContent; // Variable to store Angular email template content
//     /**
//      * Create a new message instance.
//      */
//     public function __construct($uncompletedTasks, $angularEmailContent)
//     {
//         //
//         // $this->user = $user;
//         $this->uncompletedTasks = $uncompletedTasks;
//         $this->angularEmailContent = $angularEmailContent;
//     }

    // /**
    //  * Get the message envelope.
    //  */
    // public function envelope(): Envelope
    // {
    //     return new Envelope(
    //         subject: 'Uncompleted Task Reminder Mail',
    //     );
    // }

    // /**
    //  * Get the message content definition.
    //  */
    // public function content(): Content
    // {
    //     return new Content(
    //         view: 'view.name',
    //     );
    // }

    // /**
    //  * Get the attachments for the message.
    //  *
    //  * @return array<int, \Illuminate\Mail\Mailables\Attachment>
    //  */
    // public function attachments(): array
    // {
    //     return [];
    // }
//     /**
//      * Build the message.
//      *
//      * @return $this
//      */
//     public function build()
//     {
//         // return $this->view('emails.uncompleted_tasks')
//         //             ->subject('Uncompleted Task Reminder');

//         // Set the email content to the Angular template
//         $this->view->with('angularEmailContent', $this->angularEmailContent);

//         return $this->subject('Uncompleted Task Reminder')
//                     ->view('emails.blank'); // Use a blank Laravel view (will be replaced with Angular content)
//     }
// } 


// <?php

// namespace App\Mail;

// use Illuminate\Bus\Queueable;
// use Illuminate\Mail\Mailable;
// use Illuminate\Queue\SerializesModels;
// use Illuminate\Contracts\Queue\ShouldQueue;

// class UncompletedTaskReminderMail extends Mailable
// {
//     use Queueable, SerializesModels;

//     public $emailContent;
//     public $projectManagerEmail;

//     /**
//      * Create a new message instance.
//      *
//      * @param  string  $emailContent
//      * @param  string  $projectManagerEmail
//      */
//     public function __construct($emailContent, $projectManagerEmail)
//     {
//         $this->emailContent = $emailContent;
//         $this->projectManagerEmail = $projectManagerEmail;
//     }

//     /**
//      * Build the message.
//      *
//      * @return $this
//      */
//     public function build()
//     {
//         return $this->html($this->emailContent);
//     }
// }
