<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LinkedWebsite extends Model
{
    protected $fillable = [
        'name',
        'description',
        'url',
        'color',
        'is_active',
        'order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
