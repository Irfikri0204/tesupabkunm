import AdminLayout from '@/layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import { RiSaveLine, RiArrowLeftLine, RiUploadCloud2Line, RiCheckboxLine, RiCheckboxBlankLine } from '@remixicon/react';
import React, { useRef, useState, Suspense, lazy } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Lazy-load QuillEditor
const ReactQuill = lazy(() => import('react-quill-new'));

export default function Form({ model }: any) {
    const isEdit = !!model;

    const { data, setData, post, processing, errors } = useForm({
        title: model?.title ?? '',
        content: model?.content ?? '',
        cover_image: null as File | null,
        is_published: model?.is_published ?? true,
    });

    const [coverPreview, setCoverPreview] = useState<string | null>(model?.cover_url ?? null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            setData('cover_image', file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            router.post(`/admin/posts/${model.id}?_method=PUT`, data as any, { forceFormData: true });
        } else {
            post('/admin/posts', { forceFormData: true } as any);
        }
    };

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean']
        ],
    };

    const quillFormats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent', 'align',
        'blockquote', 'code-block',
        'link', 'image'
    ];

    return (
        <AdminLayout title={isEdit ? `Edit: ${model.title}` : 'Tulis Berita Baru'}>
            <div className="max-w-5xl mx-auto">
                <button onClick={() => router.visit('/admin/posts')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold transition-colors">
                    <RiArrowLeftLine size={18} /> Kembali ke Daftar
                </button>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Cover & Judul */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 space-y-6">
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-4">
                            {isEdit ? 'Edit Berita' : 'Berita Baru'}
                        </h2>

                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Cover Image</label>
                            <div
                                className="relative h-48 w-full rounded-2xl overflow-hidden ring-2 ring-purple-100 cursor-pointer group shadow-sm transition-all hover:scale-[1.005]"
                                onClick={() => fileRef.current?.click()}
                            >
                                {coverPreview ? (
                                    <img src={coverPreview} alt="Cover" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col items-center justify-center gap-2">
                                        <RiUploadCloud2Line size={40} className="text-purple-400" />
                                        <p className="text-sm text-purple-500 font-bold">Klik untuk unggah gambar cover</p>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-purple-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                    <RiUploadCloud2Line size={32} />
                                </div>
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            {errors.cover_image && <p className="mt-1 text-xs text-red-500 font-bold">{errors.cover_image}</p>}
                        </div>

                        {/* Judul */}
                        <div>
                            <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Judul Berita *</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all font-medium text-lg"
                                placeholder="Tulis judul berita yang menarik..."
                            />
                            {errors.title && <p className="mt-1 text-xs text-red-500 font-bold">{errors.title}</p>}
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setData('is_published', !data.is_published)} className="text-slate-400 hover:text-purple-600 transition-colors">
                                {data.is_published ? <RiCheckboxLine size={24} className="text-purple-600" /> : <RiCheckboxBlankLine size={24} />}
                            </button>
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide cursor-pointer" onClick={() => setData('is_published', !data.is_published)}>
                                Publikasikan Sekarang
                            </label>
                        </div>
                    </div>

                    {/* Rich Text Content */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                        <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wide">Konten Artikel *</label>
                        <Suspense fallback={<div className="h-96 flex items-center justify-center text-slate-400 font-medium">Memuat Editor...</div>}>
                            <ReactQuill
                                theme="snow"
                                value={data.content}
                                onChange={(content: string) => setData('content', content)}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Mulai menulis konten artikel Anda di sini..."
                            />
                        </Suspense>
                        {errors.content && <p className="mt-2 text-xs text-red-500 font-bold">{errors.content}</p>}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end sticky bottom-4 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg border border-slate-100 z-20">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:shadow-xl hover:shadow-purple-200 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-wait uppercase tracking-widest text-sm"
                        >
                            <RiSaveLine size={20} />
                            {processing ? 'Menyimpan...' : isEdit ? 'SIMPAN PERUBAHAN' : 'PUBLIKASIKAN'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
