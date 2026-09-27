import IdentitasLayout from '@/layouts/IdentitasLayout';
import { useForm } from '@inertiajs/react';
import React, { FormEvent, useEffect, useState } from 'react';

export default function Identitas({ test }: any) {
    // Generate initial values based on test identities
    const initialValues: Record<string, any> = {};
    test.identities.forEach((id: any) => {
        initialValues[id.field_name] = id.field_type === 'file' ? null : '';
    });

    const { data, setData, post, processing, errors } = useForm(initialValues);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/tes/${test.slug}/start`);
    };

    return (
        <IdentitasLayout>
            <div className="mx-auto w-full max-w-7xl p-4 py-8 sm:p-8">
                <div className="mb-10 flex flex-col items-start gap-4 border-b border-slate-100 pb-8 md:flex-row md:items-center">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                        <span className="text-3xl">📝</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight sm:text-4xl">{test.title}</h1>
                        {test.description && <p className="mt-2 text-slate-600 font-medium leading-relaxed max-w-3xl">{test.description}</p>}
                    </div>
                </div>

                    <div className="grid gap-12 lg:grid-cols-12">
                        {/* Form Section */}
                        <div className="lg:col-span-7">
                            <div className="rounded-3xl border-2 border-slate-100 bg-white p-6 sm:p-8">
                                <h2 className="mb-6 text-xl font-bold text-slate-800">Isi Data Diri</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {test.identities.map((identity: any, index: number) => (
                                        <div key={index}>
                                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                                {identity.field_label} {identity.is_required && <span className="text-red-500">*</span>}
                                            </label>
                                            
                                            {identity.field_type === 'text' && (
                                                <input
                                                    type="text"
                                                    value={data[identity.field_name] || ''}
                                                    onChange={e => setData(identity.field_name, e.target.value)}
                                                    required={identity.is_required}
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                                                />
                                            )}

                                            {identity.field_type === 'file' && (
                                                <input
                                                    type="file"
                                                    onChange={e => setData(identity.field_name, e.target.files ? e.target.files[0] : null)}
                                                    required={identity.is_required}
                                                    accept={identity.file_type === 'image' ? 'image/*, .jpg, .jpeg, .png' : identity.file_type === 'pdf' ? '.pdf' : undefined}
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                                                />
                                            )}

                                            {errors[identity.field_name] && <p className="mt-1 text-xs text-red-500 font-bold">{errors[identity.field_name]}</p>}
                                        </div>
                                    ))}

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-70 disabled:cursor-wait"
                                    >
                                        {processing ? 'Memproses...' : 'Mulai Tes Sekarang'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Petunjuk Section */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-8 space-y-6">
                                {test.instructions && (
                                    <div className="rounded-3xl bg-purple-50 p-6 sm:p-8">
                                        <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-primary">Petunjuk Pengisian</h3>
                                        <div className="text-sm font-medium leading-relaxed text-slate-700 prose prose-sm prose-purple max-w-none" dangerouslySetInnerHTML={{ __html: test.instructions }} />
                                    </div>
                                )}
                                
                                {test.tips && (
                                    <div className="rounded-3xl bg-yellow-50 p-6 sm:p-8">
                                        <div className="mb-4 flex items-center gap-2">
                                            <span className="text-xl">💡</span>
                                            <h3 className="text-sm font-black uppercase tracking-widest text-secondary">Tips</h3>
                                        </div>
                                        <div className="text-sm font-medium leading-relaxed text-slate-700 prose prose-sm prose-yellow max-w-none" dangerouslySetInnerHTML={{ __html: test.tips }} />
                                    </div>
                                )}
                            </div>
                        </div>
                </div>
            </div>
        </IdentitasLayout>
    );
}
