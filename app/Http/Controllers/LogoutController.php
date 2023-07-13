<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogoutController extends Controller
{
    //
    public function logout()
    {
        // Revoke current user's tokens
        Auth::user()->tokens()->delete();

        // Return response
        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
