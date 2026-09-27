import AdminLayout from '@/layouts/AdminLayout';
import { RiUserHeartLine, RiBrainLine, RiTestTubeLine, RiMentalHealthLine, RiFileList3Line, RiTeamLine } from '@remixicon/react';
import React from 'react';

interface DashboardProps {
    metrics: {
        total_gaya_belajar: number;
        total_kecerdasan_majemuk: number;
        total_panas: number;
        total_srq20: number;
        total_swls: number;
        total_team: number;
    }
}

export default function Dashboard({ metrics }: DashboardProps) {
    const cards = [
        { title: 'Gaya Belajar', count: metrics.total_gaya_belajar, icon: <RiUserHeartLine size={28} />, color: 'from-pink-500 to-rose-500' },
        { title: 'Kecerdasan Majemuk', count: metrics.total_kecerdasan_majemuk, icon: <RiBrainLine size={28} />, color: 'from-purple-500 to-indigo-500' },
        { title: 'Tes Panas', count: metrics.total_panas, icon: <RiTestTubeLine size={28} />, color: 'from-orange-400 to-red-500' },
        { title: 'Kesehatan Mental (SRQ-20)', count: metrics.total_srq20, icon: <RiMentalHealthLine size={28} />, color: 'from-teal-400 to-emerald-500' },
        { title: 'Kepuasan Hidup (SWLS)', count: metrics.total_swls, icon: <RiFileList3Line size={28} />, color: 'from-blue-400 to-cyan-500' },
        { title: 'Total Tim & Konselor', count: metrics.total_team, icon: <RiTeamLine size={28} />, color: 'from-slate-700 to-slate-900' },
    ];

    return (
        <AdminLayout title="Dashboard Overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card, idx) => (
                    <div 
                        key={idx} 
                        className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-transform cursor-pointer group relative overflow-hidden"
                    >
                        <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${card.color} rounded-full opacity-10 group-hover:scale-150 group-hover:opacity-20 transition-all duration-500 ease-out`} />
                        <div className="flex items-center gap-5 relative z-10">
                            <div className={`flex w-16 h-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg`}>
                                {card.icon}
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{card.count}</h3>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{card.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                {/* Decorative */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-yellow-300 rounded-full blur-[80px] opacity-20 pointer-events-none" />
                
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-indigo-800 tracking-tight mb-4">
                    Selamat Datang di Dasbor Baru!
                </h2>
                <p className="text-slate-600 font-medium leading-relaxed max-w-3xl">
                    Dasbor ini telah diperbarui dengan antarmuka yang lebih interaktif, mewah, dan sesuai dengan tema situs. Anda dapat mengelola semua data tes, tim, serta pengaturan situs melalui menu di sebelah kiri.
                </p>
                <div className="mt-8 flex gap-4">
                    <a href="/" target="_blank" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition shadow-lg shadow-slate-900/20">
                        Lihat Situs
                    </a>
                </div>
            </div>
        </AdminLayout>
    );
}
