<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSiteSettingController extends Controller
{
    public function index()
    {
        $contactKeys = ['whatsapp_number', 'email', 'address', 'phone', 'instagram_url'];
        $data = SiteSetting::whereIn('key', $contactKeys)->get();

        // Jika belum ada, buat default
        foreach ($contactKeys as $key) {
            if (!$data->contains('key', $key)) {
                $setting = SiteSetting::create([
                    'key' => $key,
                    'label' => ucwords(str_replace('_', ' ', $key)),
                    'value' => ''
                ]);
                $data->push($setting);
            }
        }

        return Inertia::render('Admin/SiteSettings/Index', ['data' => $data]);
    }

    public function create()
    {
        return Inertia::render('Admin/SiteSettings/Form');
    }

    public function store(Request $request)
    {
        SiteSetting::create($request->all());
        return redirect()->route('admin.site-settings.index');
    }
    
    public function edit($id)
    {
        return Inertia::render('Admin/SiteSettings/Form', ['model' => SiteSetting::findOrFail($id)]);
    }

    public function update(Request $request, $id)
    {
        SiteSetting::findOrFail($id)->update($request->all());
        return redirect()->back()->with('success', 'Kontak berhasil diperbarui.');
    }

    public function destroy($id)
    {
        SiteSetting::findOrFail($id)->delete();
        return redirect()->back();
    }
}
