import AppLayout from '@/Layouts/AppLayout';
import { RiOrganizationChart } from '@remixicon/react';

export default function StrukturOrganisasi({ struktur_organisasi_image }: { struktur_organisasi_image?: string }) {
    return (
        <AppLayout>
            <section className="relative bg-primary pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-900 to-purple-900"></div>
                <div className="relative mx-auto max-w-7xl px-8 md:px-16 text-center text-white z-10">
                    <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-sm font-bold text-slate-900 shadow-md mb-4">
                        Tentang Kami
                    </span>
                    <h1 className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
                        Struktur Organisasi
                    </h1>
                </div>
            </section>
            
            <section className="bg-slate-50 px-8 py-20 md:px-16">
                <div className="mx-auto max-w-5xl text-center">
                    <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8">
                            <RiOrganizationChart className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Struktur Organisasi UPA BK UNM</h2>
                        
                        {struktur_organisasi_image ? (
                            <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200 shadow-lg">
                                <img 
                                    src={struktur_organisasi_image} 
                                    alt="Bagan Struktur Organisasi UPA BK UNM" 
                                    className="w-full h-auto"
                                />
                            </div>
                        ) : (
                            <>
                                <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto mb-12">
                                    Bagan struktur organisasi saat ini sedang dalam pembaruan. Halaman ini akan segera diperbarui dengan bagan terbaru.
                                </p>
                                <div className="aspect-video w-full max-w-3xl mx-auto bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-4">
                                    <RiOrganizationChart className="w-16 h-16 opacity-50" />
                                    <span className="font-medium text-lg">Belum Ada Bagan Struktur Organisasi</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
