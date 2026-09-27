import AppLayout from '@/Layouts/AppLayout';
import { RiFocus2Line, RiEyeLine } from '@remixicon/react';

export default function VisiMisi({ visi_text, misi_text }: { visi_text?: string, misi_text?: string }) {
    return (
        <AppLayout>
            <section className="relative bg-primary pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-900 to-purple-900"></div>
                <div className="relative mx-auto max-w-7xl px-8 md:px-16 text-center text-white z-10">
                    <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-sm font-bold text-slate-900 shadow-md mb-4">
                        Tentang Kami
                    </span>
                    <h1 className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
                        Visi & Misi
                    </h1>
                </div>
            </section>
            
            <section className="bg-slate-50 px-8 py-20 md:px-16">
                <div className="mx-auto max-w-4xl space-y-16">
                    {/* Visi */}
                    <div className="bg-white rounded-[2rem] p-10 md:p-14 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 items-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary group-hover:text-white">
                            <RiEyeLine className="w-12 h-12" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">Visi</h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {visi_text || "Belum ada data visi."}
                            </p>
                        </div>
                    </div>

                    {/* Misi */}
                    <div className="bg-white rounded-[2rem] p-10 md:p-14 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 items-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                         <div className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center text-amber-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:bg-secondary group-hover:text-slate-900">
                            <RiFocus2Line className="w-12 h-12" />
                        </div>
                        <div className="flex-1 w-full overflow-hidden">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors">Misi</h2>
                            {misi_text ? (
                                <div 
                                    className="prose prose-slate prose-lg max-w-none prose-li:marker:text-primary text-slate-600"
                                    dangerouslySetInnerHTML={{ __html: misi_text }}
                                />
                            ) : (
                                <p className="text-slate-600 leading-relaxed text-lg">Belum ada data misi.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
