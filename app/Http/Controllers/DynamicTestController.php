<?php

namespace App\Http\Controllers;

use App\Models\DynamicTest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class DynamicTestController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/DynamicTests/Index', [
            'data' => DynamicTest::latest()->paginate(20)
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/DynamicTests/Form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'instructions' => 'nullable|string',
            'tips' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['title']) . '-' . time();
        $test = DynamicTest::create($data);

        \App\Models\TestSetting::firstOrCreate(
            ['slug' => $test->slug],
            ['name' => $test->title, 'is_open' => true]
        );

        return redirect()->route('admin.dynamic-tests.edit', $test->id)->with('success', 'Tes dinamis berhasil dibuat. Silakan konfigurasikan data diri, soal, dan kategori.');
    }

    public function show($id)
    {
        // Public API or view could use this.
    }

    public function edit($id)
    {
        $test = DynamicTest::with(['identities', 'categories', 'questions.choices'])->findOrFail($id);
        return Inertia::render('Admin/DynamicTests/Form', ['model' => $test]);
    }

    public function update(Request $request, $id)
    {
        $test = DynamicTest::findOrFail($id);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'instructions' => 'nullable|string',
            'tips' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($request->title !== $test->title) {
            $oldSlug = $test->slug;
            $data['slug'] = Str::slug($data['title']) . '-' . time();
            \App\Models\TestSetting::where('slug', $oldSlug)->update([
                'slug' => $data['slug'],
                'name' => $request->title,
            ]);
        } else {
            \App\Models\TestSetting::where('slug', $test->slug)->update([
                'name' => $request->title,
            ]);
        }

        $test->update($data);

        // Sync Identities (Data Diri)
        if ($request->has('identities')) {
            $test->identities()->delete();
            foreach ($request->identities as $index => $identity) {
                $test->identities()->create([
                    'field_label' => $identity['field_label'],
                    'field_name' => Str::slug($identity['field_label']),
                    'field_type' => $identity['field_type'],
                    'file_type' => $identity['file_type'] ?? null,
                    'is_required' => $identity['is_required'] ?? true,
                    'options' => $identity['options'] ?? null,
                    'order' => $index,
                ]);
            }
        }

        // Sync Categories (Kategori Hasil)
        if ($request->has('categories')) {
            $test->categories()->delete();
            foreach ($request->categories as $category) {
                $test->categories()->create([
                    'name' => $category['name'],
                    'description' => $category['description'] ?? null,
                    'min_score' => $category['min_score'] ?? null,
                    'max_score' => $category['max_score'] ?? null,
                ]);
            }
        }

        // Sync Questions & Choices (Bank Soal)
        if ($request->has('questions')) {
            $test->questions()->delete();
            // Re-fetch categories to get their IDs if choices map to them
            $categoryMap = $test->categories()->pluck('id', 'name')->toArray();

            foreach ($request->questions as $qIndex => $question) {
                $newQuestion = $test->questions()->create([
                    'question_text' => $question['question_text'],
                    'order' => $qIndex,
                ]);

                if (isset($question['choices']) && is_array($question['choices'])) {
                    foreach ($question['choices'] as $choice) {
                        $categoryId = null;
                        // If frontend sends category_name instead of category_id for new ones
                        if (isset($choice['category_name']) && isset($categoryMap[$choice['category_name']])) {
                            $categoryId = $categoryMap[$choice['category_name']];
                        } elseif (isset($choice['dynamic_test_category_id'])) {
                            $categoryId = $choice['dynamic_test_category_id'];
                        }

                        $newQuestion->choices()->create([
                            'choice_text' => $choice['choice_text'],
                            'weight' => $choice['weight'] ?? 0,
                            'dynamic_test_category_id' => $categoryId,
                        ]);
                    }
                }
            }
        }

        return redirect()->back()->with('success', 'Tes dinamis berhasil diperbarui beserta konfigurasinya.');
    }

    public function destroy($id)
    {
        $test = DynamicTest::findOrFail($id);
        \App\Models\TestSetting::where('slug', $test->slug)->delete();
        $test->delete();
        return redirect()->back()->with('success', 'Tes dinamis berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids', []);
        $tests = DynamicTest::whereIn('id', $ids)->get();
        foreach ($tests as $test) {
            \App\Models\TestSetting::where('slug', $test->slug)->delete();
        }
        DynamicTest::whereIn('id', $ids)->delete();
        return redirect()->back()->with('success', count($ids) . ' tes dinamis berhasil dihapus.');
    }
}
