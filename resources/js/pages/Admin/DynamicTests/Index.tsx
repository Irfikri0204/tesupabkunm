import AdminLayout from '@/layouts/AdminLayout';
import { Link, router, useForm } from '@inertiajs/react';
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiCheckboxLine, RiCheckboxBlankLine, RiSearchLine, RiSurveyLine } from '@remixicon/react';
import React, { useState, useMemo } from 'react';

export default function Index({ data }: any) {
    const [items, setItems] = useState(data.data);
    const [selected, setSelected] = useState<number[]>([]);
    const [search, setSearch] = useState('');
    const { delete: destroy } = useForm();

    const filtered = useMemo(() => {
        let list = items;
        if (search) {
            list = list.filter((i: any) => 
                i.title?.toLowerCase().includes(search.toLowerCase())
            );
        }
        return list;
    }, [items, search]);

    const allIds: number[] = filtered.map((item: any) => item.id);
    const allSelected = allIds.length > 0 && allIds.every((id: number) => selected.includes(id));

    const toggleAll = () => setSelected(allSelected ? [] : allIds);
    const toggleOne = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus tes ini? Semua data terkait (identitas, soal, dll) akan terhapus.')) {
            destroy(`/admin/dynamic-tests/${id}`, {
                onSuccess: () => {
                    setItems((prev: any[]) => prev.filter(i => i.id !== id));
                    setSelected(prev => prev.filter(x => x !== id));
                }
            });
        }
    };

    const handleBulkDelete = () => {
        if (selected.length === 0) return;
        if (!confirm(`Yakin ingin menghapus ${selected.length} tes yang dipilih?`)) return;
        router.post('/admin/dynamic-tests/bulk-delete', { ids: selected }, { 
            onSuccess: () => {
                setItems((prev: any[]) => prev.filter(i => !selected.includes(i.id)));
                setSelected([]);
            }
        });
    };

    return (
        <AdminLayout title="Tes Dinamis">
            <div className="space-y-6">
                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-wrap gap-3">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase flex items-center gap-2">
                                <RiSurveyLine size={20} className="text-purple-600"/> DAFTAR TES DINAMIS
                            </h3>
                            {selected.length > 0 && (
                                <button onClick={handleBulkDelete} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-600 transition-all shadow">
                                    <RiDeleteBinLine size={16} /> Hapus {selected.length} Item
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="relative">
                                <RiSearchLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari tes..." className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 w-44 transition-all" />
                            </div>
                            <Link href="/admin/dynamic-tests/create"
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:shadow-lg transition-all">
                                <RiAddLine size={16} /> Buat Tes Baru
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-wider text-[11px]">
                                <tr>
                                    <th className="px-4 py-4 w-12 text-center">
                                        <button onClick={toggleAll} className="text-slate-300 hover:text-purple-600 transition-colors">
                                            {allSelected ? <RiCheckboxLine size={20} className="text-purple-600" /> : <RiCheckboxBlankLine size={20} />}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4">Judul Tes</th>
                                    <th className="px-6 py-4">Slug / Link</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((item: any) => (
                                    <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors ${selected.includes(item.id) ? 'bg-purple-50/40' : ''}`}>
                                        <td className="px-4 py-4 text-center">
                                            <button onClick={() => toggleOne(item.id)} className="text-slate-400 hover:text-purple-600 transition-colors">
                                                {selected.includes(item.id) ? <RiCheckboxLine size={20} className="text-purple-600" /> : <RiCheckboxBlankLine size={20} />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-700">{item.title}</td>
                                        <td className="px-6 py-4 text-slate-500 font-medium">{item.slug}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {item.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link href={`/admin/dynamic-tests/${item.id}/edit`} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit / Konfigurasi">
                                                    <RiEditLine size={18} />
                                                </Link>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                                                    <RiDeleteBinLine size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium italic">Belum ada tes dinamis yang dibuat.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 flex-wrap gap-2">
                        <div className="text-xs text-slate-500 font-bold">
                            {selected.length > 0 ? <span className="text-purple-600">{selected.length} dipilih · </span> : ''}
                            Total {filtered.length} tes
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
