import AppLayout from '@/layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { RiSearchLine, RiCalendarLine, RiArrowRightLine } from '@remixicon/react';
import React, { useState } from 'react';

export default function Index({ posts, filters }: any) {
    const [search, setSearch] = useState(filters?.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/berita', { search }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout title="Berita | UPA BK UNM">
            <div className="min-h-screen bg-slate-50 pb-20">
                {/* Hero */}
                <div className="bg-gradient-to-br from-primary to-indigo-800 text-white py-16 px-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,white,transparent)]" />
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Berita & Artikel</h1>
                        <p className="text-purple-200 text-lg font-medium max-w-xl mx-auto">
                            Baca tips, informasi, dan wawasan seputar kesehatan mental, konseling, dan pengembangan diri.
                        </p>

                        {/* Search bar */}
                        <form onSubmit={handleSearch} className="mt-8 flex max-w-lg mx-auto">
                            <div className="relative flex-1">
                                <RiSearchLine size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari artikel..."
                                    className="w-full pl-12 pr-4 py-4 rounded-l-2xl text-slate-800 bg-white border-0 outline-none font-medium shadow-lg"
                                />
                            </div>
                            <button type="submit" className="bg-secondary text-slate-900 px-6 py-4 rounded-r-2xl font-black hover:bg-yellow-400 transition-colors shadow-lg">
                                Cari
                            </button>
                        </form>
                    </div>
                </div>

                {/* Posts Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                    {filters?.search && (
                        <div className="mb-8 flex items-center gap-2">
                            <p className="text-slate-600 font-medium">Hasil pencarian untuk: <strong className="text-primary">"{filters.search}"</strong></p>
                            <button onClick={() => { setSearch(''); router.get('/berita'); }} className="text-sm text-slate-400 hover:text-red-500 underline ml-2">Hapus filter</button>
                        </div>
                    )}

                    {posts.data.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-6xl mb-4">📭</p>
                            <h3 className="text-2xl font-black text-slate-700 mb-2">Belum ada berita</h3>
                            <p className="text-slate-500">Konten akan segera hadir. Pantau terus!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.data.map((post: any) => (
                                <Link key={post.id} href={`/berita/${post.slug}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1 transition-all duration-300">
                                    {/* Cover */}
                                    <div className="h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-200">
                                        {post.cover_url ? (
                                            <img src={post.cover_url} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center">
                                                <span className="text-5xl">📰</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
                                            <RiCalendarLine size={14} />
                                            {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <h2 className="font-black text-slate-800 text-lg leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                        <div className="flex items-center gap-1 text-primary font-bold text-sm">
                                            Baca Selengkapnya <RiArrowRightLine size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {posts.links && posts.links.length > 3 && (
                        <div className="flex justify-center gap-2 mt-12">
                            {posts.links.map((link: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => link.url && router.visit(link.url)}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${link.active ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'} disabled:opacity-40 disabled:cursor-not-allowed`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
