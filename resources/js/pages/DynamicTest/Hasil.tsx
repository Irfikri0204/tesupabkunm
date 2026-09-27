import IdentitasLayout from '@/layouts/IdentitasLayout';
import React from 'react';

export default function Hasil({ test, result }: any) {
    const ulangiTes = () => {
        if (confirm('Yakin ingin mengulangi tes?')) {
            window.location.href = `/tes/${test.slug}/identitas`;
        }
    };

    return (
        <IdentitasLayout>
            <div className="mx-auto w-full max-w-5xl p-4 py-8 sm:p-8">
                <div className="relative z-10 w-full rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-slate-200/50 sm:p-12 border border-slate-100">
                    <h2 className="mb-2 text-sm font-bold tracking-widest text-slate-400 uppercase mt-4">Hasil Evaluasi: {result.total_score}</h2>
                    <h1 className="mb-6 text-4xl font-black capitalize text-slate-800">{result.category_name}</h1>
                    
                    <div className="mb-8 rounded-2xl bg-purple-50 p-6 text-slate-600">
                        <p className="leading-relaxed">{result.category_description}</p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://s.id/layanankonselinguptlbkunm"
                            className="inline-block w-full rounded-full bg-primary px-6 py-4 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:-translate-y-1 hover:bg-purple-800"
                        >
                            Ajukan Konseling Sekarang
                        </a>
                        
                        <a
                            href="https://www.instagram.com/upa_bk_unm/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block w-full rounded-full bg-secondary px-6 py-4 text-sm font-bold text-slate-900 shadow-lg shadow-yellow-400/30 transition-all duration-200 hover:-translate-y-1 hover:bg-yellow-400"
                        >
                            Follow Instagram UPA BK UNM
                        </a>

                        <button
                            onClick={ulangiTes}
                            className="mt-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors underline underline-offset-4"
                        >
                            Ulangi Tes
                        </button>
                    </div>
                </div>
            </div>
        </IdentitasLayout>
    );
}
