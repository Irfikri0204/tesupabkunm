import AppLayout from '@/layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { RiCalendarLine, RiArrowLeftLine, RiTimeLine } from '@remixicon/react';
import React from 'react';

export default function Show({ post }: any) {
    const formattedDate = new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <AppLayout title={`${post.title} | UPA BK UNM`}>
            <div className="min-h-screen bg-slate-50 pb-20">
                {/* Hero / Cover */}
                <div className="relative w-full h-[40vh] min-h-[300px] md:h-[50vh] bg-slate-900 overflow-hidden">
                    {post.cover_url ? (
                        <>
                            <img src={post.cover_url} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-primary opacity-80"></div>
                    )}
                    
                    <div className="absolute inset-0 flex items-end">
                        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-20 md:pb-32">
                            <Link href="/berita" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold transition-colors mb-6 text-sm backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
                                <RiArrowLeftLine size={16} /> Kembali ke Artikel
                            </Link>
                            
                            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6 max-w-4xl drop-shadow-lg">
                                {post.title}
                            </h1>
                            
                            <div className="flex items-center gap-4 text-white/90 text-sm font-semibold">
                                <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                    <RiCalendarLine size={16} />
                                    {formattedDate}
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                    <RiTimeLine size={16} />
                                    <span>5 menit baca</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 md:-mt-24 relative z-10">
                    <div className="flex flex-col gap-8">
                        {/* Main Content */}
                        <article className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden p-6 sm:p-10 md:p-12">
                            <div
                                className="prose prose-lg md:prose-xl max-w-none prose-headings:font-black prose-headings:text-slate-800 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-primary prose-a:font-bold hover:prose-a:text-purple-700 prose-img:rounded-3xl prose-img:shadow-xl prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-purple-50/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:text-slate-700 prose-blockquote:font-medium prose-blockquote:italic"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </article>
                        
                        {/* CTA Widget */}
                        <div className="bg-gradient-to-br from-primary to-indigo-800 rounded-[2rem] p-8 sm:p-12 text-center text-white shadow-xl shadow-primary/20">
                            <h3 className="text-2xl sm:text-3xl font-black mb-4">Butuh Teman Cerita?</h3>
                            <p className="text-purple-100 mb-8 sm:text-lg leading-relaxed max-w-2xl mx-auto">
                                Tim konselor sebaya dan profesional kami selalu siap mendengarkan tanpa menghakimi. Rahasia Anda aman bersama kami.
                            </p>
                            <a
                                href="https://s.id/layanankonselinguptlbkunm"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center bg-secondary text-slate-900 font-black px-10 py-4 rounded-xl hover:bg-yellow-400 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-secondary/30"
                            >
                                Jadwalkan Sesi Sekarang
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
