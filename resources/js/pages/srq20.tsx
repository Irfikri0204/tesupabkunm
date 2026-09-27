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

    // Cek apakah data identitas tersimpan
    useEffect(() => {
        const stored = localStorage.getItem('userData');
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            alert('Data identitas tidak ditemukan. Silakan isi identitas terlebih dahulu.');
            router.visit('/srq20/panas');
        }
    }, []);

    const handleSelect = (answer: string) => {
        const newAnswers = [...answers];
        newAnswers[currentIndex] = answer;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (isSubmitting) return; // jangan lanjut kalau sedang submit

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Validasi: pastikan semua sudah dijawab
            const totalDijawab = answers.filter((a) => a !== '').length;
            if (totalDijawab < questions.length) {
                alert('Silakan jawab semua pertanyaan terlebih dahulu sebelum mengirim.');
                return;
            }
            handleSubmit();
        }
    };

    const handleSelectQuestion = (index: number) => {
        if (!isSubmitting) setCurrentIndex(index);
    };

    const calculateScore = () => {
        const totalSkor = answers.reduce((sum, ans) => sum + (ans === 'Ya' ? 1 : 0), 0);
        let kategori = '';
        if (totalSkor <= 5) kategori = 'Normal';
        else if (totalSkor <= 10) kategori = 'Perlu Perhatian';
        else kategori = 'Kemungkinan Gangguan Mental';
        return { totalSkor, kategori };
    };

    const handleSubmit = async () => {
        if (!user) {
            alert('Data identitas tidak ditemukan.');
            return router.visit('/tes/srq20');
        }

        setIsSubmitting(true);

        const { totalSkor, kategori } = calculateScore();
        localStorage.setItem('hasilSrq20', JSON.stringify({ totalSkor, kategori }));
        localStorage.removeItem('userData');

        try {
            await router.post(
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
                    preserveScroll: true,
                    onSuccess: () => {
                        alert('Tes selesai! Jawaban kamu telah dikirim.');
                        router.visit('/hasil/srq20');
                    },
                    onError: (errors) => {
                        console.error(errors);
                        alert('Gagal mengirim data, silakan coba lagi.');
                    },
                    onFinish: () => setIsSubmitting(false),
                },
            );
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan koneksi. Silakan coba lagi.');
            setIsSubmitting(false);
        }
    };

    if (!user) return <div className="py-20 text-center">Memuat data...</div>;

    return (
        <FormLayout>
            <div className="py-6">
                <h1 className="mb-4 text-center text-lg font-bold md:text-2xl">Yuk, Jawab Semua Pertanyaan!</h1>

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
                    answers={answers}
                />
            </div>
        </FormLayout>
    );
}
