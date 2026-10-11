import AdminLayout from '@/layouts/AdminLayout';
import { Link, router, useForm } from '@inertiajs/react';
import { RiDeleteBinLine, RiDownloadLine, RiEyeLine, RiCheckboxLine, RiCheckboxBlankLine, RiSearchLine, RiBarChartBoxLine } from '@remixicon/react';
import React, { useState } from 'react';

export function ImmList({ data, groups = [], title, exportUrl, deleteUrl, viewUrl, filters, filterUrl, groupId }: {
    data: any;
    groups?: any[];
    title: string;
    exportUrl?: string;
    deleteUrl: (id: number) => string;
    viewUrl?: (id: number) => string;
    filters?: { search?: string, group?: string };
    filterUrl: string;
    groupId?: number | string;
}) {
    const [selected, setSelected] = useState<number[]>([]);
    const [search, setSearch] = useState(filters?.search ?? '');
    const [groupFilter, setGroupFilter] = useState(filters?.group ?? '');
    const allIds: number[] = data.data.map((item: any) => item.id);
    const allSelected = allIds.length > 0 && allIds.every((id: number) => selected.includes(id));
    const { delete: destroy } = useForm();

    const toggleAll = () => setSelected(allSelected ? [] : allIds);
    const toggleOne = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus data ini?')) {
            destroy(deleteUrl(id), { onSuccess: () => setSelected(prev => prev.filter(x => x !== id)) });
        }
    };

    const handleBulkDelete = () => {
        if (selected.length === 0) return;
        if (!confirm(`Yakin ingin menghapus ${selected.length} data yang dipilih?`)) return;
        const base = deleteUrl(0).replace('/0', '');
        router.post(`${base}/bulk-delete`, { ids: selected }, { onSuccess: () => setSelected([]) });
    };

    const handleClearAll = () => {
        if (!data.total || data.total === 0) {
            alert('Tidak ada data untuk dihapus.');
            return;
        }
        const confirmMessage = (groupId || groupFilter)
            ? 'PERINGATAN: Apakah Anda yakin ingin menghapus SELURUH data hasil tes untuk kelompok ini? Tindakan ini tidak dapat dibatalkan.'
            : 'PERINGATAN: Apakah Anda yakin ingin menghapus SELURUH data hasil tes SIK-M? Tindakan ini tidak dapat dibatalkan.';
        if (!confirm(confirmMessage)) return;
        if (!confirm('Konfirmasi sekali lagi: Semua data yang terhapus TIDAK dapat dipulihkan. Lanjutkan penghapusan?')) return;

        router.post('/admin/imm/clear-all', {
            group_id: groupId || groupFilter || ''
        }, {
            onSuccess: () => setSelected([])
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(filterUrl, { search, group: groupFilter }, { preserveState: true, replace: true });
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">{title}</h3>
                    {selected.length > 0 && (
                        <button onClick={handleBulkDelete} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow active:scale-95">
                            <RiDeleteBinLine size={16} /> Hapus {selected.length} Data Terpilih
                        </button>
                    )}
                    {data.total > 0 && (
                        <button onClick={handleClearAll} className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95" title="Hapus seluruh data hasil tes">
                            <RiDeleteBinLine size={16} /> Hapus Semua Data
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex items-center gap-2 flex-wrap">
                        {groups.length > 0 && (
                            <select 
                                value={groupFilter} 
                                onChange={e => setGroupFilter(e.target.value)} 
                                className="py-2 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                            >
                                <option value="">Semua Kampus</option>
                                {groups.map((g) => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>
                        )}
                        <div className="relative">
                            <RiSearchLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari nama, NIM, kategori..."
                                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 w-60 transition-all"
                            />
                        </div>
                        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors">Cari</button>
                        {(filters?.search || filters?.group) && (
                            <button type="button" onClick={() => { setSearch(''); setGroupFilter(''); router.get(filterUrl, {}, { preserveState: true, replace: true }); }}
                                className="px-3 py-2 bg-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-300 transition-colors">Reset</button>
                        )}
                    </form>
                    {exportUrl && (
                        <a href={exportUrl} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:shadow-lg transition-all">
                            <RiDownloadLine size={16} /> Export Excel
                        </a>
                    )}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-4 w-12">
                                <button onClick={toggleAll} className="text-slate-400 hover:text-purple-600 transition-colors">
                                    {allSelected ? <RiCheckboxLine size={20} className="text-purple-600" /> : <RiCheckboxBlankLine size={20} />}
                                </button>
                            </th>
                            <th className="px-6 py-4">No</th>
                            <th className="px-6 py-4">Nama, NIM & Kampus</th>
                            <th className="px-6 py-4">Skor Total</th>
                            <th className="px-6 py-4">Kesimpulan</th>
                            <th className="px-6 py-4">Risiko Putus Kuliah</th>
                            <th className="px-6 py-4">Tanggal Tes</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.data.map((item: any, idx: number) => (
                            <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors ${selected.includes(item.id) ? 'bg-purple-50/40' : ''}`}>
                                <td className="px-4 py-4">
                                    <button onClick={() => toggleOne(item.id)} className="text-slate-400 hover:text-purple-600 transition-colors">
                                        {selected.includes(item.id) ? <RiCheckboxLine size={20} className="text-purple-600" /> : <RiCheckboxBlankLine size={20} />}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-medium">{(data.current_page - 1) * data.per_page + idx + 1}</td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-700">{item.nama}</div>
                                    <div className="text-xs text-slate-500">{item.nim} {item.group ? `• ${item.group.name}` : ''}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-black text-purple-700 text-lg">{item.total_score}</span>
                                    <div className="text-xs text-slate-500">{item.total_classification}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-lg text-xs font-black whitespace-nowrap ${item.conclusion === 'Kondisi Baik' ? 'bg-green-50 text-green-700' : (item.conclusion === 'Perlu Perhatian Khusus' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700')}`}>
                                        {item.conclusion}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-700">{item.dropout_risk_score}</span>
                                        <span className={`px-2 py-1 rounded-lg text-xs font-black whitespace-nowrap border ${
                                            item.dropout_risk_classification === 'Risiko rendah' || item.dropout_risk_classification === 'Aman'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : item.dropout_risk_classification === 'Risiko sedang'
                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                : 'bg-rose-50 text-rose-700 border-rose-200'
                                        }`}>
                                            {item.dropout_risk_classification}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-1">
                                        {viewUrl && (
                                            <Link href={viewUrl(item.id)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Lihat Detail">
                                                <RiEyeLine size={18} />
                                            </Link>
                                        )}
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                                            <RiDeleteBinLine size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data.data.length === 0 && (
                            <tr><td colSpan={9} className="px-6 py-12 text-center text-slate-400 font-medium">
                                {filters?.search ? `Tidak ada hasil untuk "${filters.search}"` : 'Belum ada data.'}
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 flex-wrap gap-2">
                <div className="text-sm text-slate-500 font-medium">
                    {selected.length > 0 ? <span className="text-purple-600 font-bold">{selected.length} dipilih · </span> : ''}
                    Menampilkan {data.from || 0} - {data.to || 0} dari {data.total} data
                </div>
                <div className="flex gap-2 flex-wrap">
                    {data.links.map((link: any, i: number) => (
                        <Link key={i} href={link.url || '#'}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${link.active ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'} ${!link.url ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Index({ data, groups, filters }: any) {
    return (
        <AdminLayout title="Sistem Identifikasi Kondisi - Mahasiswa (SIK-M)">
            <ImmList
                data={data}
                groups={groups}
                title="Daftar Hasil Tes SIK-M"
                exportUrl={`/admin/imm/export/excel${filters?.group ? '?group=' + filters.group : ''}`}
                deleteUrl={(id) => `/admin/imm/${id}`}
                viewUrl={(id) => `/admin/imm/${id}`}
                filters={filters}
                filterUrl="/admin/imm"
            />
        </AdminLayout>
    );
}
