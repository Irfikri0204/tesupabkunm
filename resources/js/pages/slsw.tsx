import ProgressBarPanas from '@/Components/ProgressPanas';
import QuestionSwlsCard from '@/Components/QuestionCardSwls';
import QuestionNavigation from '@/Components/QuestionNavigation';
import FormLayout from '@/layouts/FormLayout';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const questions = [
    'Secara keseluruhan, kehidupan saya hampir seperti dengan apa yang saya harapkan',
    'Kondisi kehidupan saya sangat baik',
    'Saya puas dengan kehidupan saya',
    'Sejauh ini, saya telah mendapatkan hal penting yang saya inginkan dalam hidup',
    'Seandainya saya dapat mengulang hidup saya, hampir tidak ada yang ingin saya ubah',
];

export default function TesSlws() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<{ nama: string; tanggal: string; jenisKelamin: string } | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));
    const [result, setResult] = useState<{ totalSkor: number; kategori: string } | null>(null);

    const currentQuestion = questions[currentIndex];
    const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

    useEffect(() => {
        const stored = localStorage.getItem('userData');
        if (stored) setUser(JSON.parse(stored));
        else {
            alert('Data identitas tidak ditemukan. Silakan isi identitas terlebih dahulu.');
            router.visit('/tes/swls');
        }
    }, []);

    const handleSelect = (answer: number) => {
        const newAnswers = [...answers];
        newAnswers[currentIndex] = answer;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Validasi: pastikan semua sudah dijawab
            const totalDijawab = answers.filter((a) => a !== 0).length;
            if (totalDijawab < questions.length) {
                alert('Silakan jawab semua pernyataan terlebih dahulu sebelum mengirim.');
                return;
            }
            handleSubmit();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const handleSelectQuestion = (index: number) => setCurrentIndex(index);

    const calculateScore = () => {
        const total = answers.reduce((sum, ans) => sum + ans, 0);

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

        localStorage.setItem('hasilSwls', JSON.stringify({ totalSkor, kategori }));
        localStorage.removeItem('userData');

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
                <h1 className="mb-4 text-center text-lg font-bold md:text-2xl">Yuk, Jawab Semua Pernyataan!</h1>
                <h2 className="text-md mb-4 text-center font-semibold md:text-xl">
                    Berikut ini adalah pernyataan yang mungkin kamu alami berkaitan dengan kehidupan kamu. Jawablah pernyataan berikut ini sesuai
                    keadaanmu.
                </h2>

                <ProgressBarPanas currentIndex={currentIndex} progress={progress} total={questions.length} />

                <QuestionSwlsCard
                    total={questions.length}
                    currentIndex={currentIndex}
                    question={currentQuestion}
                    selectedAnswer={answers[currentIndex] || null}
                    onSelect={handleSelect}
                />

                <QuestionNavigation
                    current={currentIndex}
                    total={questions.length}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onSelect={handleSelectQuestion}
                    isSubmitting={isSubmitting}
                    answers={answers}
                />
            </div>
        </FormLayout>
    );
}
