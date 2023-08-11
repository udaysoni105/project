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

    public $invoice;

    /**
     * Create a new message instance.
     */
    public function __construct($invoice)
    {
        $this->invoice = $invoice;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Uncompleted Task Reminder')
                    ->view('invoice'); // Use the email template "emails.uncompleted_tasks.blade.php"
    }
}


// <?php

// namespace App\Mail;

// use Illuminate\Bus\Queueable;
// use Illuminate\Contracts\Queue\ShouldQueue;
// use Illuminate\Mail\Mailable;
// use Illuminate\Queue\SerializesModels;
// use App\Models\Task;

// class UncompletedTaskReminderMail extends Mailable
// {
//     use Queueable, SerializesModels;

//     public $invoice;

//     /**
//      * Create a new message instance.
//      */
//     public function __construct($invoice)
//     {
//         $this->invoice = $invoice;
//     }

//     /**
//      * Build the message.
//      *
//      * @return $this
//      */
//     public function build()
//     {
//         return $this->subject('Uncompleted Task Reminder')
//                     ->view('invoice'); // Use the email template "emails.uncompleted_tasks.blade.php"
//     }
// }
