import AppLayout from '@/layouts/AppLayout';
import { RiCheckboxCircleFill, RiUser3Line } from '@remixicon/react';
import React from 'react';

interface Props {
    aboutContent: string;
    photo: string | null;
}

export default function Fikri({ aboutContent, photo }: Props) {
    return (
        <AppLayout title="Profil Fikri - UPA BK">
            <div className="pt-32 pb-24 px-6 lg:px-20 bg-slate-50 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="h-32 md:h-48 bg-gradient-to-r from-primary to-purple-800 relative">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                        </div>
                        
                        <div className="px-6 md:px-12 pb-12">
                            <div className="relative -mt-16 md:-mt-24 mb-8 flex flex-col md:flex-row md:items-end gap-6">
                                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-xl bg-white overflow-hidden shrink-0 mx-auto md:mx-0">
                                    {photo ? (
                                        <img src={photo} alt="Profil Fikri" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                            <RiUser3Line className="w-16 h-16 text-slate-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center md:text-left mb-2 md:mb-4">
                                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Fikri</h1>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
                                        <RiCheckboxCircleFill size={16} />
                                        Tim Pengembang UPA BK
                                    </span>
                                </div>
                            </div>
                            
                            <div 
                                className="prose prose-lg max-w-none w-full text-slate-600 prose-p:leading-relaxed overflow-hidden [&_*]:!whitespace-normal"
                                dangerouslySetInnerHTML={{ __html: (aboutContent || '<p>Tidak ada deskripsi.</p>').replace(/&nbsp;/g, ' ') }}
                            />
                        </div>
                    </div>
                    
                </div>
            </div>
        </AppLayout>
    );
}
