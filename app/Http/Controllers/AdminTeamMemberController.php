<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminTeamMemberController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/TeamMembers/Index', ['data' => TeamMember::orderBy('order')->paginate(20)]);
    }

    public function create()
    {
        return Inertia::render('Admin/TeamMembers/Form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'role'     => 'required|string|max:255',
            'division' => 'nullable|string|max:255',
            'faculty'  => 'nullable|string|max:255',
            'type'     => 'required|in:dosen,konselor-sebaya,relawan-disabilitas',
            'order'    => 'nullable|integer',
            'photo'    => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('team', 'public');
        }

        TeamMember::create($data);
        return redirect()->route('admin.team-members.index')->with('success', 'Anggota tim berhasil ditambahkan.');
    }

    public function edit($id)
    {
        return Inertia::render('Admin/TeamMembers/Form', ['model' => TeamMember::findOrFail($id)]);
    }

    public function update(Request $request, $id)
    {
        $member = TeamMember::findOrFail($id);

        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'role'     => 'required|string|max:255',
            'division' => 'nullable|string|max:255',
            'faculty'  => 'nullable|string|max:255',
            'type'     => 'required|in:dosen,konselor-sebaya,relawan-disabilitas',
            'order'    => 'nullable|integer',
            'photo'    => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($member->photo) {
                Storage::disk('public')->delete($member->photo);
            }
            $data['photo'] = $request->file('photo')->store('team', 'public');
        } else {
            unset($data['photo']);
        }

        $member->update($data);
        return redirect()->route('admin.team-members.index')->with('success', 'Anggota tim berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $member = TeamMember::findOrFail($id);
        if ($member->photo) {
            Storage::disk('public')->delete($member->photo);
        }
        $member->delete();
        return redirect()->back()->with('success', 'Anggota tim berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids', []);
        $members = TeamMember::whereIn('id', $ids)->get();
        foreach ($members as $member) {
            if ($member->photo) {
                Storage::disk('public')->delete($member->photo);
            }
            $member->delete();
        }
        return redirect()->back()->with('success', count($ids) . ' anggota tim berhasil dihapus.');
    }

    public function reorder(Request $request)
    {
        $orderedIds = $request->input('ids', []);
        foreach ($orderedIds as $order => $id) {
            TeamMember::where('id', $id)->update(['order' => $order + 1]);
        }
        return redirect()->back();
    }
}

