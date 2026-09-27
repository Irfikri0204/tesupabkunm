<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DynamicTestChoice extends Model
{
    protected $fillable = [
        'dynamic_test_question_id',
        'choice_text',
        'weight',
        'dynamic_test_category_id',
    ];

    public function question()
    {
        return $this->belongsTo(DynamicTestQuestion::class, 'dynamic_test_question_id');
    }

    public function category()
    {
        return $this->belongsTo(DynamicTestCategory::class, 'dynamic_test_category_id');
    }
}
