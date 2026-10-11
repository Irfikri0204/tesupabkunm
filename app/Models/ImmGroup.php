<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImmGroup extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function results()
    {
        return $this->hasMany(ImmResult::class);
    }

    public function faculties()
    {
        return $this->hasMany(ImmFaculty::class);
    }
}
