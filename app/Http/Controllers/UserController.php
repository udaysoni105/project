<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    //
    /**
     * Display a listing of the users.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    /**
     * Store a newly created user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = User::create($request->all());
        return response()->json($user, 201);
    }

    /**
     * Update the specified user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

     public function update(Request $request, $id)
     {
         $user = User::find($id);
     
         if (!$user) {
             return response()->json(['error' => 'User not found'], 404);
         }
     
         $user->password = bcrypt($request->input('password'));
         $user->save();
     
         return response()->json(['message' => 'Password updated successfully']);
     }
     
    // public function update(Request $request, $id)
    // {
    //     $user = User::findOrFail($id);
    //             // Perform the password update logic here
    //     $user->password = bcrypt($request->input('password'));
    //     $user->save();
        
    //     return response()->json(['message' => 'Password updated successfully']);
    //     // $user->update($request->all());
    //     // return response()->json($user, 200);
    // }

    /**
     * Remove the specified user from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(null, 204);
    }
    public function registration(Request $request)
    {
        // Validate input data
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'country' => 'required|string',
            'state' => 'required|string',
        ]);

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'country' => $request->country,
            'state' => $request->state,
        ]);

        // Assign role to the user (if using Spatie)
        $user->assignRole('developer');

        // Return response
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
        ], 201);
    }
}
