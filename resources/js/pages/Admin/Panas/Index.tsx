import AdminLayout from '@/layouts/AdminLayout';
import { Link, router, useForm } from '@inertiajs/react';
import { RiDeleteBinLine, RiDownloadLine, RiEyeLine, RiCheckboxLine, RiCheckboxBlankLine, RiSearchLine } from '@remixicon/react';
import React, { useState } from 'react';

// Generic reusable table for: Panas, SRQ-20, SWLS, Gaya Belajar
export function TesList({ data, title, exportUrl, deleteUrl, viewUrl, filters, filterUrl }: {
    data: any;
    title: string;
    exportUrl: string;
    deleteUrl: (id: number) => string;
    viewUrl?: (id: number) => string;
    filters?: { search?: string };
    filterUrl: string;
}) {
    const [selected, setSelected] = useState<number[]>([]);
    const [search, setSearch] = useState(filters?.search ?? '');
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(filterUrl, { search }, { preserveState: true, replace: true });
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">{title}</h3>
                    {selected.length > 0 && (
                        <button onClick={handleBulkDelete} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-600 transition-all shadow">
                            <RiDeleteBinLine size={16} /> Hapus {selected.length} Data
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <div className="relative">
                            <RiSearchLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari nama, kategori..."
                                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 w-52 transition-all"
                            />
                        </div>
                        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors">Cari</button>
                        {filters?.search && (
                            <button type="button" onClick={() => { setSearch(''); router.get(filterUrl, {}, { preserveState: true, replace: true }); }}
                                className="px-3 py-2 bg-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-300 transition-colors">Reset</button>
                        )}
                    </form>
                    <a href={exportUrl} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:shadow-lg transition-all">
                        <RiDownloadLine size={16} /> Export Excel
                    </a>
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
                            <th className="px-6 py-4">Nama</th>
                            <th className="px-6 py-4">Tgl. Lahir</th>
                            <th className="px-6 py-4">Jenis Kelamin</th>
                            <th className="px-6 py-4">Total Skor</th>
                            <th className="px-6 py-4">Kategori</th>
                            <th className="px-6 py-4">Tanggal</th>
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
                                <td className="px-6 py-4 font-bold text-slate-700">{item.nama}</td>
                                <td className="px-6 py-4 text-slate-600">{item.tanggal_lahir}</td>
                                <td className="px-6 py-4 text-slate-600">{item.jenis_kelamin}</td>
                                <td className="px-6 py-4"><span className="font-black text-purple-700 text-lg">{item.total_skor}</span></td>
                                <td className="px-6 py-4"><span className="px-2 py-1 rounded-lg text-xs font-black bg-indigo-50 text-indigo-700 whitespace-nowrap">{item.kategori}</span></td>
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

export default function Index({ data, filters }: any) {
    return (
        <AdminLayout title="Tes Pola Emosi (PANAS)">
            <TesList
                data={data}
                title="Daftar Hasil Tes PANAS"
                exportUrl="/admin/panas/export/excel"
                deleteUrl={(id) => `/admin/panas/${id}`}
                viewUrl={(id) => `/admin/panas/${id}`}
                filters={filters}
                filterUrl="/admin/panas"
            />
        </AdminLayout>
    );
}