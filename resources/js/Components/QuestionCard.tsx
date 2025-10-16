interface QuestionCardProps {
    currentIndex: number; // index pertanyaan saat ini (0-based)
    total: number; // total pertanyaan
    question: string;
    answers: string[];
    selectedAnswer: string | null;
    onSelect: (answer: string) => void;
}

export default function QuestionCard({ currentIndex, total, question, answers, selectedAnswer, onSelect }: QuestionCardProps) {
    return (
        <div className="mt-6">
            {/* Label dinamis */}
            <span className="inline-block rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-black">
                Pertanyaan {currentIndex + 1}
            </span>

            {/* Teks pertanyaan */}
            <h2 className="mt-4 text-lg font-semibold">{question}</h2>

            {/* Pilihan jawaban */}
            <div className="mt-4 space-y-3">
                {answers.map((answer, i) => (
                    <button
                        key={i}
                        onClick={() => onSelect(answer)}
                        className={`w-full rounded-xl border-2 p-3 text-left transition-all duration-200 ${
                            selectedAnswer === answer ? 'border-purple-600 bg-purple-100' : 'border-purple-300 hover:border-purple-500'
                        }`}
                    >
                        {answer}
                    </button>
                ))}
            </div>
        </div>
    );
}
