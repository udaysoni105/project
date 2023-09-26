<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class VerificationController extends Controller
{
    public function verifyEmail(Request $request)
    {
        Log::info("Controller::VerificationController::verifyEmail::START");
        $input = $request->all();
        if ($input == null || $input == '') {
            Log::info("Controller::VerificationController::verifyEmail::");
            return response()->json(['error' => 'verifyEmail'], 500);
        }

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
