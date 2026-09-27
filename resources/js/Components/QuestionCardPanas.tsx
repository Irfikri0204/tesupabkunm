interface QuestionCardProps {
    currentIndex: number;
    total: number;
    question: string;
    selectedAnswer: number | null;
    onSelect: (answer: number) => void;
}

export default function QuestionPanasCard({ currentIndex, total, question, selectedAnswer, onSelect }: QuestionCardProps) {
    const scale = [
        { value: 1, label: 'Hampir Tidak Pernah' },
        { value: 2, label: 'Jarang' },
        { value: 3, label: 'Kadang-Kadang' },
        { value: 4, label: 'Sering' },
        { value: 5, label: 'Hampir Selalu' },
    ];

    return (
        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-lg shadow-slate-200/50 border border-slate-100">
            {/* Teks pertanyaan */}
            <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-snug mb-8">{question}</h2>

            {/* Pilihan jawaban */}
            <div className="space-y-4">
                {scale.map((item) => {
                    const isSelected = selectedAnswer === item.value;
                    return (
                        <button
                            key={item.value}
                            onClick={() => onSelect(item.value)}
                            className={`group relative flex w-full items-center gap-4 rounded-2xl border-2 p-5 md:p-6 text-left transition-all duration-300 hover:-translate-y-1 ${
                                isSelected 
                                    ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' 
                                    : 'border-slate-100 bg-white hover:border-primary/30 hover:shadow-lg hover:shadow-slate-200/50'
                            }`}
                        >
                            {/* Custom Radio Button */}
                            <div className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors ${
                                isSelected ? 'border-primary bg-primary' : 'border-slate-300 group-hover:border-primary/50'
                            }`}>
                                {isSelected && (
                                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                )}
                            </div>
                            
                            <span className={`text-sm md:text-base font-semibold leading-relaxed transition-colors ${
                                isSelected ? 'text-primary' : 'text-slate-600 group-hover:text-slate-800'
                            }`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
