<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LinkedWebsite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LinkedWebsiteController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/LinkedWebsites/Index', [
            'websites' => LinkedWebsite::orderBy('order')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'url' => 'required|url',
            'is_active' => 'boolean',
        ]);

        $data['order'] = LinkedWebsite::max('order') + 1;
        LinkedWebsite::create($data);

        return back()->with('success', 'Website berhasil ditambahkan.');
    }

    public function update(Request $request, LinkedWebsite $linkedWebsite)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'url' => 'required|url',
            'is_active' => 'boolean',
        ]);

        $linkedWebsite->update($data);

        return back()->with('success', 'Website berhasil diperbarui.');
    }

    public function destroy(LinkedWebsite $linkedWebsite)
    {
        $linkedWebsite->delete();

        return back()->with('success', 'Website berhasil dihapus.');
    }
}
