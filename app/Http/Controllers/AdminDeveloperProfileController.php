<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDeveloperProfileController extends Controller
{
    public function edit()
    {
        $content = SiteSetting::firstOrCreate(
            ['key' => 'developer_profile_content'],
            ['value' => '<p>Halo! Saya adalah pengembang utama di balik platform web Unit Penunjang Akademik Bimbingan dan Konseling Universitas Negeri Makassar. Saya sangat antusias dalam membangun aplikasi web yang modern, cepat, dan memiliki pengalaman pengguna (UI/UX) yang ramah serta interaktif.</p>', 'label' => 'Developer Profile Content', 'type' => 'text']
        );
        
        $photo = SiteSetting::firstOrCreate(
            ['key' => 'developer_profile_photo'],
            ['value' => null, 'label' => 'Developer Profile Photo', 'type' => 'image']
        );

        return Inertia::render('Admin/DeveloperProfile/Edit', [
            'content' => $content->value,
            'photo' => $photo->value ? asset('storage/' . $photo->value) : null,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        SiteSetting::updateOrCreate(
            ['key' => 'developer_profile_content'],
            ['value' => $request->content]
        );

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('developer', 'public');
            SiteSetting::updateOrCreate(
                ['key' => 'developer_profile_photo'],
                ['value' => $path]
            );
        }

        return redirect()->back()->with('success', 'Profil developer berhasil diperbarui.');
    }
}
