<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;

class Role extends Model
{
    use HasFactory, HasRoles;
    protected $gaurd_name = 'web';
    protected $fillable = [
        'name',
    ];
    public function users()
    {
        return $this->belongsTo(User::class, 'user_role', 'role_id', 'user_id');
    }
}
