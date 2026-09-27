<?php

$models = ['GayaBelajar', 'KecerdasanMajemuk', 'Panas', 'Srq20', 'Swls'];

foreach($models as $m) {
    $dir = "resources/js/pages/Admin/$m";
    @mkdir($dir, 0777, true);
    
    $title = preg_replace('/(?<!^)([A-Z])/', ' $1', $m);
    $slug = strtolower(preg_replace('/(?<!^)([A-Z])/', '-$1', $m));
    
    $content = <<<TSX
import AdminLayout from '@/layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { RiDeleteBinLine, RiDownloadLine } from '@remixicon/react';
import React from 'react';

export default function Index({ data }: any) {
    const { delete: destroy } = useForm();
    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus data ini?')) {
            destroy(`/admin/$slug/\${id}`);
        }
    };
    return (
        <AdminLayout title="Manajemen $title">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">Daftar $title</h3>
                    <a href={`/admin/$slug/export/excel`} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:shadow-lg transition-all">
                        <RiDownloadLine size={16} /> Export Excel
                    </a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Nama</th>
                                <th className="px-6 py-4">Kelas</th>
                                <th className="px-6 py-4">Sekolah</th>
                                <th className="px-6 py-4">Dibuat Pada</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.data.map((item: any) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">#{item.id}</td>
                                    <td className="px-6 py-4 font-bold text-slate-700">{item.nama}</td>
                                    <td className="px-6 py-4 text-slate-600">{item.kelas}</td>
                                    <td className="px-6 py-4 text-slate-600">{item.asal_sekolah}</td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(item.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block">
                                            <RiDeleteBinLine size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="text-sm text-slate-500 font-medium">
                        Menampilkan {data.from || 0} - {data.to || 0} dari {data.total} data
                    </div>
                    <div className="flex gap-2">
                        {data.links.map((link: any, i: number) => (
                            <Link 
                                key={i}
                                href={link.url || '#'}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all \${link.active ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'} \${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
TSX;

    file_put_contents("$dir/Index.tsx", $content);
}

echo "React files generated\n";
