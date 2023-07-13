<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
// use Dotenv\Validator;
use App\Models\User;
use Illuminate\Auth\Events\Validated;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationEmail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Psy\Util\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    //
    
    public function _construct(){
        
    info("register");
    
        $this->middleware('auth:api',['except'=>['login','register']]);
    }
    public function register(Request $request){
       info("AuthController");
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'country' => 'required',
            'state' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }
        $user = User::create(array_merge(
            $validator->validated(),
            ['name' => $request->name],
            ['email' => $request->email],
            ['password' => bcrypt($request->password)],
            ['country' => $request->country],
            ['state' => $request->state],
            // ['is_verified' => 0] // Set is_verified to 0 (not verified)
        ));

                // Send verification email
                // Mail::to($user->email)->send(new VerificationEmail($user));

        return response()->json(['message' => 'User successful Registration', 'user' => $user],201);

    }

    public function login(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|',
            'password' => 'required|string|min:6',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        // if (!$token = auth()->attempt($validator->validated())) {
            // return response()->json(['error' => 'Unauthorized'], 401);;
        }
        return response()->json(['token' => $token]);
        // return $this->createNewToken($token);
    }
    public function createNewToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
            'user' => auth()->user()
        ]);
    }
    public function profile(){
        return response()->json(auth()->user());
    }
    public function logout(){
        auth()->logout();
        return response()->json(['message' =>'user logged out']);
    }
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
    public function resetPassword(Request $request)
    {
        // Validate input data
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
            'token' => 'required',
        ]);

        // Reset user's password
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));

                $user->save();
            }
        );

        // Return response
        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Password reset successful'])
            : response()->json(['message' => 'Unable to reset password'], 500);
    }
}

