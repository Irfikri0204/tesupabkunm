import IdentitasLayout from '@/layouts/IdentitasLayout';
import { router, useForm } from '@inertiajs/react';
import React, { FormEvent, useEffect, useState } from 'react';

export default function Soal({ test }: any) {
    const { data, setData, post, processing } = useForm({
        answers: {} as Record<string, { weight: number, category_name: string | null }>
    });

    const [progress, setProgress] = useState(0);

    // Calculate progress
    useEffect(() => {
        const total = test.questions.length;
        const answered = Object.keys(data.answers).length;
        setProgress((answered / total) * 100);
    }, [data.answers, test.questions.length]);

    // Exit confirmation
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = ''; // Required for Chrome
        };

        const removeListener = router.on('before', (event) => {
            if (!confirm('Yakin ingin meninggalkan halaman ini? Tes Anda yang sedang berlangsung akan hilang.')) {
                event.preventDefault();
            }
        });

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            removeListener();
        };
    }, []);

    const handleOptionChange = (questionId: string, choice: any) => {
        setData('answers', {
            ...data.answers,
            [questionId]: { weight: Number(choice.weight), category_name: choice.category_name || null }
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const total = test.questions.length;
        const answered = Object.keys(data.answers).length;
        
        if (answered < total) {
            alert('Mohon jawab semua pertanyaan sebelum mengirim.');
            return;
        }

        post(`/tes/${test.slug}/submit`);
    };

    return (
        <IdentitasLayout>
            <div className="w-full pb-20 pt-4">
                {/* Progress Bar Container */}
                <div className="fixed top-[4.5rem] left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-sm md:top-[4rem]">
                    <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="font-black text-slate-800 text-lg">{test.title}</div>
                        <div className="text-sm font-bold text-primary">{Math.round(progress)}% Selesai</div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100">
                        <div className="h-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto pt-24 px-4 sm:px-6">
                    <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg shadow-slate-200/50 mb-8 border border-slate-100 text-center">
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Selamat Mengerjakan</h2>
                        {test.instructions ? (
                            <div className="text-slate-500 font-medium prose prose-sm prose-slate mx-auto max-w-none" dangerouslySetInnerHTML={{ __html: test.instructions }} />
                        ) : (
                            <p className="text-slate-500 font-medium">Pilih satu jawaban yang paling menggambarkan diri Anda untuk setiap pertanyaan.</p>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {test.questions.map((question: any, idx: number) => (
                            <div key={question.id} className={`bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 transition-all duration-300 ${data.answers[question.id] !== undefined ? 'border-primary/30 bg-purple-50/10' : 'border-slate-100'}`}>
                                <h3 className="text-lg font-bold text-slate-800 mb-6">
                                    <span className="text-primary mr-2">{idx + 1}.</span> {question.question_text}
                                </h3>
                                
                                <div className="space-y-3">
                                    {question.choices.map((choice: any) => (
                                            <label 
                                            key={choice.id} 
                                            className={`flex items-center p-4 rounded-xl cursor-pointer transition-all border-2 ${
                                                data.answers[question.id]?.weight === Number(choice.weight) 
                                                ? 'border-primary bg-purple-50 shadow-sm' 
                                                : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 transition-colors ${
                                                data.answers[question.id]?.weight === Number(choice.weight) 
                                                ? 'border-primary' 
                                                : 'border-slate-300'
                                            }`}>
                                                {data.answers[question.id]?.weight === Number(choice.weight) && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                                                )}
                                            </div>
                                            <input 
                                                type="radio" 
                                                name={`question_${question.id}`} 
                                                value={choice.weight} 
                                                onChange={() => handleOptionChange(question.id, choice)}
                                                className="hidden"
                                            />
                                            <span className={`font-medium ${data.answers[question.id]?.weight === Number(choice.weight) ? 'text-primary font-bold' : 'text-slate-700'}`}>
                                                {choice.choice_text}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="pt-8 flex justify-center">
                            <button
                                type="submit"
                                disabled={processing || progress < 100}
                                className="bg-gradient-to-r from-primary to-indigo-600 text-white font-black text-lg px-12 py-5 rounded-full shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 hover:shadow-primary/40 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Memproses...' : 'Lihat Hasil Tes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </IdentitasLayout>
    );
}
