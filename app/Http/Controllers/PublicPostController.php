<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicPostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::where('is_published', true)->latest();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
        }

        $posts = $query->paginate(9)->withQueryString();

        return Inertia::render('Postingan/Index', [
            'posts' => $posts,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show($slug)
    {
        $post = Post::where('slug', $slug)->where('is_published', true)->firstOrFail();
        
        return Inertia::render('Postingan/Show', [
            'post' => $post
        ]);
    }
}
