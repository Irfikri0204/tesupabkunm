<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSiteSettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/SiteSettings/Index', ['data' => SiteSetting::all()]);
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
        return redirect()->route('admin.site-settings.index');
    }

    public function destroy($id)
    {
        SiteSetting::findOrFail($id)->delete();
        return redirect()->back();
    }
}
