<?php

namespace App\Http\Controllers;

use App\Models\TestSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTestSettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/TestSettings/Index', ['data' => TestSetting::all()]);
    }

    public function create()
    {
        return Inertia::render('Admin/TestSettings/Form');
    }

    public function store(Request $request)
    {
        $request->validate([
            'slug' => 'required|unique:test_settings,slug',
            'name' => 'required',
        ]);
        TestSetting::create($request->only('slug', 'name', 'is_open'));
        return redirect()->route('admin.test-settings.index')->with('success', 'Pengaturan tes berhasil ditambahkan.');
    }

    public function edit($id)
    {
        return Inertia::render('Admin/TestSettings/Form', ['model' => TestSetting::findOrFail($id)]);
    }

    public function update(Request $request, $id)
    {
        $setting = TestSetting::findOrFail($id);
        $setting->is_open = filter_var($request->input('is_open', $setting->is_open), FILTER_VALIDATE_BOOLEAN);
        if ($request->has('name')) $setting->name = $request->name;
        $setting->save();
        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        TestSetting::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Pengaturan berhasil dihapus.');
    }
}

