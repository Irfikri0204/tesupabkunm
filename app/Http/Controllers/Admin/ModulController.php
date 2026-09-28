<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Modul;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ModulController extends Controller
{
    public function index()
    {
        $moduls = Modul::latest()->get();
        return Inertia::render('Admin/Modules/Index', [
            'data' => $moduls
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Modules/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file_path' => 'required|file|mimes:pdf,doc,docx,ppt,pptx|max:10240', // max 10MB
            'cover_image' => 'nullable|image|max:2048',
            'is_published' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . time();
        
        $validated['file_path'] = $request->file('file_path')->store('modules/files', 'public');

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('modules/covers', 'public');
        }

        Modul::create($validated);
        return redirect()->route('admin.moduls.index')->with('success', 'Modul berhasil diunggah.');
    }

    public function edit(Modul $modul)
    {
        return Inertia::render('Admin/Modules/Form', [
            'model' => $modul
        ]);
    }

    public function update(Request $request, Modul $modul)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file_path' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:10240',
            'cover_image' => 'nullable|image|max:2048',
            'is_published' => 'boolean',
        ]);

        if ($validated['title'] !== $modul->title) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . time();
        }

        if ($request->hasFile('file_path')) {
            Storage::disk('public')->delete($modul->file_path);
            $validated['file_path'] = $request->file('file_path')->store('modules/files', 'public');
        }

        if ($request->hasFile('cover_image')) {
            if ($modul->cover_image) {
                Storage::disk('public')->delete($modul->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('modules/covers', 'public');
        }

        $modul->update($validated);
        return redirect()->route('admin.moduls.index')->with('success', 'Modul berhasil diperbarui.');
    }

    public function destroy(Modul $modul)
    {
        Storage::disk('public')->delete($modul->file_path);
        if ($modul->cover_image) {
            Storage::disk('public')->delete($modul->cover_image);
        }
        $modul->delete();
        return redirect()->route('admin.moduls.index')->with('success', 'Modul berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids', []);
        if (empty($ids)) return redirect()->back();

        $moduls = Modul::whereIn('id', $ids)->get();
        foreach ($moduls as $modul) {
            Storage::disk('public')->delete($modul->file_path);
            if ($modul->cover_image) {
                Storage::disk('public')->delete($modul->cover_image);
            }
            $modul->delete();
        }

        return redirect()->back()->with('success', count($ids) . ' modul berhasil dihapus.');
    }
}
