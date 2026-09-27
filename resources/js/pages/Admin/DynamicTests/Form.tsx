import AdminLayout from '@/layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import { RiSaveLine, RiArrowLeftLine, RiAddLine, RiDeleteBinLine, RiCheckboxLine, RiCheckboxBlankLine } from '@remixicon/react';
import React, { useState, Suspense, lazy } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Lazy-load QuillEditor
const ReactQuill = lazy(() => import('react-quill-new'));

export default function Form({ model }: any) {

    const isEdit = !!model;
    const { data, setData, post, processing, errors } = useForm({
        title: model?.title ?? '',
        description: model?.description ?? '',
        instructions: model?.instructions ?? '',
        tips: model?.tips ?? '',
        is_active: model?.is_active ?? true,
        identities: model?.identities ?? [],
        categories: model?.categories ?? [],
        questions: model?.questions ?? [],
    });

    const [activeTab, setActiveTab] = useState<'basic' | 'identities' | 'categories' | 'questions'>('basic');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            router.post(`/admin/dynamic-tests/${model.id}?_method=PUT`, data as any);
        } else {
            post('/admin/dynamic-tests');
        }
    };

    // Identitas Helpers
    const addIdentity = () => {
        setData('identities', [...data.identities, { field_label: '', field_type: 'text', is_required: true, file_type: null, options: [] }]);
    };
    const removeIdentity = (index: number) => {
        const newData = [...data.identities];
        newData.splice(index, 1);
        setData('identities', newData);
    };
    const updateIdentity = (index: number, field: string, value: any) => {
        const newData = [...data.identities];
        newData[index][field] = value;
        setData('identities', newData);
    };

    // Kategori Helpers
    const addCategory = () => {
        setData('categories', [...data.categories, { name: '', description: '', min_score: 0, max_score: 0 }]);
    };
    const removeCategory = (index: number) => {
        const newData = [...data.categories];
        newData.splice(index, 1);
        setData('categories', newData);
    };
    const updateCategory = (index: number, field: string, value: any) => {
        const newData = [...data.categories];
        newData[index][field] = value;
        setData('categories', newData);
    };

    // Bank Soal Helpers
    const addQuestion = () => {
        setData('questions', [...data.questions, { question_text: '', choices: [] }]);
    };
    const removeQuestion = (index: number) => {
        const newData = [...data.questions];
        newData.splice(index, 1);
        setData('questions', newData);
    };
    const updateQuestion = (index: number, field: string, value: any) => {
        const newData = [...data.questions];
        newData[index][field] = value;
        setData('questions', newData);
    };
    
    // Pilihan Jawaban Helpers
    const addChoice = (qIndex: number) => {
        const newData = [...data.questions];
        newData[qIndex].choices.push({ choice_text: '', weight: 0, category_name: '' });
        setData('questions', newData);
    };
    const removeChoice = (qIndex: number, cIndex: number) => {
        const newData = [...data.questions];
        newData[qIndex].choices.splice(cIndex, 1);
        setData('questions', newData);
    };
    const updateChoice = (qIndex: number, cIndex: number, field: string, value: any) => {
        const newData = [...data.questions];
        newData[qIndex].choices[cIndex][field] = value;
        setData('questions', newData);
    };

    return (
        <AdminLayout title={isEdit ? `Edit Tes: ${model.title}` : 'Buat Tes Baru'}>
            <div className="max-w-5xl mx-auto">
                <button onClick={() => router.visit('/admin/dynamic-tests')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold transition-colors">
                    <RiArrowLeftLine size={18} /> Kembali ke Daftar
                </button>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-6">
                    <div className="flex border-b border-slate-200 overflow-x-auto">
                        <button onClick={() => setActiveTab('basic')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'basic' ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600' : 'text-slate-500 hover:bg-slate-50'}`}>Informasi Dasar</button>
                        <button onClick={() => setActiveTab('identities')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'identities' ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600' : 'text-slate-500 hover:bg-slate-50'}`}>Form Data Diri</button>
                        <button onClick={() => setActiveTab('categories')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'categories' ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600' : 'text-slate-500 hover:bg-slate-50'}`}>Kategori Hasil</button>
                        <button onClick={() => setActiveTab('questions')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'questions' ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600' : 'text-slate-500 hover:bg-slate-50'}`}>Bank Soal</button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* TAB: BASIC INFO */}
                        {activeTab === 'basic' && (
                            <div className="space-y-5 animate-fadeIn">
                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Judul Tes *</label>
                                    <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} required className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all font-medium" placeholder="Contoh: Tes Gaya Belajar" />
                                    {errors.title && <p className="mt-1 text-xs text-red-500 font-bold">{errors.title}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Deskripsi Singkat</label>
                                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all font-medium" placeholder="Deskripsi untuk ditampilkan di halaman awal tes..." />
                                </div>

                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Petunjuk Pengerjaan</label>
                                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-100 transition-all">
                                        <Suspense fallback={<div className="h-40 flex items-center justify-center text-slate-400 font-medium">Memuat Editor...</div>}>
                                            <ReactQuill
                                                theme="snow"
                                                value={data.instructions}
                                                onChange={(val: string) => setData('instructions', val)}
                                                className="h-32"
                                            />
                                        </Suspense>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Tips</label>
                                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-100 transition-all">
                                        <Suspense fallback={<div className="h-32 flex items-center justify-center text-slate-400 font-medium">Memuat Editor...</div>}>
                                            <ReactQuill
                                                theme="snow"
                                                value={data.tips}
                                                onChange={(val: string) => setData('tips', val)}
                                                className="h-24"
                                            />
                                        </Suspense>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => setData('is_active', !data.is_active)} className="text-slate-400 hover:text-purple-600 transition-colors">
                                        {data.is_active ? <RiCheckboxLine size={24} className="text-purple-600" /> : <RiCheckboxBlankLine size={24} />}
                                    </button>
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide cursor-pointer" onClick={() => setData('is_active', !data.is_active)}>Status Aktif (Ditampilkan di publik)</label>
                                </div>
                            </div>
                        )}

                        {/* TAB: IDENTITAS */}
                        {activeTab === 'identities' && (
                            <div className="space-y-4 animate-fadeIn">
                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-sm text-slate-600 font-medium">Tentukan field apa saja yang perlu diisi peserta sebelum memulai tes.</p>
                                    <button type="button" onClick={addIdentity} className="flex items-center gap-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-xl font-bold text-sm transition-colors">
                                        <RiAddLine size={16} /> Tambah Field
                                    </button>
                                </div>

                                {data.identities.map((identity: any, idx: number) => (
                                    <div key={idx} className="p-5 border border-slate-200 rounded-2xl relative bg-white shadow-sm">
                                        <button type="button" onClick={() => removeIdentity(idx)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 p-2 rounded-xl transition-colors">
                                            <RiDeleteBinLine size={18} />
                                        </button>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pr-12">
                                            <div>
                                                <label className="block text-xs font-black text-slate-700 mb-1 uppercase">Label Field *</label>
                                                <input type="text" value={identity.field_label} onChange={e => updateIdentity(idx, 'field_label', e.target.value)} required placeholder="Contoh: Nama Lengkap" className="w-full rounded-lg border-slate-200 p-2.5 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-700 mb-1 uppercase">Tipe Input *</label>
                                                <select value={identity.field_type} onChange={e => updateIdentity(idx, 'field_type', e.target.value)} className="w-full rounded-lg border-slate-200 p-2.5 text-sm">
                                                    <option value="text">Teks Pendek</option>
                                                    <option value="file">Upload File</option>
                                                </select>
                                            </div>
                                            {identity.field_type === 'file' && (
                                                <div>
                                                    <label className="block text-xs font-black text-slate-700 mb-1 uppercase">Tipe File</label>
                                                    <select value={identity.file_type || ''} onChange={e => updateIdentity(idx, 'file_type', e.target.value)} className="w-full rounded-lg border-slate-200 p-2.5 text-sm">
                                                        <option value="">Semua Format</option>
                                                        <option value="image">Gambar Saja (JPG/PNG)</option>
                                                        <option value="pdf">PDF Saja</option>
                                                    </select>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 pt-6">
                                                <input type="checkbox" checked={identity.is_required} onChange={e => updateIdentity(idx, 'is_required', e.target.checked)} className="rounded text-purple-600 focus:ring-purple-500 w-5 h-5 border-slate-300" />
                                                <label className="text-sm font-bold text-slate-700">Wajib Diisi</label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {data.identities.length === 0 && <p className="text-center py-8 text-slate-400 font-medium">Belum ada form data diri yang ditambahkan.</p>}
                            </div>
                        )}

                        {/* TAB: KATEGORI */}
                        {activeTab === 'categories' && (
                            <div className="space-y-4 animate-fadeIn">
                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-sm text-slate-600 font-medium">Buat kategori hasil yang akan ditampilkan di akhir tes berdasarkan perolehan skor.</p>
                                    <button type="button" onClick={addCategory} className="flex items-center gap-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-xl font-bold text-sm transition-colors">
                                        <RiAddLine size={16} /> Tambah Kategori
                                    </button>
                                </div>

                                {data.categories.map((cat: any, idx: number) => (
                                    <div key={idx} className="p-5 border border-slate-200 rounded-2xl relative bg-white shadow-sm space-y-4">
                                        <button type="button" onClick={() => removeCategory(idx)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 p-2 rounded-xl transition-colors">
                                            <RiDeleteBinLine size={18} />
                                        </button>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-12">
                                            <div>
                                                <label className="block text-xs font-black text-slate-700 mb-1 uppercase">Nama Kategori *</label>
                                                <input type="text" value={cat.name} onChange={e => updateCategory(idx, 'name', e.target.value)} required placeholder="Contoh: Sangat Baik / Kecerdasan Visual" className="w-full rounded-lg border-slate-200 p-2.5 text-sm" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-black text-slate-700 mb-1 uppercase">Skor Min</label>
                                                    <input type="number" value={cat.min_score} onChange={e => updateCategory(idx, 'min_score', e.target.value)} className="w-full rounded-lg border-slate-200 p-2.5 text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-black text-slate-700 mb-1 uppercase">Skor Max</label>
                                                    <input type="number" value={cat.max_score} onChange={e => updateCategory(idx, 'max_score', e.target.value)} className="w-full rounded-lg border-slate-200 p-2.5 text-sm" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase">Deskripsi / Interpretasi *</label>
                                            <textarea value={cat.description} onChange={e => updateCategory(idx, 'description', e.target.value)} required rows={2} placeholder="Penjelasan mengenai hasil kategori ini..." className="w-full rounded-lg border-slate-200 p-2.5 text-sm"></textarea>
                                        </div>
                                    </div>
                                ))}
                                {data.categories.length === 0 && <p className="text-center py-8 text-slate-400 font-medium">Belum ada kategori yang ditambahkan.</p>}
                            </div>
                        )}

                        {/* TAB: BANK SOAL */}
                        {activeTab === 'questions' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-sm text-slate-600 font-medium">Kelola daftar pertanyaan dan pilihan jawabannya.</p>
                                    <button type="button" onClick={addQuestion} className="flex items-center gap-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-xl font-bold text-sm transition-colors">
                                        <RiAddLine size={16} /> Tambah Soal
                                    </button>
                                </div>

                                {data.questions.map((q: any, qIdx: number) => (
                                    <div key={qIdx} className="p-6 border-2 border-slate-200 rounded-3xl relative bg-white shadow-sm space-y-4">
                                        <button type="button" onClick={() => removeQuestion(qIdx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-xl transition-colors" title="Hapus Soal">
                                            <RiDeleteBinLine size={18} />
                                        </button>
                                        
                                        <div className="pr-12">
                                            <label className="block text-sm font-black text-slate-800 mb-1 uppercase tracking-wider text-purple-700">Soal {qIdx + 1}</label>
                                            <textarea value={q.question_text} onChange={e => updateQuestion(qIdx, 'question_text', e.target.value)} required rows={2} placeholder="Ketik pertanyaan di sini..." className="w-full rounded-xl border-slate-300 p-3 text-base font-medium shadow-sm focus:border-purple-500 focus:ring-purple-200"></textarea>
                                        </div>

                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                            <div className="flex justify-between items-center mb-3">
                                                <label className="text-xs font-black text-slate-600 uppercase tracking-widest">Pilihan Jawaban</label>
                                                <button type="button" onClick={() => addChoice(qIdx)} className="text-xs font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1">
                                                    <RiAddLine size={14} /> Tambah Opsi
                                                </button>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                {q.choices.map((c: any, cIdx: number) => (
                                                    <div key={cIdx} className="flex items-center gap-2">
                                                        <input type="text" value={c.choice_text} onChange={e => updateChoice(qIdx, cIdx, 'choice_text', e.target.value)} required placeholder="Teks pilihan..." className="flex-1 rounded-lg border-slate-200 p-2 text-sm" />
                                                        <input type="number" value={c.weight} onChange={e => updateChoice(qIdx, cIdx, 'weight', e.target.value)} required placeholder="Bobot" className="w-20 rounded-lg border-slate-200 p-2 text-sm text-center" title="Bobot Skor" />
                                                        <select value={c.category_name || ''} onChange={e => updateChoice(qIdx, cIdx, 'category_name', e.target.value)} className="w-40 rounded-lg border-slate-200 p-2 text-sm text-slate-600" title="Relasikan ke Kategori (Opsional)">
                                                            <option value="">- Kategori -</option>
                                                            {data.categories.map((cat: any, i: number) => (
                                                                <option key={i} value={cat.name}>{cat.name}</option>
                                                            ))}
                                                        </select>
                                                        <button type="button" onClick={() => removeChoice(qIdx, cIdx)} className="text-slate-400 hover:text-red-500 p-2">
                                                            <RiDeleteBinLine size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {(!q.choices || q.choices.length === 0) && <p className="text-xs text-slate-400 italic py-2">Belum ada pilihan jawaban untuk soal ini.</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {data.questions.length === 0 && <p className="text-center py-12 text-slate-400 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-300">Belum ada soal. Klik 'Tambah Soal' untuk mulai membuat bank soal.</p>}
                            </div>
                        )}

                        <div className="pt-6 mt-8 border-t border-slate-100 flex justify-end sticky bottom-0 bg-white/90 backdrop-blur pb-4 z-20">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:shadow-xl hover:shadow-purple-200 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-wait uppercase tracking-widest text-sm"
                            >
                                <RiSaveLine size={20} />
                                {processing ? 'Menyimpan...' : 'SIMPAN TES DINAMIS'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
