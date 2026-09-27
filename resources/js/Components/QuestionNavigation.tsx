import { RiArrowRightLine } from '@remixicon/react';

interface Props {
    current: number;
    total: number;
    onNext: () => void;
    onPrev: () => void;
    onSelect: (index: number) => void;
    isSubmitting?: boolean;
    answers?: Record<number, any>;
    groupSize?: number;
}

export default function QuestionNavigation({ current, total, onNext, onPrev, onSelect, isSubmitting = false, answers = {}, groupSize = 1 }: Props) {
    const isLast = current === total - 1;

    return (
        <div className="mt-8 flex flex-col items-center gap-6 md:flex-row md:justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            {/* Nomor Soal */}
            <div className="flex flex-wrap justify-center gap-2.5 md:justify-start flex-1">
                {[...Array(total)].map((_, i) => {
                    let isAnswered = false;
                    if (Array.isArray(answers)) {
                        isAnswered = groupSize > 1 
                            ? [...Array(groupSize)].every((_, idx) => !!answers[(i * groupSize) + idx])
                            : !!answers[i];
                    } else {
                        isAnswered = groupSize > 1
                            ? [...Array(groupSize)].every((_, idx) => !!answers[i * groupSize + idx + 1])
                            : !!answers[i + 1];
                    }
                    const isCurrent = i === current;

                    return (
                        <button
                            key={i}
                            onClick={() => onSelect(i)}
                            className={`h-10 w-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 ${
                                isCurrent
                                    ? 'border-2 border-primary bg-primary text-white shadow-lg shadow-primary/30 scale-110 z-10'
                                    : isAnswered
                                        ? 'border-2 border-primary/20 bg-primary/5 text-primary hover:border-primary/50'
                                        : 'border-2 border-slate-200 bg-white text-slate-400 hover:border-primary/30 hover:text-slate-600'
                            }`}
                        >
                            {i + 1}
                        </button>
                    );
                })}
            </div>

            {/* Tombol Navigasi */}
            <div className="flex w-full justify-center md:w-auto md:justify-end shrink-0 gap-3">
                {current > 0 && (
                    <button
                        onClick={onPrev}
                        disabled={isSubmitting}
                        className="flex h-12 items-center justify-center rounded-xl px-6 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 transition-all active:scale-95"
                    >
                        Kembali
                    </button>
                )}
                
                <button
                    onClick={onNext}
                    disabled={isSubmitting}
                    className={`flex h-12 items-center justify-center gap-2 rounded-xl px-8 font-bold transition-all active:scale-95 ${
                        isSubmitting 
                            ? 'cursor-not-allowed bg-slate-300 text-slate-500' 
                            : 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-purple-800 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5'
                    }`}
                >
                    {isSubmitting ? (
                        'Mengirim...'
                    ) : isLast ? (
                        'Submit'
                    ) : (
                        <>
                            Selanjutnya
                            <RiArrowRightLine className="text-xl" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
