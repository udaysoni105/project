<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;

class UserRole extends Model
{
    use HasFactory, HasRoles;
    protected $gaurd_name = 'web';
    protected $fillable = [
        'user_id', 'role_id',
    ];
    protected $table = 'user_role';
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
