<?php

namespace App\Http\Controllers;

use App\Models\Fakultas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminFakultasController extends Controller
{
    public function index()
    {
        if (auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized action.');
        }

        $fakultas = Fakultas::orderBy('name')->get();
        return Inertia::render('Admin/Fakultas/Index', ['fakultas' => $fakultas]);
    }

    public function store(Request $request)
    {
        if (auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:fakultas,name',
        ]);

        Fakultas::create($validated);

        return redirect()->back()->with('success', 'Fakultas berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        if (auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized action.');
        }

        $fakultas = Fakultas::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:fakultas,name,' . $id,
        ]);

        $fakultas->update($validated);

        return redirect()->back()->with('success', 'Fakultas berhasil diperbarui.');
    }

    public function destroy($id)
    {
        if (auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized action.');
        }

        Fakultas::findOrFail($id)->delete();

        return redirect()->back()->with('success', 'Fakultas berhasil dihapus.');
    }
}
