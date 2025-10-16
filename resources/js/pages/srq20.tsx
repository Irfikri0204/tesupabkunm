import ProgressBar from '@/Components/ProgressBar';
import QuestionCard from '@/Components/QuestionCard';
import QuestionNavigation from '@/Components/QuestionNavigation';
import FormLayout from '@/layouts/FormLayout';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const questions = [
    { question: 'Apakah anda sering merasa sakit kepala?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah anda kehilangan nafsu makan?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah tidur anda nyenyak?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah anda mudah merasa takut?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah anda merasa cemas, tegang, atau khawatir?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah tangan anda gemetar?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah anda mengalami gangguan pencernaan?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah anda merasa sulit berpikir jernih?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah anda merasa tidak Bahagia?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah anda lebih sering menangis?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah anda merasa sulit untuk menikmati aktivitas sehari-hari?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah anda mengalami kesulitan untuk mengambil keputusan?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah aktivitas/tugas sehari-hari anda terbengkalai?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah anda merasa tidak mampu berperan dalam kehidupan ini?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah anda kehilangan minat terhadap banyak hal?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah anda merasa tidak berharga?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah anda mempunyai pemikiran mengakhiri hidup anda?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah anda merasa lelah sepanjang waktu?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah anda merasa tidak enak di perut?', answers: ['Ya', 'Tidak'] },
    { question: 'Apakah anda mudah lelah?', answers: ['Ya', 'Tidak'] },
];

export default function TesSrq20() {
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
            router.visit('/srq20/panas'); // kembali ke identitas jika tidak ada data
        }
    }, []);

    const handleSelect = (answer: string) => {
        const newAnswers = [...answers];
        newAnswers[currentIndex] = answer;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (answers[currentIndex] === '') {
            alert('Silakan pilih jawaban terlebih dahulu!');
            return;
        }

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
        // "Ya" bernilai 1, "Tidak" bernilai 0
        const totalSkor = answers.reduce((sum, ans) => sum + (ans === 'Ya' ? 1 : 0), 0);

        let kategori = '';
        if (totalSkor <= 5) kategori = 'Normal';
        else if (totalSkor <= 10) kategori = 'Perlu Perhatian';
        else kategori = 'Kemungkinan Gangguan Mental Emosional';

        return { totalSkor, kategori };
    };

    const handleSubmit = () => {
        if (!user) return alert('Data identitas tidak ditemukan.');
        setIsSubmitting(true);
        const { totalSkor, kategori } = calculateScore();

        // Simpan ke localStorage untuk halaman hasil
        localStorage.setItem('hasilSrq20', JSON.stringify({ totalSkor, kategori }));

        // Hapus identitas setelah selesai tes
        localStorage.removeItem('userData');

        // Kirim ke backend (opsional)
        router.post(
            '/tes/srq20/submit',
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
                    router.visit('/hasil/srq20');
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
