<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use CountryState;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationEmail;
use Illuminate\Auth\Events\Validated;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use ResponseManager;

const LOG_FILE_NAME = 'laravel.log';
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
    public function register(Request $request)
    {
        $result = DB::transaction(function () use ($request) {
            try {
                Log::info("Controller::AuthController::register::START");

                $validator = Validator::make($request->all(), [
                    'name' => 'required',
                    'email' => 'required|email|unique:users|ends_with:.com',
                    'password' => 'required|min:6|confirmed',
                    'country' => 'required',
                    'state' => 'required',
                ]);

                if ($validator->fails()) {
                    return response()->json($validator->errors()->toJson(), 400);
                }

                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => bcrypt($request->password),
                    'country' => $request->country,
                    'state' => $request->state,
                ]);

                if ($user == null || $user == '') {
                    Log::info("Controller::AuthController::login::");
                    return response()->json(['error' => 'user not found'], 500);
                }

                // Assign the "developer" role to the registered user
                $developerRole = Role::where('name', 'developer')->first();
                if ($developerRole) {
                    $user->assignRole($developerRole);
                }

                $serverUrl = url('http://localhost:8000/api');

                $encryptedEmail = bin2hex($user->email);

                $verificationLink = '<a href="' . $serverUrl . '/verify_email?key=' . $encryptedEmail . '" target="_blank">here</a>.';

                $toRecipientMailArr = [
                    'to' => [
                        [
                            'email' => $user->email,
                        ],
                    ],
                ];

                // Use the Mandrill/Mailchimp API to send the email
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, env('MANDRILL_PRODUCTION_URL'));
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                    'key' => env('MANDRILL_API_KEY'),
                    'template_name' => env('MANDRILL_NAMe'),
                    'template_content' => [
                        [
                            'name' => 'username',
                            'content' => $user->name,
                        ],
                        [
                            'name' => 'useremail',
                            'content' => $user->name,
                        ],
                        [
                            'name' => 'link',
                            'content' => $verificationLink,
                        ],
                    ],
                    'message' => $toRecipientMailArr,
                ]));

                $curlResult = curl_exec($ch);

                $curlResult = (array) json_decode($curlResult);

                if (array_key_exists('error', $curlResult)) {
                    Log::error('Admin::AuthController::register::' . $curlResult['error']);
                    return response()->json(['error' => 'An error occurred while sending email'], 500);
                }

                curl_close($ch);

                Log::info("Controller::AuthController::register::END");
                return response()->json(['message' => 'User successfully registered', 'user' => $user], 201);
            } catch (\Exception $ex) {
                Log::error("Error in AuthController::register: " . $ex->getMessage());
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

                if ($user == null || $user == '') {
                    Log::info("Controller::AuthController::login::");
                    return response()->json(['error' => 'Unauthorized'], 401);
                }

                // Get the user's role
                $role = $user->roles->pluck('name')->first();
                if ($role === 'developer' && $user->is_verified !== 1) {
                    return response()->json(['error' => 'Developer must be verified'], 401);
                }
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

    // /** 
    //  * @author : UDAY SONI
    //  * Method name: imageUpload
    //  * show user profile image s3 cloud link.
    //  *
    //  * @return \Illuminate\Http\Response
    //  * @param  string $token
    //  * @return \Illuminate\Http\JsonResponse
    //  * @throws Exception
    //  */
    public function imageUpload()
    {
        $result = DB::transaction(function () {
            try {
                Log::info("Controller::AuthController::imageUpload::START");
                $url = 'https://s3-us-west-1.amazonaws.com/snapstics-staging-file-storage/images/user_logo/';
                $images = [];
                $files = Storage::disk('s3')->files('images');
                foreach ($files as $file) {
                    $images[] = [
                        'name' => str_replace(' $url', '', $file),
                        'src' => $url . $file
                    ];
                }
                Log::info("Controller::AuthController::imageUpload::END");
                return response()->json(compact('images'));
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
     * Method name: store
     * show user profile.
     *
     * @return \Illuminate\Http\Response
     * @param  string $token
     * @return \Illuminate\Http\JsonResponse
     * @throws Exception
     */
    public function upload(Request $request)
    {
        Log::info("Controller::AuthController::upload::START");

        $file = $request['filename'];

        if ($file == null || $file == '') {
            Log::info("Controller::AuthController::login::");
            return response()->json(['error' => 'file not found'], 403);
        }

        $filename = md5(uniqid(rand(), true)) . $file;

        $filePath = '/images/user_logo/' . $filename;

        $dataFileName = 'https://s3-us-west-1.amazonaws.com/snapstics-staging-file-storage/images/user_logo/' . $filename;
        info($dataFileName);
        Storage::disk('s3')->put($filePath, base64_decode(($request['base64Image'])), 'public');

        $emailHeader = $request->header('email');

        if ($emailHeader == null || $emailHeader == '') {
            Log::info("Controller::AuthController::upload::");
            return response()->json(['error' => 'email is not Retrieve'], 500);
        }

        // Get the user based on the email from the reset link
        $user = User::where('email', $emailHeader)->first();

        info($user);
        // Delete the user's profile image from storage (S3 or local storage, depending on your setup)
        $imagePath = $user->image_path;
        info('imagepath===' . $imagePath);

        if (Storage::disk('s3')->exists($filePath)) {
            Storage::disk('s3')->delete($filename);
        }

        if ($user) {
            // Update the user's image_filename and image_path in the database
            $user->update([
                'image_filename' => $filename,
                'image_path' => $dataFileName
            ]);

            //info('user update' . $user);
            Log::info("Controller::AuthController::upload::END");

            // Return the URL of the uploaded image
            return response()->json([
                'success' => true,
                'message' => 'Image uploaded successfully',
                'filename' => $filename,
            ]);
        } else {
            // Handle the case where the user with the specified email was not found
            return response()->json([
                'success' => false,
                'message' => 'User not found with the provided email.',
            ]);
        }
    }

    /** 
     * @author : UDAY SONI
     * Method name: destroy
     * destroy user profile images.
     *
     * @return \Illuminate\Http\Response
     * @param  string $token
     * @return \Illuminate\Http\JsonResponse
     * @throws Exception
     */
    public function destroy(Request $request, int $id)
    {
        $result = DB::transaction(function () use ($request, $id) {
            try {
                Log::info("Controller::AuthController::destroy::START");
                $input = $request->all();
                info($input);
                // $user = User::find($id);

                // if (!$user) {
                //     return response()->json(['error' => 'User not found'], 404);
                // }

                if (" " != $request['oldProfilePictureUrl'] && null != $request['oldProfilePictureUrl']) {
                    $path = 'https://s3-us-west-1.amazonaws.com/snapstics-staging-file-storage/images/user_logo/' . $request['oldProfilePictureUrl'];
                    if (Storage::disk('s3')->exists($path)) {
                        Storage::disk('s3')->delete($path);
                    }
                }

                info($path);
                Log::info("Controller::AuthController::destroy::END");
                return response()->json([
                    'success' => true,
                    'message' => 'Image deleted successfully',
                ]);
            } catch (\Exception $ex) {
                Log::error("Error in AuthController::profile: " . $ex->getMessage());

                return response()->json(['error' => 'An error occurred while retrieving the profile'], 500);
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
                Log::error("Error in AuthController::profile: " . $ex->getMessage());

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
                Log::error("Error in AuthController::me: " . $ex->getMessage());

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
    public function logout(Request $request)
    {
        $result = DB::transaction(function () {
            try {
                Log::info("Controller::AuthController::logout::START");
                JWTAuth::invalidate(JWTAuth::getToken());
                auth()->logout();
                Log::info("Controller::AuthController::logout::END");
                return response()->json(['message' => 'Successfully logged out']);
            } catch (\Exception $ex) {
                Log::error("Error in AuthController::logout: " . $ex->getMessage());
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
        try {
            Log::info("Controller::AuthController::forgotPassword::START");

            $request->validate([
                'email' => 'required|email',
            ]);

            // Get the user based on the email from the reset link
            $user = User::where('email', $request->email)->first();
            info($user);
            if ($user == null || $user == '') {
                Log::info("Controller::AuthController::forgotPassword::");
                return response()->json(['error' => 'forgotPassword not finding user'], 500);
            }

            // if (!$user) {
            //     return response()->json(['error' => 'User not found'], 404);
            // }

            // Generate a password reset token
            // $token = Password::createToken($user);
            $resetLink = url('http://localhost:4200/reset/' . $user->email);

            // Generate the reset link

            // Use the Mandrill/Mailchimp API to send the email
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, env('MANDRILL_PRODUCTION_URL'));
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                'key' => env('MANDRILL_API_KEY'),
                'template_name' => env('MANDRILL_name'),
                'template_content' => [
                    [
                        'name' => 'link',
                        'content' => $resetLink,
                    ],
                ],
                'message' => [
                    'to' => [
                        [
                            'email' => $user->email,
                            'name' => $user->name,
                        ],
                    ],
                ],
            ]));

            $result = curl_exec($ch);
            $result = (array) json_decode($result);
            curl_close($ch);

            Log::info("Controller::AuthController::forgotPassword::END");
            return response()->json(['message' => 'Password reset link sent']);
        } catch (\Exception $ex) {
            Log::error("Error in AuthController::forgotPassword: " . $ex->getMessage());
            return response()->json(['error' => 'An error occurred during the forgot password process'], 500);
        }
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
        $result = DB::transaction(function () use ($request) {
            try {
                Log::info("Controller::AuthController::resetPassword::START");
                //Log::info('Reset Password Request:', $request->all());
                $request->validate([
                    'email' => 'required|email',
                    'password' => 'required|min:6|confirmed',
                ]);

                // Get the user based on the email
                $user = User::where('email', $request->email)->first();
                if ($user == null || $user == '') {
                    Log::info("Controller::AuthController::resetPassword::");
                    return response()->json(['error' => 'resetPassword not finding user'], 404);
                }

                if (!$user) {
                    return response()->json(['error' => 'User not found'], 404);
                }

                // Reset the user's password
                $user->password = bcrypt($request->password);
                if ($user == null || $user == '') {
                    Log::info("Controller::AuthController::resetPassword::");
                    return response()->json(['error' => 'password not changes'], 404);
                }
                $user->save();

                Log::info("Controller::AuthController::resetPassword::END");

                return response()->json(['message' => 'Password reset successful']);
            } catch (\Exception $ex) {
                Log::error("Error in AuthController::resetPassword: " . $ex->getMessage());
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
                if ($countries == null || $countries == '') {
                    Log::error('Controller::AuthController::getCountries::');
                    return Response()->json(['error' => 'An error occurred while fetching countries']);
                }
                Log::info("Controller::AuthController::getCountries::END");
                return response()->json($countries);
            } catch (\Exception $ex) {
                Log::error("Error in AuthController::getCountries: " . $ex->getMessage());
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
        $result = DB::transaction(function () use ($countryCode) {
            try {

                Log::info("Controller::AuthController::getStates::START");
                $states = CountryState::getStates($countryCode);
                if ($states == null || $states == '') {
                    Log::error('Controller::AuthController::getStates::');
                    return response()->json(['error' => 'An error occurred while fetching state']);
                }
                Log::info("Controller::AuthController::getStates::END");
                return response()->json($states);
            } catch (\Exception $ex) {
                Log::error("Error in AuthController::getStates: " . $ex->getMessage());
                return response()->json(['error' => 'An error occurred while fetching states'], 500);
            }
        });
        return $result;
    }
}
