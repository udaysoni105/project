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
