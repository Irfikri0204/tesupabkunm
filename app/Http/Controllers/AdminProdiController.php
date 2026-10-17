<?php

namespace App\Http\Controllers;

use App\Models\Prodi;
use Illuminate\Http\Request;

class AdminProdiController extends Controller
{
    public function store(Request $request)
    {
        if (auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'fakultas_id' => 'required|exists:fakultas,id',
            'name' => 'required|string|max:255',
        ]);

        Prodi::create($validated);

        return redirect()->back()->with('success', 'Program Studi / Jurusan berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        if (auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized action.');
        }

        $prodi = Prodi::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $prodi->update($validated);

        return redirect()->back()->with('success', 'Program Studi / Jurusan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        if (auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized action.');
        }

        Prodi::findOrFail($id)->delete();

        return redirect()->back()->with('success', 'Program Studi / Jurusan berhasil dihapus.');
    }
}
