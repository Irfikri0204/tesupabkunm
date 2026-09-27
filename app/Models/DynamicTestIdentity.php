<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DynamicTestIdentity extends Model
{
    protected $fillable = [
        'dynamic_test_id',
        'field_label',
        'field_name',
        'field_type',
        'file_type',
        'is_required',
        'options',
        'order',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'options' => 'array',
    ];

    public function test()
    {
        return $this->belongsTo(DynamicTest::class, 'dynamic_test_id');
    }
}
