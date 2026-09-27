import AppLayout from '@/layouts/AppLayout';
import { router } from '@inertiajs/react';
import { RiSearchLine, RiDownloadLine, RiBookOpenLine, RiFileTextLine } from '@remixicon/react';
import React, { useState } from 'react';

export default function Index({ moduls, filters }: any) {
    const [search, setSearch] = useState(filters?.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/modul', { search }, { preserveState: true, replace: true });
    };

    const getFileIcon = (url: string) => {
        if (!url) return '📄';
        const ext = url.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return '📕';
        if (ext === 'ppt' || ext === 'pptx') return '📊';
        if (ext === 'doc' || ext === 'docx') return '📝';
        return '📄';
    };

    const stripHtml = (html: string) => {
        if (!html) return '';
        return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
    };

    return (
        <AppLayout title="Modul | UPA BK UNM">
            <div className="min-h-screen bg-slate-50 pb-20">
                {/* Hero */}
                <div className="bg-gradient-to-br from-indigo-800 to-primary text-white py-16 px-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,white,transparent)]" />
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <div className="flex justify-center mb-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                                <RiBookOpenLine size={32} className="text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Modul & Materi</h1>
                        <p className="text-purple-200 text-lg font-medium max-w-xl mx-auto">
                            Unduh materi, panduan, dan modul dari UPA BK UNM untuk mendukung pengembangan diri Anda.
                        </p>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="mt-8 flex max-w-lg mx-auto">
                            <div className="relative flex-1">
                                <RiSearchLine size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari modul..."
                                    className="w-full pl-12 pr-4 py-4 rounded-l-2xl text-slate-800 bg-white border-0 outline-none font-medium shadow-lg"
                                />
                            </div>
                            <button type="submit" className="bg-secondary text-slate-900 px-6 py-4 rounded-r-2xl font-black hover:bg-yellow-400 transition-colors shadow-lg">
                                Cari
                            </button>
                        </form>
                    </div>
                </div>

                {/* Modules Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                    {filters?.search && (
                        <div className="mb-8 flex items-center gap-2">
                            <p className="text-slate-600 font-medium">Hasil pencarian: <strong className="text-primary">"{filters.search}"</strong></p>
                            <button onClick={() => { setSearch(''); router.get('/modul'); }} className="text-sm text-slate-400 hover:text-red-500 underline ml-2">Hapus filter</button>
                        </div>
                    )}

                    {moduls.data.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-6xl mb-4">📚</p>
                            <h3 className="text-2xl font-black text-slate-700 mb-2">Belum ada modul</h3>
                            <p className="text-slate-500">Modul akan segera ditambahkan. Pantau terus!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {moduls.data.map((modul: any) => (
                                <div key={modul.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1 transition-all duration-300">
                                    {/* Cover */}
                                    <div className="h-40 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-200">
                                        {modul.cover_url ? (
                                            <img src={modul.cover_url} alt={modul.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center">
                                                <span className="text-6xl">{getFileIcon(modul.file_url)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h2 className="font-black text-slate-800 text-lg leading-snug mb-2 line-clamp-2">{modul.title}</h2>
                                        {modul.description && (
                                            <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{stripHtml(modul.description)}</p>
                                        )}
                                        <a
                                            href={modul.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors shadow-sm shadow-primary/20"
                                        >
                                            <RiDownloadLine size={18} />
                                            Unduh Modul
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {moduls.links && moduls.links.length > 3 && (
                        <div className="flex justify-center gap-2 mt-12">
                            {moduls.links.map((link: any, idx: number) => (
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
