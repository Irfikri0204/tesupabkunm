<?php

namespace App\Http\Controllers;

use App\Models\DynamicTest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicDynamicTestController extends Controller
{
    public function identitas($slug)
    {
        $test = DynamicTest::with('identities')->where('slug', $slug)->where('is_active', true)->firstOrFail();
        
        return Inertia::render('DynamicTest/Identitas', [
            'test' => $test
        ]);
    }

    public function start(Request $request, $slug)
    {
        $test = DynamicTest::with('identities')->where('slug', $slug)->where('is_active', true)->firstOrFail();
        
        // Build validation rules based on dynamic identities
        $rules = [];
        foreach ($test->identities as $identity) {
            $rule = [];
            if ($identity->is_required) {
                $rule[] = 'required';
            } else {
                $rule[] = 'nullable';
            }

            if ($identity->field_type === 'file') {
                $rule[] = 'file';
                if ($identity->file_type === 'image') {
                    $rule[] = 'mimes:jpg,jpeg,png';
                } elseif ($identity->file_type === 'pdf') {
                    $rule[] = 'mimes:pdf';
                }
                $rule[] = 'max:2048';
            } else {
                $rule[] = 'string';
                $rule[] = 'max:255';
            }

            $rules[$identity->field_name] = implode('|', $rule);
        }

        $validated = $request->validate($rules);

        // Handle file uploads if any
        foreach ($test->identities as $identity) {
            if ($identity->field_type === 'file' && $request->hasFile($identity->field_name)) {
                $validated[$identity->field_name] = $request->file($identity->field_name)->store('dynamic_tests/identities', 'public');
            }
        }

        // Store identity temporarily in session
        session(['dynamic_test_identity_' . $test->id => $validated]);

        return redirect()->route('tes.dinamis.soal', ['slug' => $slug]);
    }

    public function soal($slug)
    {
        $test = DynamicTest::with(['questions.choices'])->where('slug', $slug)->where('is_active', true)->firstOrFail();
        
        // Check if identity exists in session (they came from identitas page)
        if (!session()->has('dynamic_test_identity_' . $test->id)) {
            return redirect()->route('tes.dinamis.identitas', ['slug' => $slug])->with('error', 'Silakan isi identitas terlebih dahulu.');
        }

        return Inertia::render('DynamicTest/Soal', [
            'test' => $test
        ]);
    }

    public function submit(Request $request, $slug)
    {
        $test = DynamicTest::with(['categories'])->where('slug', $slug)->where('is_active', true)->firstOrFail();
        
        $answers = $request->input('answers', []);
        
        // Track per-category scores and total score
        $categoryScores = [];
        $totalScore = 0;
        $isMultiAxis = false;

        foreach ($answers as $questionId => $answerData) {
            $weight = floatval($answerData['weight']);
            $totalScore += $weight;
            
            if (!empty($answerData['category_name'])) {
                $isMultiAxis = true;
                $catName = $answerData['category_name'];
                if (!isset($categoryScores[$catName])) {
                    $categoryScores[$catName] = 0;
                }
                $categoryScores[$catName] += $weight;
            }
        }

        $finalCategory = null;
        $topCategories = [];
        $categoryInterpretations = [];

        if ($isMultiAxis) {
            // Sort categories by score descending
            arsort($categoryScores);
            
            // For tests like Kecerdasan Majemuk we might want top 3, for Gaya Belajar top 1. 
            // We'll pass all of them sorted, and match their interpretations.
            foreach ($categoryScores as $catName => $score) {
                $topCategories[] = $catName;
                
                // Find matching category definition for description
                $catDef = $test->categories->firstWhere('name', $catName);
                if ($catDef) {
                    $categoryInterpretations[$catName] = $catDef->description;
                } else {
                    $categoryInterpretations[$catName] = '';
                }
            }
            
            // Set finalCategory as the highest scoring one
            if (count($topCategories) > 0) {
                $finalCategory = $test->categories->firstWhere('name', $topCategories[0]);
            }
        } else {
            // Single Axis Scoring
            foreach ($test->categories as $category) {
                if ($totalScore >= $category->min_score && $totalScore <= $category->max_score) {
                    $finalCategory = $category;
                    break;
                }
            }
        }

        if (!$finalCategory) {
            $finalCategory = $test->categories->first();
        }

        $result = [
            'total_score' => $totalScore,
            'category_name' => $finalCategory ? $finalCategory->name : 'Selesai',
            'category_description' => $finalCategory ? $finalCategory->description : 'Terima kasih telah mengikuti tes.',
            'identitas' => session('dynamic_test_identity_' . $test->id, []),
            'is_multi_axis' => $isMultiAxis,
            'category_scores' => $categoryScores,
            'top_categories' => $topCategories,
            'category_interpretations' => $categoryInterpretations,
        ];

        return Inertia::render('DynamicTest/Hasil', [
            'test' => $test,
            'result' => $result
        ]);
    }
}
