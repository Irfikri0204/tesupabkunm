import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { RiMapPinLine, RiPhoneLine, RiMailSendLine, RiInstagramLine } from '@remixicon/react';

export default function Kontak({ contact }: { contact?: Record<string, string> }) {
    const formatAlamat = (alamat: string) => {
        if (!alamat || alamat === '-') return 'Alamat belum diatur';
        return alamat.split('\n').map((line, i) => (
            <React.Fragment key={i}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    return (
        <AppLayout>
            <section className="relative bg-primary pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-900 to-purple-900"></div>
                <div className="relative mx-auto max-w-7xl px-8 md:px-16 text-center text-white z-10">
                    <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-sm font-bold text-slate-900 shadow-md mb-4">
                        Hubungi Kami
                    </span>
                    <h1 className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
                        Kontak UPA BK
                    </h1>
                </div>
            </section>
            
            <section className="bg-slate-50 px-8 py-20 md:px-16">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Kami Siap Membantu Anda</h2>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            Jangan ragu untuk menghubungi kami jika Anda memiliki pertanyaan seputar layanan bimbingan konseling dan tes psikologi di Universitas Negeri Makassar.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {/* Lokasi */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <RiMapPinLine className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-3">Alamat Kantor</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{formatAlamat(contact?.address || '')}</p>
                        </div>

                        {/* Telepon */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <RiPhoneLine className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-3">Telepon / WhatsApp</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{contact?.phone || 'Belum diatur'}</p>
                        </div>

                        {/* Email */}
                        <a href={`mailto:${contact?.email || ''}`} className="block bg-white rounded-[2rem] p-8 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <RiMailSendLine className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-3">Email</h3>
                            <p className="text-slate-500 text-sm leading-relaxed group-hover:text-primary transition-colors">{contact?.email || 'Belum diatur'}</p>
                        </a>

                        {/* Instagram */}
                        <a href={`https://instagram.com/${(contact?.instagram || '').replace('@', '')}`} target="_blank" rel="noreferrer" className="block bg-white rounded-[2rem] p-8 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <RiInstagramLine className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-3">Instagram</h3>
                            <p className="text-slate-500 text-sm leading-relaxed group-hover:text-primary transition-colors">{contact?.instagram || 'Belum diatur'}</p>
                        </a>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
