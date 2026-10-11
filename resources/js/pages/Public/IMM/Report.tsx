import { Link, router } from '@inertiajs/react';
import { RiPieChart2Fill, RiBuilding2Line, RiArrowLeftLine, RiDashboardLine, RiDownloadLine, RiSearchLine, RiDeleteBinLine, RiEyeLine, RiArrowRightSLine, RiArrowLeftSLine, RiAlertFill } from '@remixicon/react';
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import FacultyStatsVisualizer from '@/Components/IMM/FacultyStatsVisualizer';
import DropoutStatsVisualizer from '@/Components/IMM/DropoutStatsVisualizer';
import StudentDetailModal from '@/Components/IMM/StudentDetailModal';

export default function Report({ group, faculties, facultyStats, totalResponses, classificationCounts, dropoutCounts, averages, students, filters }: any) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [expandedFacultyId, setExpandedFacultyId] = useState<number | null>(null);
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    const COLORS: Record<string, string> = {
        'Kondisi Baik': '#10b981',
        'Perlu Perhatian Khusus': '#f59e0b',
        'Perlu Bantuan Segera': '#ef4444',
        'Risiko rendah': '#10b981',
        'Risiko sedang': '#f59e0b',
        'Risiko tinggi': '#ef4444',
    };

    const classificationData = Object.keys(classificationCounts).map(key => ({
        name: key,
        value: classificationCounts[key]
    }));

    const dropoutData = Object.keys(dropoutCounts).map(key => ({
        name: key,
        value: dropoutCounts[key]
    }));

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(`/laporan-imm/${group.slug}`, { search }, { preserveState: true, preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <RiDashboardLine size={24} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tight text-slate-800 uppercase">Laporan SIK-M</h1>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{group.name}</p>
                        </div>
                    </div>
                    <Link href="/" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
                        <RiArrowLeftLine size={16} /> Beranda
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 mt-8 space-y-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-900/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black">{group.name}</h2>
                        <p className="text-white/80 mt-2 font-medium">Laporan Hasil Sistem Identifikasi Kondisi - Mahasiswa (SIK-M)</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur px-6 py-4 rounded-2xl text-center min-w-[150px]">
                        <p className="text-sm font-bold text-white/80 mb-1 uppercase tracking-widest">Total Responden</p>
                        <p className="text-4xl font-black">{totalResponses}</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-slate-200 bg-white rounded-t-3xl shadow-sm border-x border-t mt-8">
                    <div className="flex overflow-x-auto hide-scrollbar">
                        {['dashboard', 'faculties', 'students'].map((tab) => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)} 
                                className={`px-6 py-4 font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                            >
                                {tab === 'dashboard' ? 'Dashboard Analitik' : tab === 'faculties' ? 'Detail & Statistik Fakultas' : 'Data Mahasiswa'}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center justify-end px-4 py-3 sm:py-0">
                        <div className="relative group">
                            <button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:shadow-lg transition-all">
                                <RiDownloadLine size={16} /> Export Excel
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <div className="p-2">
                                    <p className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pilih Target Export</p>
                                    <a href={`/laporan-imm/${group.slug}/export?faculty_id=all`} className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                                        Seluruh Kampus
                                    </a>
                                    <div className="my-1 border-t border-slate-100"></div>
                                    {faculties.map((f: any) => (
                                        <a key={f.id} href={`/laporan-imm/${group.slug}/export?faculty_id=${f.id}`} className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors truncate">
                                            {f.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {activeTab === 'dashboard' && (
                    <div className="space-y-6 animate-fade-in-up">
                        {totalResponses === 0 ? (
                            <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-100">
                                <RiPieChart2Fill size={48} className="mx-auto text-slate-300 mb-4" />
                                <h3 className="text-xl font-bold text-slate-700">Belum ada data.</h3>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                                        <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight text-center">Distribusi Kondisi Mahasiswa</h3>
                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={classificationData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                        {classificationData.map((entry: any, index: number) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94a3b8'} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                                        <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight text-center">Risiko Putus Kuliah</h3>
                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={dropoutData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                        {dropoutData.map((entry: any, index: number) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94a3b8'} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                                    <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Rata-rata Skor Berdasarkan Bidang (Max: 45)</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {[
                                            { label: 'Pribadi', key: 'avg_pribadi', color: 'text-blue-600' },
                                            { label: 'Sosial', key: 'avg_sosial', color: 'text-indigo-600' },
                                            { label: 'Belajar', key: 'avg_belajar', color: 'text-purple-600' },
                                            { label: 'Karier', key: 'avg_karier', color: 'text-pink-600' },
                                            { label: 'Lainnya', key: 'avg_lainnya', color: 'text-rose-600' },
                                        ].map(item => (
                                            <div key={item.key} className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{item.label}</p>
                                                <p className={`text-3xl font-black ${item.color}`}>{Number(averages[item.key]).toFixed(1)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'faculties' && (
                    <div className="space-y-6 animate-fade-in-up">
                        {/* Overall Faculty Comparison Charts */}
                        {faculties.length > 0 && faculties.some((f: any) => f.results_count > 0) && (
                            <div className="space-y-6">
                                {/* 1. Overall Bidang Comparison Chart */}
                                <div className="p-6 bg-white rounded-[2rem] border border-slate-200/90 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                                        <div>
                                            <h4 className="text-base font-black flex items-center gap-2 text-slate-800">
                                                <RiPieChart2Fill size={18} className="text-blue-500" /> Perbandingan Masalah (5 Bidang) Antar Fakultas
                                            </h4>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Grafik perbandingan proporsi kondisi mahasiswa (Baik, Perlu Perhatian, Perlu Pendampingan) per bidang di setiap fakultas
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-xl">
                                            <span className="flex items-center gap-1.5 text-emerald-700"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Kondisi Baik</span>
                                            <span className="flex items-center gap-1.5 text-amber-700"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Perhatian</span>
                                            <span className="flex items-center gap-1.5 text-rose-700"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Pendampingan</span>
                                        </div>
                                    </div>
                                    <div className="h-72 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={faculties.map((f: any) => {
                                                    const fStats = facultyStats[f.id]?.bidang;
                                                    const areas = ['Pribadi', 'Sosial', 'Belajar', 'Karier', 'Lainnya'];
                                                    let baikTotal = 0, perhatianTotal = 0, pendampinganTotal = 0;
                                                    areas.forEach(a => {
                                                        baikTotal += fStats?.[a]?.Baik ?? 0;
                                                        perhatianTotal += fStats?.[a]?.Perhatian ?? 0;
                                                        pendampinganTotal += fStats?.[a]?.Pendampingan ?? 0;
                                                    });
                                                    return {
                                                        name: f.name.replace('Fakultas ', 'F. '),
                                                        'Kondisi Baik': baikTotal,
                                                        'Perlu Perhatian': perhatianTotal,
                                                        'Perlu Pendampingan': pendampinganTotal,
                                                    };
                                                })}
                                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#1e293b', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                                                <Bar dataKey="Kondisi Baik" stackId="a" fill="#10b981" />
                                                <Bar dataKey="Perlu Perhatian" stackId="a" fill="#f59e0b" />
                                                <Bar dataKey="Perlu Pendampingan" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* 2. Overall Faculty Dropout Comparison Chart */}
                                <div className="p-6 bg-white rounded-[2rem] border border-slate-200/90 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                                        <div>
                                            <h4 className="text-base font-black flex items-center gap-2 text-slate-800">
                                                <RiAlertFill size={18} className="text-rose-500" /> Perbandingan Risiko Putus Kuliah Antar Fakultas
                                            </h4>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Grafik komparasi jumlah mahasiswa berdasarkan 3 kategori risiko putus kuliah di seluruh fakultas
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-xl">
                                            <span className="flex items-center gap-1.5 text-emerald-700"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Rendah</span>
                                            <span className="flex items-center gap-1.5 text-amber-700"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Sedang</span>
                                            <span className="flex items-center gap-1.5 text-rose-700"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Tinggi</span>
                                        </div>
                                    </div>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={faculties.map((f: any) => ({
                                                    name: f.name.replace('Fakultas ', 'F. '),
                                                    'Risiko Rendah': facultyStats[f.id]?.dropout?.['Risiko rendah'] ?? 0,
                                                    'Risiko Sedang': facultyStats[f.id]?.dropout?.['Risiko sedang'] ?? 0,
                                                    'Risiko Tinggi': facultyStats[f.id]?.dropout?.['Risiko tinggi'] ?? 0,
                                                }))}
                                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#1e293b', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                                                <Bar dataKey="Risiko Rendah" stackId="a" fill="#10b981" />
                                                <Bar dataKey="Risiko Sedang" stackId="a" fill="#f59e0b" />
                                                <Bar dataKey="Risiko Tinggi" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="divide-y divide-slate-100">
                                {faculties.map((faculty: any) => (
                                    <div key={faculty.id} className="p-6 transition-colors hover:bg-slate-50/30">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer" onClick={() => setExpandedFacultyId(expandedFacultyId === faculty.id ? null : faculty.id)}>
                                            <div>
                                                <h4 className="text-xl font-bold text-slate-800">{faculty.name}</h4>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-sm font-bold text-slate-500 flex items-center gap-1">
                                                        <RiBuilding2Line size={16} /> {faculty.prodis.length} Prodi
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                                                        {faculty.results_count} Responden
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-sm rounded-xl transition-colors">
                                                {expandedFacultyId === faculty.id ? 'Tutup Detail' : 'Lihat Detail'}
                                            </button>
                                        </div>

                                        {expandedFacultyId === faculty.id && (
                                            <div className="mt-6 bg-slate-50 rounded-2xl border border-slate-100 p-6 animate-fade-in-up space-y-8">
                                                {/* Faculty-level stats: 5 Bidang */}
                                                <div>
                                                    <h5 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><RiPieChart2Fill size={18} className="text-blue-500"/> Statistik Masalah (5 Bidang) — {faculty.name}</h5>
                                                    <FacultyStatsVisualizer data={facultyStats[faculty.id]?.bidang} />
                                                </div>

                                                {/* Faculty-level stats: Dropout Risk */}
                                                <div>
                                                    <h5 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><RiAlertFill size={18} className="text-rose-500"/> Grafik Risiko Putus Kuliah — {faculty.name}</h5>
                                                    <DropoutStatsVisualizer data={facultyStats[faculty.id]?.dropout} />
                                                </div>

                                                {/* Per-Prodi Stats */}
                                                {faculty.prodis.length > 0 && faculty.prodis.some((p: any) => p.results_count > 0) && (
                                                    <div className="space-y-6 pt-4 border-t border-slate-200">
                                                        <h5 className="font-bold text-slate-800 flex items-center gap-2"><RiBuilding2Line size={18} className="text-indigo-500"/> Statistik per Program Studi</h5>
                                                        {faculty.prodis.filter((p: any) => p.results_count > 0).map((prodi: any) => (
                                                            <div key={prodi.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                                                                <p className="text-sm font-black text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block border border-indigo-100">
                                                                    {prodi.name} ({prodi.results_count} responden)
                                                                </p>
                                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sebaran Masalah 5 Bidang</p>
                                                                        <FacultyStatsVisualizer data={facultyStats[faculty.id]?.prodis?.[prodi.id]?.bidang} compact />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Risiko Putus Kuliah</p>
                                                                        <DropoutStatsVisualizer data={facultyStats[faculty.id]?.prodis?.[prodi.id]?.dropout} compact />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                            {/* Prodi list */}
                                            <div className="pt-4 border-t border-slate-200">
                                                <h5 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><RiBuilding2Line size={18} className="text-blue-500"/> Daftar Program Studi</h5>
                                                {faculty.prodis.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {faculty.prodis.map((prodi: any) => (
                                                            <div key={prodi.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                                                                <p className="font-bold text-slate-800">{prodi.name}</p>
                                                                <p className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{prodi.results_count} Responden</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-slate-400 italic bg-white p-4 rounded-xl border border-slate-100 text-center">Belum ada program studi.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {faculties.length === 0 && (
                                <div className="p-12 text-center">
                                    <RiBuilding2Line size={48} className="mx-auto text-slate-300 mb-4" />
                                    <p className="text-slate-500 font-medium">Belum ada data fakultas.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

                {activeTab === 'students' && (
                    <div className="animate-fade-in-up">
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">Data Mahasiswa</h3>
                                <form onSubmit={handleSearch} className="flex gap-2">
                                    <div className="relative">
                                        <RiSearchLine size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                            type="text" 
                                            value={search} 
                                            onChange={(e) => setSearch(e.target.value)} 
                                            placeholder="Cari nama, NIM..." 
                                            className="pl-10 pr-4 py-2 rounded-xl border-slate-200 bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 w-60"
                                        />
                                    </div>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">Cari</button>
                                </form>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-wider text-xs border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4">Nama</th>
                                            <th className="px-6 py-4">NIM</th>
                                            <th className="px-6 py-4">Fakultas</th>
                                            <th className="px-6 py-4">Prodi</th>
                                            <th className="px-6 py-4 text-center">Skor</th>
                                            <th className="px-6 py-4 text-center">Kategori</th>
                                            <th className="px-6 py-4 text-center">Putus Kuliah</th>
                                            <th className="px-6 py-4 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {students?.data?.map((s: any) => (
                                            <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-slate-700">{s.nama}</td>
                                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{s.nim}</td>
                                                <td className="px-6 py-4 text-slate-600">{s.fakultas}</td>
                                                <td className="px-6 py-4 text-slate-600">{s.program_studi}</td>
                                                <td className="px-6 py-4 text-center font-black text-blue-600">{s.total_score}/225</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        s.total_classification === 'Kondisi Baik' ? 'bg-emerald-100 text-emerald-700' :
                                                        s.total_classification === 'Perlu Perhatian Khusus' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                        {s.total_classification}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        s.dropout_risk_classification === 'Risiko rendah' || s.dropout_risk_classification === 'Aman' ? 'bg-emerald-100 text-emerald-700' :
                                                        s.dropout_risk_classification === 'Risiko sedang' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                        {s.dropout_risk_classification}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedStudent(s)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                                                        title="Lihat Detail Hasil Tes"
                                                    >
                                                        <RiEyeLine size={15} /> Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!students?.data || students.data.length === 0) && (
                                            <tr>
                                                <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium">Belum ada data mahasiswa.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {students?.links && students.links.length > 3 && (
                                <div className="p-4 border-t border-slate-100 flex items-center justify-center gap-1">
                                    {students.links.map((link: any, i: number) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            preserveScroll
                                            preserveState
                                            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : link.url
                                                    ? 'text-slate-600 hover:bg-slate-100'
                                                    : 'text-slate-300 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Student Detail Modal */}
            <StudentDetailModal
                student={selectedStudent}
                onClose={() => setSelectedStudent(null)}
            />
        </div>
    );
}
