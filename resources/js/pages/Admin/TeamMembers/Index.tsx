import AdminLayout from '@/layouts/AdminLayout';
import { Link, router, useForm } from '@inertiajs/react';
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiCheckboxLine, RiCheckboxBlankLine, RiDraggable, RiSearchLine, RiTeamLine, RiUserHeartLine } from '@remixicon/react';
import React, { useState, useCallback, useMemo } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TYPE_LABELS: Record<string, string> = {
    'dosen': 'UPA BK UNM',
    'konselor-sebaya': 'Konselor Sebaya',
};

function SortableRow({ item, selected, onToggle, onDelete }: {
    item: any;
    selected: boolean;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

    return (
        <tr ref={setNodeRef} style={style} className={`hover:bg-slate-50/50 transition-colors ${selected ? 'bg-purple-50/40' : ''} ${isDragging ? 'shadow-lg bg-white relative z-50' : ''}`}>
            <td className="px-3 py-4">
                <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors p-1">
                    <RiDraggable size={20} />
                </button>
            </td>
            <td className="px-4 py-4">
                <button onClick={() => onToggle(item.id)} className="text-slate-400 hover:text-purple-600 transition-colors">
                    {selected ? <RiCheckboxLine size={20} className="text-purple-600" /> : <RiCheckboxBlankLine size={20} />}
                </button>
            </td>
            <td className="px-4 py-4">
                {item.photo_url ? (
                    <img src={item.photo_url} alt={item.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-100" />
                ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-black text-sm uppercase">
                        {item.name?.charAt(0)}
                    </div>
                )}
            </td>
            <td className="px-6 py-4 font-bold text-slate-700">{item.name}</td>
            <td className="px-6 py-4 text-slate-600 font-medium">{item.role}</td>
            <td className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">{item.division}</td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-1">
                    <Link href={`/admin/team-members/${item.id}/edit`} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
                        <RiEditLine size={18} />
                    </Link>
                    <button onClick={() => onDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                        <RiDeleteBinLine size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default function Index({ data }: any) {
    const [activeTab, setActiveTab] = useState<'dosen' | 'konselor-sebaya'>('dosen');
    const [items, setItems] = useState(data.data);
    const [selected, setSelected] = useState<number[]>([]);
    const [search, setSearch] = useState('');
    const [filterDivision, setFilterDivision] = useState('');
    const { delete: destroy } = useForm();

    const filtered = useMemo(() => {
        let list = items.filter((i: any) => i.type === activeTab);
        if (search) {
            list = list.filter((i: any) => 
                i.name?.toLowerCase().includes(search.toLowerCase()) || 
                i.role?.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (filterDivision) {
            list = list.filter((i: any) => i.division === filterDivision);
        }
        return list;
    }, [items, activeTab, search, filterDivision]);

    const availableDivisions = useMemo(() => {
        const divs = items
            .filter((i: any) => i.type === activeTab && i.division)
            .map((i: any) => i.division);
        return Array.from(new Set(divs)).sort();
    }, [items, activeTab]);

    const allIds: number[] = filtered.map((item: any) => item.id);
    const allSelected = allIds.length > 0 && allIds.every((id: number) => selected.includes(id));

    const toggleAll = () => setSelected(allSelected ? [] : allIds);
    const toggleOne = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus anggota tim ini?')) {
            destroy(`/admin/team-members/${id}`, {
                onSuccess: () => {
                    setItems((prev: any[]) => prev.filter(i => i.id !== id));
                    setSelected(prev => prev.filter(x => x !== id));
                }
            });
        }
    };

    const handleBulkDelete = () => {
        if (selected.length === 0) return;
        if (!confirm(`Yakin ingin menghapus ${selected.length} data yang dipilih?`)) return;
        router.post('/admin/team-members/bulk-delete', { ids: selected }, { 
            onSuccess: () => {
                setItems((prev: any[]) => prev.filter(i => !selected.includes(i.id)));
                setSelected([]);
            }
        });
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setItems((prev: any[]) => {
            const oldIndex = prev.findIndex(i => i.id === active.id);
            const newIndex = prev.findIndex(i => i.id === over.id);
            const newItems = arrayMove(prev, oldIndex, newIndex);
            
            const ids = newItems.map((i: any) => i.id);
            router.post('/admin/team-members/reorder', { ids }, {
                preserveScroll: true,
                preserveState: true,
            });
            return newItems;
        });
    }, []);

    return (
        <AdminLayout title="Tim & Konselor">
            <div className="space-y-6">
                {/* Tabs */}
                <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-100 max-w-fit">
                    <button
                        onClick={() => { setActiveTab('dosen'); setSelected([]); setFilterDivision(''); }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all ${activeTab === 'dosen' ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <RiTeamLine size={18} /> TIM UPA BK UNM
                    </button>
                    <button
                        onClick={() => { setActiveTab('konselor-sebaya'); setSelected([]); setFilterDivision(''); }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all ${activeTab === 'konselor-sebaya' ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <RiUserHeartLine size={18} /> TIM KONSELOR SEBAYA
                    </button>

                </div>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-wrap gap-3">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">
                                {TYPE_LABELS[activeTab]}
                            </h3>
                            {selected.length > 0 && (
                                <button onClick={handleBulkDelete} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-600 transition-all shadow">
                                    <RiDeleteBinLine size={16} /> Hapus {selected.length} Item
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <select
                                value={filterDivision}
                                onChange={e => setFilterDivision(e.target.value)}
                                className="py-2 px-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-slate-600"
                            >
                                <option value="">Semua Angkatan/Divisi</option>
                                {(availableDivisions as string[]).map(div => (
                                    <option key={div} value={div}>{div}</option>
                                ))}
                            </select>
                            <div className="relative">
                                <RiSearchLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari nama..." className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 w-44 transition-all" />
                            </div>
                            <Link href="/admin/team-members/create"
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:shadow-lg transition-all">
                                <RiAddLine size={16} /> Tambah Anggota
                            </Link>
                        </div>
                    </div>

                    <div className="px-6 py-2 bg-amber-50 border-b border-amber-100 text-[10px] text-amber-700 font-bold uppercase tracking-widest flex items-center gap-2">
                        <RiDraggable size={14} /> Seret baris untuk mengatur urutan tampilan di halaman depan
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-wider text-[11px]">
                                <tr>
                                    <th className="px-3 py-4 w-10"></th>
                                    <th className="px-4 py-4 w-12 text-center">
                                        <button onClick={toggleAll} className="text-slate-300 hover:text-purple-600 transition-colors">
                                            {allSelected ? <RiCheckboxLine size={20} className="text-purple-600" /> : <RiCheckboxBlankLine size={20} />}
                                        </button>
                                    </th>
                                    <th className="px-4 py-4 w-16">Foto</th>
                                    <th className="px-6 py-4">Nama Lengkap</th>
                                    <th className="px-6 py-4">Jabatan/Role</th>
                                    <th className="px-6 py-4">Divisi/Lembaga</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={filtered.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                                    <tbody className="divide-y divide-slate-100">
                                        {filtered.map((item: any) => (
                                            <SortableRow
                                                key={item.id}
                                                item={item}
                                                selected={selected.includes(item.id)}
                                                onToggle={toggleOne}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                        {filtered.length === 0 && (
                                            <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium italic">Tidak ada data anggota di kategori ini.</td></tr>
                                        )}
                                    </tbody>
                                </SortableContext>
                            </DndContext>
                        </table>
                    </div>
                    
                    <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 flex-wrap gap-2">
                        <div className="text-xs text-slate-500 font-bold">
                            {selected.length > 0 ? <span className="text-purple-600">{selected.length} dipilih · </span> : ''}
                            Total {filtered.length} anggota di tab ini
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
