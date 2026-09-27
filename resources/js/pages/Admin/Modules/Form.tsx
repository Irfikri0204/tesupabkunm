import AdminLayout from '@/layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import { RiSaveLine, RiArrowLeftLine, RiUploadCloud2Line, RiFileTextLine, RiCheckboxLine, RiCheckboxBlankLine } from '@remixicon/react';
import React, { useRef, useState, Suspense, lazy } from 'react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = lazy(() => import('react-quill-new'));

export default function Form({ model }: any) {
    const isEdit = !!model;

    const { data, setData, post, processing, errors } = useForm({
        title: model?.title ?? '',
        description: model?.description ?? '',
        file_path: null as File | null,
        cover_image: null as File | null,
        is_published: model?.is_published ?? true,
    });

    const [coverPreview, setCoverPreview] = useState<string | null>(model?.cover_url ?? null);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const coverRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            setData('file_path', file);
            setFileName(file.name);
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            setData('cover_image', file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            router.post(`/admin/moduls/${model.id}?_method=PUT`, data as any, { forceFormData: true });
        } else {
            post('/admin/moduls', { forceFormData: true } as any);
        }
    };

    return (
        <AdminLayout title={isEdit ? `Edit: ${model.title}` : 'Unggah Modul Baru'}>
            <div className="max-w-3xl mx-auto">
                <button onClick={() => router.visit('/admin/moduls')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold transition-colors">
                    <RiArrowLeftLine size={18} /> Kembali ke Daftar
                </button>

                <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 space-y-6">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-4">
                        {isEdit ? 'Edit Modul' : 'Unggah Modul Baru'}
                    </h2>

                    {/* Cover */}
                    <div>
                        <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Gambar Cover (Opsional)</label>
                        <div
                            className="relative h-40 w-full rounded-2xl overflow-hidden ring-2 ring-slate-200 cursor-pointer group hover:ring-purple-300 transition-all"
                            onClick={() => coverRef.current?.click()}
                        >
                            {coverPreview ? (
                                <img src={coverPreview} alt="Cover" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center gap-2">
                                    <RiUploadCloud2Line size={36} className="text-purple-300" />
                                    <p className="text-sm text-slate-400 font-medium">Klik untuk unggah gambar cover</p>
                                </div>
                            )}
                        </div>
                        <input ref={coverRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                    </div>

                    {/* Judul */}
                    <div>
                        <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Judul Modul *</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all font-medium"
                            placeholder="Contoh: Modul Manajemen Stres"
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-500 font-bold">{errors.title}</p>}
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Deskripsi Singkat</label>
                        <Suspense fallback={<div className="h-64 flex items-center justify-center text-slate-400 font-medium">Memuat Editor...</div>}>
                            <ReactQuill
                                theme="snow"
                                value={data.description}
                                onChange={(content: string) => setData('description', content)}
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['link'],
                                        ['clean']
                                    ]
                                }}
                                placeholder="Deskripsi singkat tentang isi modul ini..."
                            />
                        </Suspense>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">File Modul {!isEdit && '*'}</label>
                        <div
                            className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-slate-300 cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all"
                            onClick={() => fileRef.current?.click()}
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                                <RiFileTextLine size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                {fileName ? (
                                    <p className="font-bold text-slate-700 truncate">{fileName}</p>
                                ) : isEdit ? (
                                    <p className="font-medium text-slate-500">File sudah ada. Klik untuk mengganti.</p>
                                ) : (
                                    <>
                                        <p className="font-bold text-slate-700">Klik untuk pilih file</p>
                                        <p className="text-xs text-slate-400 mt-0.5">PDF, DOC, DOCX, PPT, PPTX — Maks. 10 MB</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={handleFileChange} className="hidden" />
                        {errors.file_path && <p className="mt-1 text-xs text-red-500 font-bold">{errors.file_path as string}</p>}
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setData('is_published', !data.is_published)} className="text-slate-400 hover:text-purple-600 transition-colors">
                            {data.is_published ? <RiCheckboxLine size={24} className="text-purple-600" /> : <RiCheckboxBlankLine size={24} />}
                        </button>
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide cursor-pointer" onClick={() => setData('is_published', !data.is_published)}>
                            Publikasikan (Tampilkan ke Publik)
                        </label>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:shadow-xl hover:shadow-purple-200 transition-all active:scale-95 disabled:opacity-60 uppercase tracking-widest text-sm"
                        >
                            <RiSaveLine size={20} />
                            {processing ? 'Menyimpan...' : 'SIMPAN MODUL'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
