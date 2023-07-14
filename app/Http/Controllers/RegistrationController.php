<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DougSisk\CountryState\CountryState;

class RegistrationController extends Controller
{
    //
    public function getStates($country)
    {
        $states = CountryState::getStates($country);
    
        return response()->json($states);
    }
}
