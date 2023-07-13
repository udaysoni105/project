<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller
{
    //
    public function forgotPassword(Request $request)
    {
        // Validate input data
        $request->validate([
            'email' => 'required|email',
        ]);

        // Send password reset link
        $status = Password::sendResetLink($request->only('email'));

        // Return response
        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Password reset link sent'])
            : response()->json(['message' => 'Unable to send password reset link'], 500);
            // : response()->json(['error' => 'Unable to send reset link'], 400);
    }
}

