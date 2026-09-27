<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DynamicTestQuestion extends Model
{
    protected $fillable = [
        'dynamic_test_id',
        'question_text',
        'order',
    ];

    public function test()
    {
        return $this->belongsTo(DynamicTest::class, 'dynamic_test_id');
    }

    public function choices()
    {
        return $this->hasMany(DynamicTestChoice::class);
    }
}
