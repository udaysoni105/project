<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use CountryState;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationEmail;
use Illuminate\Auth\Events\Validated;
use Illuminate\Support\Facades\Auth;

/** @author UDAY SONI
 *
 * Class name: AuthController
 * Create a new AuthController instance.
 *
 */
class AuthController extends Controller
{
    public function _construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }
    /** 
     * @author : UDAY SONI
     * Method name: register
     * Display a listing of users based on the user's role and permission.
     * As a newly registered user in our store, welcome!
     *
     * @return \Illuminate\Http\Response
     * @param Request $request
     * @return JsonResponse
     * @throws Exception
     */
    public function register(Request $request): JsonResponse
    {
        $result = DB::transaction(function () use ($request) {
            try {
                Log::info("Controller::AuthController::register::START");
                $validator = Validator::make($request->all(), [
                    'name' => 'required',
                    'email' => 'required|email|unique:users',
                    'password' => 'required|min:6|confirmed',
                    'country' => 'required',
                    'state' => 'required',
                ]);

                if ($validator->fails()) {
                    return response()->json($validator->errors()->toJson(), 400);
                }

                // $countries = CountryState::getCountries();
                // $states = CountryState::getStates($request->country);

                $user = User::create(array_merge(
                    $validator->validated(),
                    ['name' => $request->name],
                    ['email' => $request->email],
                    ['password' => bcrypt($request->password)],
                    ['country' => $request->country],
                    ['state' => $request->state],
                    ['is_verified' => 0]
                ));

                // Assign the "developer" role to the registered user
                $developerRole = Role::where('name', 'developer')->first();
                if ($developerRole) {
                    $user->assignRole($developerRole);
                }

                // Send verification email
                // Mail::to($user->email)->send(new VerificationEmail($user));

                Log::info("Controller::AuthController::register::END");
                return response()->json(['message' => 'User successful Registration', 'user' => $user], 201);
            } catch (\Exception $ex) {
                Log::error("Error in UserController::register: " . $ex->getMessage());

                return response()->json(['error' => 'An error occurred during registration'], 500);
            }
        });

        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: login
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\Response
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws Exception
     */
    public function login(Request $request): JsonResponse
    {
        $result = DB::transaction(function () use ($request) {
            try {
                Log::info("Controller::AuthController::login::START");

                // Attempt to log in the user
                if (!$token = auth()->attempt($request->only('email', 'password'))) {
                    return response()->json(['error' => 'Unauthorized'], 401);
                }

                // Retrieve the authenticated user
                $user = auth()->user();

                // Get the user's role
                $role = $user->roles->pluck('name')->first();
                Log::info("Controller::AuthController::login::END");
                return response()->json([
                    'access_token' => $token,
                    'user' => [
                        'email' => $user->email,
                        'role' => $role, // Include the role in the response
                    ],
                    'token_type' => 'bearer',
                    'expires_in' => auth()->factory()->getTTL() * 60,
                ]);
            } catch (\Exception $ex) {
                Log::error("Error in AuthController::login: " . $ex->getMessage());

                return response()->json(['error' => 'An error occurred during login'], 500);
            }
        });

        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: refresh
     * Refresh a token.
     *
     * @return \Illuminate\Http\Response
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws Exception
     */
    public function refresh()
    {
        $result = DB::transaction(function () {
            try {
                Log::info("Controller::AuthController::refresh::START");
                return $this->respondWithToken(auth()->refresh());
                Log::info("Controller::AuthController::refresh::END");
            } catch (\Exception $ex) {
                Log::error("Error in AuthController::refresh: " . $ex->getMessage());
                return response()->json(['error' => 'An error occurred while refreshing the token'], 500);
            }
        });
        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: respondWithToken
     * Get the token array structure.
     *
     * @return \Illuminate\Http\Response
     * @param  string $token
     * @return \Illuminate\Http\JsonResponse
     * @throws Exception
     */
    protected function respondWithToken($token)
    {
        $result = DB::transaction(function () {
            try {
                Log::info("Controller::AuthController::respondWithToken::START");
                return response()->json([
                    'access_token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => auth()->factory()->getTTL() * 60,
                    'user' => auth()->user()->name
                ]);
                Log::info("Controller::AuthController::respondWithToken::END");
            } catch (\Exception $ex) {
                // Log any exceptions that might occur during the process
                Log::error("Error in respondWithToken: " . $ex->getMessage());
                // Return an error response in case of any issues
                return response()->json(['error' => 'An error occurred while responding with token'], 500);
            }
        });
        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: profile
     * show user profile.
     *
     * @return \Illuminate\Http\Response
     * @param  string $token
     * @return \Illuminate\Http\JsonResponse
     * @throws Exception
     */
    public function profile()
    {
        $result = DB::transaction(function () {
            try {
                Log::info("Controller::AuthController::profile::START");
                // Retrieve the authenticated user
                $user = auth()->user();


                // Check if the user is authenticated
                if (!$user) {
                    return response()->json(['error' => 'Unauthenticated'], 401);
                }

                Log::info("Controller::AuthController::profile::END");
                // Return the user's profile information
                return response()->json(auth()->user());
            } catch (\Exception $ex) {
                Log::error("Error in UserController::profile: " . $ex->getMessage());

                return response()->json(['error' => 'An error occurred while retrieving the profile'], 500);
            }
        });
        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: me
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        $result = DB::transaction(function () {
            try {
                Log::info("Controller::AuthController::me::START");

                // Retrieve the authenticated user
                $user = auth()->user();

                // Check if the user is authenticated
                if (!$user) {
                    Log::error("Controller::AuthController::profile:: User is not authenticated");
                    return response()->json(['error' => 'Unauthenticated'], 401);
                }

                // Return the user's own profile information
                Log::info("Controller::AuthController::me::END");
                return response()->json(auth()->user());
            } catch (\Exception $ex) {
                Log::error("Error in UserController::me: " . $ex->getMessage());

                return response()->json(['error' => 'An error occurred while retrieving the profile'], 500);
            }
        });
        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: logout
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\Response
     * @param  string $token
     * @return \Illuminate\Http\JsonResponse
     * @throws Exception
     */
    public function logout()
    {
        $result = DB::transaction(function () {
            try {
                Log::info("Controller::AuthController::logout::START");
                auth()->logout();
                Log::info("Controller::AuthController::logout::END");
                return response()->json(['message' => 'Successfully logged out']);
            } catch (\Exception $ex) {
                Log::error("Error in UserController::logout: " . $ex->getMessage());
                return response()->json(['error' => 'An error occurred during logout'], 500);
            }
        });
        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: forgotPassword
     * not Login user forgotPassword.
     *
     * @return \Illuminate\Http\Response
     * @param  string $token
     * @return \Illuminate\Http\JsonResponse
     * @throws Exception
     */
    public function forgotPassword(Request $request)
    {
        $result = DB::transaction(function () {
            try {
                Log::info("Controller::AuthController::forgotPassword::START");
                // Validate input data
                $request->validate([
                    'email' => 'required|email',
                ]);

                // Send password reset link
                $status = Password::sendResetLink($request->only('email'));
                Log::info("Controller::AuthController::forgotPassword::END");
                // Return response based on the status
                return $status === Password::RESET_LINK_SENT
                    ? response()->json(['message' => 'Password reset link sent'])
                    : response()->json(['message' => 'Unable to send password reset link'], 500);
                // : response()->json(['error' => 'Unable to send reset link'], 400);
            } catch (\Exception $ex) {
                Log::error("Error in UserController::forgotPassword: " . $ex->getMessage());
                return response()->json(['error' => 'An error occurred during forgot password process'], 500);
            }
        });
        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: resetPassword
     * not Login user resetPassword.
     *
     * @return \Illuminate\Http\Response
     * @param  string $token
     * @return \Illuminate\Http\JsonResponse
     * @throws Exception
     */
    public function resetPassword(Request $request)
    {
        $result = DB::transaction(function () {
            try {
                Log::info("Controller::AuthController::resetPassword::START");
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
                Log::info("Controller::AuthController::resetPassword::END");
                // Return response based on the status
                return $status === Password::PASSWORD_RESET
                    ? response()->json(['message' => 'Password reset successful'])
                    : response()->json(['message' => 'Unable to reset password'], 500);
            } catch (\Exception $ex) {
                Log::error("Error in UserController::resetPassword: " . $ex->getMessage());
                return response()->json(['error' => 'An error occurred during password reset process'], 500);
            }
        });
        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: getCountries
     * Get an array of countries.
     *
     * @return \Illuminate\Http\Response
     * @param  string $token
     * @return \Illuminate\Http\JsonResponse
     * @throws Exception
     */
    public function getCountries()
    {
        $result = DB::transaction(function () {
            try {
                Log::info("Controller::AuthController::getCountries::START");
                $countries = CountryState::getCountries();
                Log::info("Controller::AuthController::getCountries::END");
                return response()->json($countries);
            } catch (\Exception $ex) {
                Log::error("Error in UserController::getCountries: " . $ex->getMessage());
                return response()->json(['error' => 'An error occurred while fetching countries'], 500);
            }
        });
        return $result;
    }

    /** 
     * @author : UDAY SONI
     * Method name: getStates
     * Get an array of states for a specific country.
     *
     * @return \Illuminate\Http\Response
     * @param string $countryCode
     * @return \Illuminate\Http\JsonResponse
     * @throws Exception
     */
    public function getStates($countryCode)
    {
        $result = DB::transaction(function () {
            try {
                Log::info("Controller::AuthController::getStates::START");
                $states = CountryState::getStates($countryCode);
                Log::info("Controller::AuthController::getStates::END");
                return response()->json($states);
            } catch (\Exception $ex) {
                Log::error("Error in UserController::getStates: " . $ex->getMessage());
                return response()->json(['error' => 'An error occurred while fetching states'], 500);
            }
        });
        return $result;
    }
}
