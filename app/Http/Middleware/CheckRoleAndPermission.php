<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckRoleAndPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $role, $permission): Response
    {
        // $user = Auth::user();
        // info($user);

        // if (!$user || !$user->hasRole($role) || !$user->can($permission)) {
        //     abort(403, 'Unauthorized');
        // }

        return $next($request);
    }

}

