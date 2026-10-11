import { Link, usePage } from '@inertiajs/react';
import { RiDashboardLine, RiTeamLine, RiSettings3Line, RiLogoutBoxRLine, RiMentalHealthLine, RiUserHeartLine, RiBrainLine, RiTestTubeLine, RiFileList3Line, RiSurveyLine, RiArticleLine, RiBookOpenLine, RiGlobalLine, RiEmotionLine, RiHeartPulseLine, RiMindMap, RiCodeSSlashLine } from '@remixicon/react';
import React, { useState } from 'react';

export default function AdminLayout({ children, title }: { children: React.ReactNode, title?: string }) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <RiDashboardLine size={20} /> },
        { name: 'Tim & Konselor', path: '/admin/team-members', icon: <RiTeamLine size={20} /> },
        { name: 'Daftar Konseling', path: '/admin/konseling', icon: <RiUserHeartLine size={20} /> },
        { name: 'Tentang Kami', path: '/admin/tentang-kami', icon: <RiArticleLine size={20} /> },
        { name: 'Berita', path: '/admin/posts', icon: <RiArticleLine size={20} /> },
        { name: 'Modul', path: '/admin/moduls', icon: <RiBookOpenLine size={20} /> },
        { name: 'Web Lainnya', path: '/admin/linked-websites', icon: <RiGlobalLine size={20} /> },
        { name: 'Pengaturan Tes', path: '/admin/test-settings', icon: <RiSettings3Line size={20} /> },
        { name: 'Kontak', path: '/admin/site-settings', icon: <RiSettings3Line size={20} /> },
    ];

    const testMenuItems = [
        { name: 'Identifikasi Kondisi (SIK-M)', path: '/admin/imm-groups', icon: <RiSurveyLine size={20} /> },
        { name: 'Gaya Belajar', path: '/admin/gaya-belajar', icon: <RiBookOpenLine size={20} /> },
        { name: 'Pola Emosi', path: '/admin/panas', icon: <RiEmotionLine size={20} /> },
        { name: 'Kepuasan Hidup', path: '/admin/swls', icon: <RiHeartPulseLine size={20} /> },
        { name: 'Kesehatan Mental', path: '/admin/srq20', icon: <RiMentalHealthLine size={20} /> },
        { name: 'Kecerdasan Majemuk', path: '/admin/kecerdasan-majemuk', icon: <RiMindMap size={20} /> },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white border-r border-slate-200 shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex h-full flex-col">
                    <div className="flex items-center p-6 border-b border-slate-100">
                        <div className="w-10 h-10 bg-purple-50 text-primary rounded-xl flex items-center justify-center mr-3">
                            <RiDashboardLine size={24} />
                        </div>
                        <h1 className="text-lg font-black tracking-wide text-slate-800 uppercase">
                            Admin UPA
                        </h1>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                        <p className="px-4 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Menu Manajemen</p>
                        {menuItems.map((item) => {
                            const isActive = url.startsWith(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                                        isActive 
                                        ? 'bg-purple-50 text-primary font-bold' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-primary font-medium'
                                    }`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            );
                        })}

                        {usePage().props.auth?.user?.email === 'fikrianggara72@gmail.com' && (
                            <Link
                                href="/admin/developer-profile"
                                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                                    url.startsWith('/admin/developer-profile')
                                    ? 'bg-purple-50 text-primary font-bold' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-primary font-medium'
                                }`}
                            >
                                <RiCodeSSlashLine size={20} />
                                Kelola Developer
                            </Link>
                        )}
                        
                        {usePage().props.auth?.user?.role === 'superadmin' && (
                            <>
                                <Link
                                    href="/admin/fakultas"
                                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                                        url.startsWith('/admin/fakultas')
                                        ? 'bg-purple-50 text-primary font-bold' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-primary font-medium'
                                    }`}
                                >
                                    <RiBookOpenLine size={20} />
                                    Fakultas
                                </Link>
                                <Link
                                    href="/admin/konseling-info"
                                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                                        url.startsWith('/admin/konseling-info')
                                        ? 'bg-purple-50 text-primary font-bold' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-primary font-medium'
                                    }`}
                                >
                                    <RiUserHeartLine size={20} />
                                    Info Konseling
                                </Link>
                            </>
                        )}
                        <div className="my-6"></div>
                        <p className="px-4 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Hasil Tes Built-in</p>
                        {testMenuItems.map((item) => {
                            const isActive = url.startsWith(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                                        isActive 
                                        ? 'bg-purple-50 text-primary font-bold' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-primary font-medium'
                                    }`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                        <Link 
                            href="/admin/logout" 
                            method="post" 
                            as="button"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-red-600 transition-colors hover:bg-red-500 hover:text-white hover:border-red-500 font-bold"
                        >
                            <RiLogoutBoxRLine size={20} />
                            Keluar Sistem
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex flex-1 flex-col overflow-hidden relative">
                {/* Header */}
                <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8 z-10">
                    <div className="flex items-center gap-4">
                        <button 
                            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 md:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                            {title || 'Overview'}
                        </h2>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
