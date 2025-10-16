import ProgressBar from '@/Components/ProgressBar';
import QuestionCard from '@/Components/QuestionCard';
import QuestionNavigation from '@/Components/QuestionNavigation';
import FormLayout from '@/layouts/FormLayout';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const questions = [
    {
        question: 'Tertarik',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Tertekan',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Bersemangat',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Kesal',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Kuat',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Bersalah',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Takut',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Bermusuhan',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Antusias',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Bangga',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Mudah Marah',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Waspada',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Malu',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Terinspirasi',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Gugup',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Bertekad Kuat',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Penuh Perhatian',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Gelisah',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Aktif',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
    {
        question: 'Khawatir',
        answers: ['Hampir Selalu', 'Sering', 'Kadang-Kadang', 'Jarang', 'Hampir Tidak Pernah'],
    },
];

export default function TesPanas() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<{ nama: string; tanggal: string; jenisKelamin: string } | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));
    const currentQuestion = questions[currentIndex];
    const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

    useEffect(() => {
        const stored = localStorage.getItem('userData');
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            alert('Data identitas tidak ditemukan. Silakan isi identitas terlebih dahulu.');
            router.visit('/tes/panas'); // arahkan balik jika data belum ada
        }
    }, []);

    const handleSelect = (answer: string) => {
        const newAnswers = [...answers];
        newAnswers[currentIndex] = answer;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSelectQuestion = (index: number) => {
        setCurrentIndex(index);
    };

    const handleSubmit = () => {
        if (!user) return alert('Data identitas tidak ditemukan.');
        setIsSubmitting(true);
        // Mapping nilai jawaban (dari 5 ke 1)
        const skorMap: Record<string, number> = {
            'Hampir Selalu': 5,
            Sering: 4,
            'Kadang-Kadang': 3,
            Jarang: 2,
            'Hampir Tidak': 1,
        };

        // Soal yang termasuk kategori PA & NA
        const PA = [1, 3, 5, 9, 10, 12, 14, 16, 17, 19];
        const NA = [2, 4, 6, 7, 8, 11, 13, 15, 18, 20];

        // Hitung total skor PA dan NA
        const skorPA = PA.reduce((sum, no) => sum + (skorMap[answers[no - 1]] || 0), 0);
        const skorNA = NA.reduce((sum, no) => sum + (skorMap[answers[no - 1]] || 0), 0);

        const totalSkor = skorPA - skorNA;

        // Tentukan kategori
        let kategori = 'Seimbang';
        if (totalSkor < 0) kategori = 'Negatif';
        else if (totalSkor > 0) kategori = 'Positif';

        // Simpan ke localStorage
        const hasil = { kategori, totalSkor, skorPA, skorNA };
        localStorage.setItem('hasilPanas', JSON.stringify(hasil));
        localStorage.removeItem('userData');
        // Kirim ke Laravel (opsional)
        router.post(
            '/tes/panas/submit',
            {
                nama: user.nama,
                tanggal_lahir: user.tanggal,
                jenis_kelamin: user.jenisKelamin,
                answers,
                total_skor: totalSkor,
                kategori,
            },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    alert('Tes selesai! Jawaban kamu telah dikirim.');
                    router.visit('/hasil/panas');
                },
            },
        );
    };

    return (
        <FormLayout>
            <div className="py-6">
                <h1 className="mb-4 text-center text-2xl font-bold">Yuk, Jawab Semua Pertanyaan!</h1>

                <ProgressBar currentIndex={currentIndex} progress={progress} total={questions.length} />

                <QuestionCard
                    total={questions.length}
                    currentIndex={currentIndex}
                    question={currentQuestion.question}
                    answers={currentQuestion.answers}
                    selectedAnswer={answers[currentIndex]}
                    onSelect={handleSelect}
                />

                <QuestionNavigation
                    current={currentIndex}
                    total={questions.length}
                    onNext={handleNext}
                    onPrev={() => setCurrentIndex(currentIndex - 1)}
                    onSelect={handleSelectQuestion}
                    isSubmitting={isSubmitting}
                />
            </div>
        </FormLayout>
    );
}
