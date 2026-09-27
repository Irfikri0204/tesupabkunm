<?php

namespace App\Http\Controllers;

use App\Models\Modul;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicModulController extends Controller
{
    public function index(Request $request)
    {
        $query = Modul::where('is_published', true)->latest();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        $moduls = $query->paginate(9)->withQueryString();

        return Inertia::render('Modul/Index', [
            'moduls' => $moduls,
            'filters' => $request->only(['search']),
        ]);
    }
}
