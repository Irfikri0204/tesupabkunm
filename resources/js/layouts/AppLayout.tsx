import Header from '@/Components/Header';
import { PropsWithChildren } from 'react';
import { Head, Link } from '@inertiajs/react';
import { RiMailSendLine, RiPhoneLine, RiInstagramLine, RiMapPinLine, RiArrowRightSLine } from '@remixicon/react';

export default function AppLayout({ children, title }: PropsWithChildren<{ title?: string }>) {
    return (
        <>
            {title && <Head title={title} />}
            <Header />
            <main className="overflow-hidden bg-white">{children}</main>
            
            {/* Footer */}
            <footer className="bg-slate-50">
                <div className="relative bg-primary text-white pt-16 pb-12 overflow-hidden">
                    {/* Abstract Ornaments */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

                    <div className="relative max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 z-10">
                        {/* Column 1: Brand & Info */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="inline-block border border-white/20 rounded-full px-6 py-2.5 backdrop-blur-md bg-white/5 shadow-sm">
                                <span className="font-black text-xl tracking-wide">UPA BK UNM</span>
                            </div>
                            <p className="text-white/80 text-base leading-relaxed max-w-md">
                                Unit Pelaksana Akademik Layanan Bimbingan dan Konseling Universitas Negeri Makassar. Hadir secara profesional untuk mendukung kesehatan mental dan pengembangan akademik seluruh mahasiswa.
                            </p>
                        </div>
                        
                        {/* Column 2: Layanan */}
                        <div className="lg:col-span-3 space-y-6">
                            <h4 className="font-bold text-xl text-white tracking-wide">Layanan Kami</h4>
                            <ul className="space-y-4 text-white/80">
                                <li>
                                    <Link href="/konseling" className="group flex items-center gap-2 hover:text-secondary transition-colors font-medium">
                                        <RiArrowRightSLine className="w-5 h-5 text-white/30 group-hover:text-secondary transition-transform group-hover:translate-x-1" />
                                        Konseling Individu
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/profil-tim" className="group flex items-center gap-2 hover:text-secondary transition-colors font-medium">
                                        <RiArrowRightSLine className="w-5 h-5 text-white/30 group-hover:text-secondary transition-transform group-hover:translate-x-1" />
                                        Profil Konselor
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#tes" className="group flex items-center gap-2 hover:text-secondary transition-colors font-medium">
                                        <RiArrowRightSLine className="w-5 h-5 text-white/30 group-hover:text-secondary transition-transform group-hover:translate-x-1" />
                                        Asesmen
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/modul" className="group flex items-center gap-2 hover:text-secondary transition-colors font-medium">
                                        <RiArrowRightSLine className="w-5 h-5 text-white/30 group-hover:text-secondary transition-transform group-hover:translate-x-1" />
                                        Modul Pembelajaran
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Column 3: Kontak */}
                        <div className="lg:col-span-4 space-y-6">
                            <h4 className="font-bold text-xl text-white tracking-wide">Hubungi Kami</h4>
                            <ul className="space-y-6 text-white/80">
                                <li className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 shadow-inner">
                                        <RiMailSendLine className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div className="flex flex-col mt-0.5">
                                        <span className="text-xs text-white/50 uppercase font-bold tracking-widest mb-1">Email</span>
                                        <a href="mailto:upabk@unm.ac.id" className="hover:text-white transition-colors font-semibold text-base">upabk@unm.ac.id</a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 shadow-inner">
                                        <RiPhoneLine className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div className="flex flex-col mt-0.5">
                                        <span className="text-xs text-white/50 uppercase font-bold tracking-widest mb-1">Telepon</span>
                                        <span className="font-semibold text-base">+62 411 123456</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 shadow-inner">
                                        <RiInstagramLine className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div className="flex flex-col mt-0.5">
                                        <span className="text-xs text-white/50 uppercase font-bold tracking-widest mb-1">Instagram</span>
                                        <a href="https://instagram.com/upa_bk_unm" target="_blank" rel="noreferrer" className="hover:text-white transition-colors font-semibold text-base">@upabkunm</a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 shadow-inner">
                                        <RiMapPinLine className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div className="flex flex-col mt-0.5">
                                        <span className="text-xs text-white/50 uppercase font-bold tracking-widest mb-1">Alamat</span>
                                        <span className="font-semibold text-base leading-relaxed">Kampus UNM Gunung Sari<br />Makassar, Sulawesi Selatan</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                {/* Copyright Bar */}
                <div className="bg-white py-6 text-center border-t border-slate-100">
                    <p className="text-sm font-semibold text-slate-500">
                        &copy; 2026 <span className="text-primary font-black">UPA BK UNM</span> - Universitas Negeri Makassar. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
}
