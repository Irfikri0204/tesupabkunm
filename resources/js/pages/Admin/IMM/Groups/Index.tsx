import AdminLayout from '@/layouts/AdminLayout';
import { Link, useForm, router } from '@inertiajs/react';
import { RiAddLine, RiDeleteBinLine, RiEdit2Line, RiBarChartBoxLine, RiPrinterLine } from '@remixicon/react';
import React, { useState } from 'react';

export default function ImmGroupsIndex({ groups }: any) {
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        description: '',
        is_active: true,
    });

    const openCreate = () => {
        reset();
        setEditingId(null);
        setShowModal(true);
    };

    const openEdit = (group: any) => {
        setData({
            name: group.name,
            description: group.description || '',
            is_active: group.is_active,
        });
        setEditingId(group.id);
        setShowModal(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/admin/imm-groups/${editingId}`, {
                onSuccess: () => setShowModal(false)
            });
        } else {
            post(`/admin/imm-groups`, {
                onSuccess: () => setShowModal(false)
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus kelompok data ini? Seluruh data mahasiswa di kelompok ini tidak akan terhapus namun status kelompoknya menjadi kosong.')) {
            destroy(`/admin/imm-groups/${id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Kampus / Kelompok Data SIKOM">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden max-w-5xl mx-auto">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">Daftar Kampus / Kelompok SIKOM</h3>
                    <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95">
                        <RiAddLine size={18} /> Tambah Kampus Baru
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Nama Kampus / Kelompok</th>
                                <th className="px-6 py-4">Slug (URL)</th>
                                <th className="px-6 py-4 text-center">Jumlah Data</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {groups.map((group: any) => (
                                <tr key={group.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-700">{group.name}</div>
                                        {group.description && <div className="text-xs text-slate-500 mt-1">{group.description}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{group.slug}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-black text-blue-600 text-lg">{group.results_count}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${group.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {group.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <a href={`/admin/imm-groups/${group.id}/profiling-report`} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Cetak Laporan Profiling (PDF)">
                                                <RiPrinterLine size={18} />
                                            </a>
                                            <Link href={`/admin/imm-groups/${group.id}`} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors" title="Lihat Kelompok & Analitik">
                                                <RiBarChartBoxLine size={18} />
                                            </Link>
                                            <button onClick={() => openEdit(group)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                <RiEdit2Line size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(group.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                                                <RiDeleteBinLine size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {groups.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">Belum ada kelompok data kampus.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Create/Edit */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl animate-fade-in-up">
                        <h2 className="text-xl font-black text-slate-800 mb-6">{editingId ? 'Edit Kampus / Kelompok' : 'Tambah Kampus / Kelompok'}</h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Kampus <span className="text-red-500">*</span></label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="Contoh: Universitas Negeri Makassar" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi (Opsional)</label>
                                <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="Informasi tambahan..." />
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <input type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                <label htmlFor="is_active" className="font-bold text-slate-700 cursor-pointer">Status Aktif (Muncul di Form Identitas)</label>
                            </div>
                            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all">Batal</button>
                                <button type="submit" disabled={processing} className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 hover:shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50">Simpan Data</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
