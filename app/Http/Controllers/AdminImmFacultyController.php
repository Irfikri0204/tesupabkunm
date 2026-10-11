<?php

namespace App\Http\Controllers;

use App\Models\ImmFaculty;
use App\Models\ImmGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminImmFacultyController extends Controller
{
    public function store(Request $request, ImmGroup $immGroup)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $immGroup->faculties()->create([
            'name' => $request->name,
        ]);

        return redirect()->back()->with('success', 'Fakultas berhasil ditambahkan.');
    }

    public function update(Request $request, ImmFaculty $immFaculty)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        $immFaculty->update($request->only('name', 'is_active'));
        return redirect()->back()->with('success', 'Fakultas berhasil diupdate.');
    }

    public function destroy(ImmFaculty $immFaculty)
    {
        $immFaculty->delete();
        return redirect()->back()->with('success', 'Fakultas berhasil dihapus.');
    }

    public function toggle(ImmFaculty $immFaculty)
    {
        $immFaculty->update(['is_active' => !$immFaculty->is_active]);
        return redirect()->back()->with('success', 'Status link fakultas berhasil diubah.');
    }
}
