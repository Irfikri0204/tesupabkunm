<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestSetting extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'is_open',
    ];

    protected $casts = [
        'is_open' => 'boolean',
    ];

    public static function isOpen(string $slug): bool
    {
        return static::where('slug', $slug)->value('is_open') ?? true;
    }
}
