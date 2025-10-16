import ProgressBar from '@/Components/ProgressBar';
import QuestionCard from '@/Components/QuestionCard';
import QuestionNavigation from '@/Components/QuestionNavigation';
import FormLayout from '@/layouts/FormLayout';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const questions = [
    {
        question: 'Secara keseluruhan, kehidupan saya hampir seperti dengan apa yang saya harapkan',
        answers: ['Sangat Sesuai', 'Sesuai', 'Agak Sesuai', 'Netral', 'Tidak Sesuai', 'Sangat Tidak Sesuai'],
    },
    {
        question: 'Kondisi kehidupan saya sangat baik',
        answers: ['Sangat Sesuai', 'Sesuai', 'Agak Sesuai', 'Netral', 'Tidak Sesuai', 'Sangat Tidak Sesuai'],
    },
    {
        question: 'Saya puas dengan kehidupan saya',
        answers: ['Sangat Sesuai', 'Sesuai', 'Agak Sesuai', 'Netral', 'Tidak Sesuai', 'Sangat Tidak Sesuai'],
    },
    {
        question: 'Sejauh ini, saya telah mendapatkan hal penting yang saya inginkan dalam hidup',
        answers: ['Sangat Sesuai', 'Sesuai', 'Agak Sesuai', 'Netral', 'Tidak Sesuai', 'Sangat Tidak Sesuai'],
    },
    {
        question: 'Seandainya saya dapat mengulang hidup saya, hampir tidak ada yang ingin saya ubah',
        answers: ['Sangat Sesuai', 'Sesuai', 'Agak Sesuai', 'Netral', 'Tidak Sesuai', 'Sangat Tidak Sesuai'],
    },
];

export default function Slws() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<{ nama: string; tanggal: string; jenisKelamin: string } | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [result, setResult] = useState<{ totalSkor: number; kategori: string } | null>(null);
    const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));

    const currentQuestion = questions[currentIndex];
    const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

    useEffect(() => {
        const stored = localStorage.getItem('userData');
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            alert('Data identitas tidak ditemukan. Silakan isi identitas terlebih dahulu.');
            router.visit('/tes/swls'); // arahkan balik jika data belum ada
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
    const calculateScore = () => {
        const skorMap: Record<string, number> = {
            'Sangat Sesuai': 7,
            Sesuai: 6,
            'Agak Sesuai': 5,
            Netral: 4,
            'Tidak Sesuai': 3,
            'Sangat Tidak Sesuai': 1,
        };

        const total = answers.reduce((sum, ans) => sum + (skorMap[ans] || 0), 0);

        let kategori = '';
        if (total >= 31 && total <= 35) kategori = 'Sangat Puas';
        else if (total >= 26 && total <= 30) kategori = 'Puas';
        else if (total >= 21 && total <= 25) kategori = 'Netral';
        else if (total >= 15 && total <= 20) kategori = 'Tidak Puas';
        else if (total >= 5 && total <= 14) kategori = 'Sangat Tidak Puas';
        else kategori = 'Belum dikategorikan';

        return { totalSkor: total, kategori };
    };

    const handleSubmit = () => {
        if (!user) return alert('Data identitas tidak ditemukan.');
        setIsSubmitting(true);
        const { totalSkor, kategori } = calculateScore();
        setResult({ totalSkor, kategori });

        // Simpan ke localStorage agar bisa dibaca di halaman hasil
        localStorage.setItem('hasilSwls', JSON.stringify({ totalSkor, kategori }));

        localStorage.removeItem('userData');
        // Kirim ke backend (opsional)
        router.post(
            '/tes/swls/submit',
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
                    router.visit('/hasil/swls');
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
                />
            </div>
        </FormLayout>
    );
}
