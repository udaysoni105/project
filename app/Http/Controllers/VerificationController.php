<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Log;
class VerificationController extends Controller
{
    public function verifyEmail(Request $request)
    {
        Log::info("Controller::VerificationController::verifyEmail::START");
        $encryptedEmail = $request->query('key');
        $email = hex2bin($encryptedEmail);
    
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            return redirect()->route('email_verification_failed'); // Redirect to a failure page
        }
    
        if (!$user->is_verified) {
            $user->is_verified = true;
            $user->save();
        } else {
            return redirect()->route('email_already_verified'); // Redirect to a page indicating email is already verified
        }
    
        Log::info("Controller::VerificationController::verifyEmail::END");
        return redirect()->away('http://localhost:4200/api/login/verify_email'); // Redirect to a success page

    }
    
    
}
// <?php

// namespace App\Http\Controllers;

// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\DB;
// use App\Models\User;
// use Illuminate\Support\Facades\Log;
// class VerificationController extends Controller
// {
//     public function verifyEmail(Request $request)
//     {
//         Log::info("Controller::VerificationController::verifyEmail::START");
//         $encryptedEmail = $request->query('key');
//         $email = hex2bin($encryptedEmail);
    
//         $user = User::where('email', $email)->first();
//         if($user->is_verified ==0 ){

//             if (!$user) {
//                 return redirect()->route('email_verification_failed'); // Redirect to a failure page
//             }
        
//             // Check if the user is already verified
//             if ($user->is_verified) {
//                 return redirect()->route('email_already_verified'); // Redirect to a page indicating email is already verified
//             }
        
//             // Update the is_verified column and send a success response
//             $user->is_verified = true;
//             $user->save();
//         }  
//         $frontendUrl = 'http://localhost:4200/api/login/verify_email';   
//         Log::info("Controller::VerificationController::verifyEmail::END");
//                 return redirect()->away($frontendUrl); 
//     }
    
// }