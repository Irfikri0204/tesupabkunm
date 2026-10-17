import AdminLayout from '@/layouts/AdminLayout';
import { Link, useForm, router } from '@inertiajs/react';
import { RiArrowLeftLine, RiPieChart2Fill, RiBuilding2Line, RiAddLine, RiEdit2Line, RiDeleteBinLine, RiFileCopyLine, RiCheckLine, RiToggleFill, RiToggleLine, RiDownloadLine, RiAlertFill, RiPrinterLine } from '@remixicon/react';
import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ImmList } from '../Index';
import FacultyStatsVisualizer from '@/Components/IMM/FacultyStatsVisualizer';
import DropoutStatsVisualizer from '@/Components/IMM/DropoutStatsVisualizer';

export default function Show({ group, faculties, facultyStats, totalResponses, classificationCounts, dropoutCounts, averages, students, filters }: any) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [copiedLink, setCopiedLink] = useState<string | null>(null);
    const [showFacultyModal, setShowFacultyModal] = useState(false);
    const [showProdiModal, setShowProdiModal] = useState(false);
    const [editingFacultyId, setEditingFacultyId] = useState<number | null>(null);
    const [editingProdiId, setEditingProdiId] = useState<number | null>(null);
    const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null);
    const [expandedFacultyId, setExpandedFacultyId] = useState<number | null>(null);

    const facultyForm = useForm({
        name: '',
        is_active: true,
    });

    const prodiForm = useForm({
        name: '',
        is_active: true,
    });

    const COLORS: Record<string, string> = {
        'Baik': '#10b981',
        'Perlu Perhatian': '#f59e0b',
        'Perlu Bantuan': '#ef4444',
        'Kondisi Baik': '#10b981',
        'Perlu Perhatian Khusus': '#f59e0b',
        'Perlu Bantuan Segera': '#ef4444',
        'Perlu Pendampingan': '#ef4444',
        'Risiko rendah': '#10b981',
        'Risiko sedang': '#f59e0b',
        'Risiko tinggi': '#ef4444',
    };

    // Normalize into 3 categories: Baik, Perlu Perhatian, Perlu Bantuan
    const normalizedClassificationCounts: Record<string, number> = {
        'Baik': (classificationCounts['Baik'] || 0) + (classificationCounts['Kondisi Baik'] || 0),
        'Perlu Perhatian': (classificationCounts['Perlu Perhatian'] || 0) + (classificationCounts['Perlu Perhatian Khusus'] || 0),
        'Perlu Bantuan': (classificationCounts['Perlu Bantuan'] || 0) + (classificationCounts['Perlu Pendampingan'] || 0) + (classificationCounts['Perlu Bantuan Segera'] || 0),
    };

    const classificationData = ['Baik', 'Perlu Perhatian', 'Perlu Bantuan']
        .map(key => ({
            name: key,
            value: normalizedClassificationCounts[key] || 0
        }))
        .filter(entry => entry.value > 0);

    const dropoutData = Object.keys(dropoutCounts).map(key => ({
        name: key,
        value: dropoutCounts[key]
    }));

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedLink(text);
        setTimeout(() => setCopiedLink(null), 2000);
    };

    const handleFacultySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFacultyId) {
            facultyForm.put(`/admin/imm-faculties/${editingFacultyId}`, {
                onSuccess: () => {
                    setShowFacultyModal(false);
                    facultyForm.reset();
                }
            });
        } else {
            facultyForm.post(`/admin/imm-groups/${group.id}/faculties`, {
                onSuccess: () => {
                    setShowFacultyModal(false);
                    facultyForm.reset();
                }
            });
        }
    };

    const handleProdiSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProdiId) {
            prodiForm.put(`/admin/imm-prodis/${editingProdiId}`, {
                onSuccess: () => {
                    setShowProdiModal(false);
                    prodiForm.reset();
                }
            });
        } else {
            prodiForm.post(`/admin/imm-faculties/${selectedFacultyId}/prodis`, {
                onSuccess: () => {
                    setShowProdiModal(false);
                    prodiForm.reset();
                }
            });
        }
    };

    const toggleFacultyStatus = (facultyId: number) => {
        router.patch(`/admin/imm-faculties/${facultyId}/toggle`);
    };

    const deleteFaculty = (id: number) => {
        if (confirm('Yakin ingin menghapus fakultas ini? Semua data prodi di dalamnya juga akan terhapus.')) {
            router.delete(`/admin/imm-faculties/${id}`);
        }
    };

    const deleteProdi = (id: number) => {
        if (confirm('Yakin ingin menghapus prodi ini?')) {
            router.delete(`/admin/imm-prodis/${id}`);
        }
    };

    return (
        <AdminLayout title={`Detail: ${group.name}`}>
            <div className="max-w-6xl mx-auto space-y-6">
                <Link href="/admin/imm-groups" className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold transition-colors">
                    <RiArrowLeftLine size={18} /> Kembali ke Daftar Kampus
                </Link>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black">{group.name}</h2>
                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                            <p className="text-white/80 font-medium bg-white/10 px-3 py-1 rounded-lg text-sm font-mono">
                                Link Tes: /{group.slug}
                            </p>
                            <button 
                                onClick={() => copyToClipboard(`${window.location.origin}/tes/identifikasi-masalah/${group.slug}`)}
                                className="text-white/80 hover:text-white transition-colors p-1"
                                title="Copy link tes"
                            >
                                {copiedLink === `${window.location.origin}/tes/identifikasi-masalah/${group.slug}` ? <RiCheckLine size={20} className="text-emerald-300" /> : <RiFileCopyLine size={20} />}
                            </button>
                        </div>
                        <div className="flex items-center gap-4 mt-1 flex-wrap">
                            <p className="text-white/80 font-medium bg-white/10 px-3 py-1 rounded-lg text-sm font-mono">
                                Laporan Publik: /laporan-imm/{group.slug}
                            </p>
                            <button 
                                onClick={() => copyToClipboard(`${window.location.origin}/laporan-imm/${group.slug}`)}
                                className="text-white/80 hover:text-white transition-colors p-1"
                                title="Copy link laporan publik"
                            >
                                {copiedLink === `${window.location.origin}/laporan-imm/${group.slug}` ? <RiCheckLine size={20} className="text-emerald-300" /> : <RiFileCopyLine size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur px-6 py-4 rounded-2xl text-center min-w-[150px]">
                        <p className="text-sm font-bold text-white/80 mb-1 uppercase tracking-widest">Total Responden</p>
                        <p className="text-4xl font-black">{totalResponses}</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-slate-200">
                    <div className="flex overflow-x-auto hide-scrollbar">
                        <button 
                            onClick={() => setActiveTab('dashboard')} 
                            className={`px-6 py-4 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                        >
                            Dashboard Analitik
                        </button>
                        <button 
                            onClick={() => setActiveTab('faculties')} 
                            className={`px-6 py-4 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'faculties' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                        >
                            Kelola & Statistik Fakultas
                        </button>
                        <button 
                            onClick={() => setActiveTab('students')} 
                            className={`px-6 py-4 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'students' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                        >
                            Data Mahasiswa
                        </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-end gap-2.5 px-4 py-3 sm:py-0">
                        <a
                            href={`/admin/imm-groups/${group.id}/profiling-report`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95"
                            title="Buka & Cetak Laporan Profiling Kelompok Asesmen (PDF)"
                        >
                            <RiPrinterLine size={16} /> Cetak Profiling (PDF)
                        </a>

                        <div className="relative group">
                            <button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:shadow-lg transition-all">
                                <RiDownloadLine size={16} /> Export Excel
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <div className="p-2">
                                    <p className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pilih Target Export</p>
                                    <a href={`/admin/imm-groups/${group.id}/export?faculty_id=all`} className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                                        Seluruh Kampus
                                    </a>
                                    <div className="my-1 border-t border-slate-100"></div>
                                    {faculties.map((f: any) => (
                                        <a key={f.id} href={`/admin/imm-groups/${group.id}/export?faculty_id=${f.id}`} className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors truncate">
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
                                <h3 className="text-xl font-bold text-slate-700">Belum ada data tes.</h3>
                                <p className="text-slate-500 mt-2">Sebarkan link tes ke mahasiswa {group.name} untuk melihat hasil analitik.</p>
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
                                                        {classificationData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={(COLORS as any)[entry.name] || '#94a3b8'} />
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
                                                        {dropoutData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={(COLORS as any)[entry.name] || '#94a3b8'} />
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
                                        <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pribadi</p>
                                            <p className="text-3xl font-black text-blue-600">{Number(averages.avg_pribadi).toFixed(1)}</p>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Sosial</p>
                                            <p className="text-3xl font-black text-indigo-600">{Number(averages.avg_sosial).toFixed(1)}</p>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Belajar</p>
                                            <p className="text-3xl font-black text-purple-600">{Number(averages.avg_belajar).toFixed(1)}</p>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Karier</p>
                                            <p className="text-3xl font-black text-pink-600">{Number(averages.avg_karier).toFixed(1)}</p>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Lainnya</p>
                                            <p className="text-3xl font-black text-rose-600">{Number(averages.avg_lainnya).toFixed(1)}</p>
                                        </div>
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
                            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                                <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">Daftar Fakultas</h3>
                                <button 
                                    onClick={() => {
                                        setEditingFacultyId(null);
                                        facultyForm.reset();
                                        setShowFacultyModal(true);
                                    }} 
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
                                >
                                    <RiAddLine size={18} /> Tambah Fakultas
                                </button>
                            </div>
                            
                            <div className="divide-y divide-slate-100">
                                {faculties.map((faculty: any) => (
                                    <div key={faculty.id} className="p-6 transition-colors hover:bg-slate-50/30">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="cursor-pointer flex-1" onClick={() => setExpandedFacultyId(expandedFacultyId === faculty.id ? null : faculty.id)}>
                                                <div className="flex items-center gap-3">
                                                    <h4 className="text-xl font-bold text-slate-800 hover:text-blue-600 transition-colors">{faculty.name}</h4>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${faculty.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                        {faculty.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <p className="text-slate-500 text-sm font-mono flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg" onClick={(e) => e.stopPropagation()}>
                                                        /{group.slug}/{faculty.slug}
                                                        <button 
                                                            onClick={() => copyToClipboard(`${window.location.origin}/tes/identifikasi-masalah/${group.slug}/${faculty.slug}`)}
                                                            className="text-slate-400 hover:text-blue-600"
                                                        >
                                                            {copiedLink === `${window.location.origin}/tes/identifikasi-masalah/${group.slug}/${faculty.slug}` ? <RiCheckLine size={16} className="text-emerald-500" /> : <RiFileCopyLine size={16} />}
                                                        </button>
                                                    </p>
                                                    <span className="text-sm font-bold text-slate-400 flex items-center gap-1">
                                                        <RiBuilding2Line size={16} /> {faculty.prodis.length} Prodi
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-400">
                                                        {faculty.results_count} Responden
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => toggleFacultyStatus(faculty.id)}
                                                    className={`p-2 rounded-xl transition-colors ${faculty.is_active ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}
                                                    title={faculty.is_active ? "Matikan Link" : "Aktifkan Link"}
                                                >
                                                    {faculty.is_active ? <RiToggleFill size={28} /> : <RiToggleLine size={28} />}
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setEditingFacultyId(faculty.id);
                                                        facultyForm.setData({ name: faculty.name, is_active: faculty.is_active });
                                                        setShowFacultyModal(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                >
                                                    <RiEdit2Line size={20} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteFaculty(faculty.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                >
                                                    <RiDeleteBinLine size={20} />
                                                </button>
                                                <button
                                                    onClick={() => setExpandedFacultyId(expandedFacultyId === faculty.id ? null : faculty.id)}
                                                    className={`px-4 py-2 font-bold text-sm rounded-xl transition-colors ml-2 ${
                                                        expandedFacultyId === faculty.id
                                                            ? 'bg-blue-600 text-white shadow-sm'
                                                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                    }`}
                                                >
                                                    {expandedFacultyId === faculty.id ? 'Tutup Detail' : 'Lihat Detail'}
                                                </button>
                                            </div>
                                        </div>

                                        {expandedFacultyId === faculty.id && (
                                            <div className="mt-6 bg-slate-50 rounded-2xl border border-slate-100 p-6 animate-fade-in-up space-y-8">
                                                <div>
                                                    <h5 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><RiPieChart2Fill size={18} className="text-blue-500"/> Statistik Masalah (5 Bidang) — {faculty.name}</h5>
                                                    <FacultyStatsVisualizer data={facultyStats[faculty.id]?.bidang} />
                                                </div>

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

                                                <div className="flex items-center justify-between mb-4 pt-4 border-t border-slate-200">
                                                    <h5 className="font-bold text-slate-800 flex items-center gap-2"><RiBuilding2Line size={18} className="text-blue-500"/> Daftar Program Studi</h5>
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedFacultyId(faculty.id);
                                                            setEditingProdiId(null);
                                                            prodiForm.reset();
                                                            setShowProdiModal(true);
                                                        }}
                                                        className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        <RiAddLine size={16} /> Tambah Prodi
                                                    </button>
                                                </div>

                                                {faculty.prodis.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {faculty.prodis.map((prodi: any) => (
                                                            <div key={prodi.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                                                <div>
                                                                    <p className="font-bold text-slate-800">{prodi.name}</p>
                                                                    <p className="text-xs text-slate-500 mt-1">{prodi.results_count} Responden</p>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <button 
                                                                        onClick={() => {
                                                                            setEditingProdiId(prodi.id);
                                                                            setSelectedFacultyId(faculty.id);
                                                                            prodiForm.setData({ name: prodi.name, is_active: prodi.is_active });
                                                                            setShowProdiModal(true);
                                                                        }}
                                                                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"
                                                                    >
                                                                        <RiEdit2Line size={16} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => deleteProdi(prodi.id)}
                                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                                                    >
                                                                        <RiDeleteBinLine size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-slate-400 italic bg-white p-4 rounded-xl border border-slate-100 text-center">Belum ada program studi di fakultas ini.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {faculties.length === 0 && (
                                    <div className="p-12 text-center">
                                        <RiBuilding2Line size={48} className="mx-auto text-slate-300 mb-4" />
                                        <p className="text-slate-500 font-medium">Belum ada fakultas yang ditambahkan ke kelompok ini.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="animate-fade-in-up">
                        <ImmList
                            data={students}
                            title="Data Mahasiswa Tes SIKOM"
                            deleteUrl={(id) => `/admin/imm/${id}`}
                            viewUrl={(id) => `/admin/imm/${id}`}
                            filterUrl={`/admin/imm-groups/${group.id}`}
                            filters={filters}
                            groupId={group.id}
                        />
                    </div>
                )}
            </div>

            {/* Modal Tambah/Edit Fakultas */}
            {showFacultyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl animate-fade-in-up">
                        <h2 className="text-xl font-black text-slate-800 mb-6">{editingFacultyId ? 'Edit Fakultas' : 'Tambah Fakultas'}</h2>
                        <form onSubmit={handleFacultySubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Fakultas <span className="text-red-500">*</span></label>
                                <input type="text" value={facultyForm.data.name} onChange={e => facultyForm.setData('name', e.target.value)} required className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="Contoh: Fakultas Ilmu Pendidikan" />
                                {facultyForm.errors.name && <p className="text-red-500 text-xs mt-1">{facultyForm.errors.name}</p>}
                            </div>
                            {editingFacultyId && (
                                <div className="flex items-center gap-3 mt-4">
                                    <input type="checkbox" id="faculty_active" checked={facultyForm.data.is_active} onChange={e => facultyForm.setData('is_active', e.target.checked)} className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                    <label htmlFor="faculty_active" className="font-bold text-slate-700 cursor-pointer">Status Aktif (Link bisa diakses)</label>
                                </div>
                            )}
                            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100">
                                <button type="button" onClick={() => setShowFacultyModal(false)} className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all">Batal</button>
                                <button type="submit" disabled={facultyForm.processing} className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 hover:shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50">Simpan Data</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Tambah/Edit Prodi */}
            {showProdiModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl animate-fade-in-up">
                        <h2 className="text-xl font-black text-slate-800 mb-6">{editingProdiId ? 'Edit Program Studi' : 'Tambah Program Studi'}</h2>
                        <form onSubmit={handleProdiSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Program Studi <span className="text-red-500">*</span></label>
                                <input type="text" value={prodiForm.data.name} onChange={e => prodiForm.setData('name', e.target.value)} required className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="Contoh: Pendidikan Teknik Informatika" />
                                {prodiForm.errors.name && <p className="text-red-500 text-xs mt-1">{prodiForm.errors.name}</p>}
                            </div>
                            {editingProdiId && (
                                <div className="flex items-center gap-3 mt-4">
                                    <input type="checkbox" id="prodi_active" checked={prodiForm.data.is_active} onChange={e => prodiForm.setData('is_active', e.target.checked)} className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                    <label htmlFor="prodi_active" className="font-bold text-slate-700 cursor-pointer">Status Aktif</label>
                                </div>
                            )}
                            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100">
                                <button type="button" onClick={() => setShowProdiModal(false)} className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all">Batal</button>
                                <button type="submit" disabled={prodiForm.processing} className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 hover:shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50">Simpan Data</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
