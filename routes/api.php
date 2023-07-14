<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\TasksController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::get('/states/{country}', 'RegistrationController@getStates');

// Route::get('/states/{country}',[RegistrationController::class,'getStates']);
info("password");
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/users', [UserController::class,'index']);
Route::post('/users', [UserController::class,'store']);
Route::put('/users/{id}', [UserController::class,'update']);
Route::delete('/users/{id}', [UserController::class,'destroy']);

Route::post('/me', [AuthController::class,'me']);
Route::post('/refresh', [AuthController::class,'refresh']);
Route::post('/login', [AuthController::class,'login']);
Route::post('/logout', [AuthController::class,'logout']);
Route::post('/forgot-password',[AuthController::class,'forgotPassword']);
Route::post('/resetpassword',[ResetPasswordController::class,'resetPassword']);
Route::group(['middleware'=>'api'], function ($router) {
    Route::post('/register', [AuthController::class,'register']);
    Route::get('/profile', [AuthController::class,'profile']);
});

// Route::apiResource('/projects', ProjectsController::class);
// Route::delete('/projects/{id}', [ProjectController::class, 'softDelete']);
// Route::apiResource('/tasks', TasksController::class);



// Public route accessible to all
Route::get('/projects', [ProjectsController::class, 'index']);

// Routes for admin
Route::middleware(['auth', 'CORS:add_project,edit_project,softDelete_project'])->group(function () {
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
    Route::delete('/projects/{id}', [ProjectController::class, 'softDelete']);
});

// // Routes for project manager
// Route::middleware(['auth', 'role_has_permissions:project_manager,edit_project,view_project'])->group(function () {
//     Route::put('/projects/{id}', [ProjectController::class, 'update']);
// });

// // Routes for developer
// Route::middleware(['auth', 'role_has_permissions:developer,view_project'])->group(function () {
//     // Developers only have access to view projects
//     // They cannot add, edit, or delete projects
// });



    
// Public route accessible to all
Route::get('/tasks', [TasksController::class, 'index']);

// Routes for admin
Route::middleware(['auth', 'CORS:admin,add_task'])->group(function () {
    Route::post('/tasks', [TasksController::class, 'store']);
    Route::put('/tasks/{id}', [TasksController::class, 'update']);
    Route::delete('/tasks/{id}', [TasksController::class, 'destroy']);
});

// Routes for project manager
Route::middleware(['auth', 'CORS:project_manager,edit_task'])->group(function () {
    Route::put('/tasks/{id}', [TasksController::class, 'update']);
});

// Routes for developer
Route::middleware(['auth', 'CORS:developer,view_task'])->group(function () {
    // Developers only have access to view tasks
    // They cannot add, edit, or delete tasks
});