<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DynamicTestCategory extends Model
{
    protected $fillable = [
        'dynamic_test_id',
        'name',
        'description',
        'min_score',
        'max_score',
    ];

    public function test()
    {
        return $this->belongsTo(DynamicTest::class, 'dynamic_test_id');
    }
}
