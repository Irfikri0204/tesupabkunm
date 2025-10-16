import { RiArrowRightLine } from '@remixicon/react';

interface Props {
    current: number;
    total: number;
    onNext: () => void;
    onPrev: () => void;
    onSelect: (index: number) => void;
    isSubmitting?: boolean; // <-- tambah ini
}

export default function QuestionNavigation({ current, total, onNext, onPrev, onSelect, isSubmitting = false }: Props) {
    const isLast = current === total - 1;

    return (
        <div className="mt-8 flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
            {/* Nomor Soal */}
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {[...Array(total)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => onSelect(i)}
                        className={`h-8 w-8 rounded-full border-2 text-sm font-medium transition-colors ${
                            i === current ? 'border-purple-600 bg-purple-500 text-white' : 'border-purple-400 text-purple-600 hover:bg-purple-100'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Tombol Navigasi */}
            <div className="flex w-full justify-center sm:w-auto sm:justify-end">
                <button
                    onClick={onNext}
                    disabled={isSubmitting}
                    className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2 text-sm font-medium transition-colors sm:text-base ${
                        isSubmitting ? 'cursor-not-allowed bg-gray-400 text-gray-700' : 'bg-purple-300 text-black hover:bg-purple-400'
                    }`}
                >
                    {isSubmitting ? (
                        'Mengirim...'
                    ) : isLast ? (
                        'Submit'
                    ) : (
                        <>
                            Selanjutnya
                            <RiArrowRightLine className="text-lg" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
