<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Traits\HasPermissions;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, HasPermissions;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name', 'email', 'password', 'country', 'state', 'isverify'];
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Add a static validation rules array
    public static $rules = [
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|min:6',
        'country' => 'required|string',
        'state' => 'required|string',
        'isverify' => 'boolean',
    ];

    // protected static function boot()
    // {
    //     parent::boot();

    //     // Register the 'saving' event listener
    //     static::saving(function ($model) {
    //         $validator = Validator::make($model->toArray(), static::$rules);

    //         if ($validator->fails()) {
    //             // If validation fails, throw an exception or handle the error as needed.
    //             throw new \Exception($validator->errors()->first());
    //         }

    //         // Validation succeeded, return true to proceed with the save operation.
    //         return true;
    //     });
    // }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_role', 'user_id', 'role_id');
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'user_project');
    }

    // Define the relationship between User and Task (One-to-Many)
    // public function tasks()
    // {
    //     return $this->hasMany(Task::class);
    // }
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_task');
    }
}
