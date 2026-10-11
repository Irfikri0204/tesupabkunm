<?php

namespace App\Http\Controllers;

use App\Models\ImmFaculty;
use App\Models\ImmProdi;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminImmProdiController extends Controller
{
    public function store(Request $request, ImmFaculty $immFaculty)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $immFaculty->prodis()->create([
            'name' => $request->name,
        ]);

        return redirect()->back()->with('success', 'Program Studi/Jurusan berhasil ditambahkan.');
    }

    public function update(Request $request, ImmProdi $immProdi)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        $immProdi->update($request->only('name', 'is_active'));
        return redirect()->back()->with('success', 'Program Studi/Jurusan berhasil diupdate.');
    }

    public function destroy(ImmProdi $immProdi)
    {
        $immProdi->delete();
        return redirect()->back()->with('success', 'Program Studi/Jurusan berhasil dihapus.');
    }
}
