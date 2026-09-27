<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DynamicTest extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'instructions',
        'tips',
        'is_active',
    ];

    public function identities()
    {
        return $this->hasMany(DynamicTestIdentity::class)->orderBy('order');
    }

    public function categories()
    {
        return $this->hasMany(DynamicTestCategory::class);
    }

    public function questions()
    {
        return $this->hasMany(DynamicTestQuestion::class)->orderBy('order');
    }
}
