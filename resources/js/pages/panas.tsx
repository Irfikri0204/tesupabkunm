import ProgressBarPanas from '@/Components/ProgressPanas';
import QuestionPanasCard from '@/Components/QuestionCardPanas';
import QuestionNavigation from '@/Components/QuestionNavigation';
import FormLayout from '@/layouts/FormLayout';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// List pertanyaan
const questions = [
    'Tertarik',
    'Tertekan',
    'Bersemangat',
    'Kesal',
    'Kuat',
    'Bersalah',
    'Takut',
    'Bermusuhan',
    'Antusias',
    'Bangga',
    'Mudah Marah',
    'Waspada',
    'Malu',
    'Terinspirasi',
    'Gugup',
    'Bertekad Kuat',
    'Penuh Perhatian',
    'Gelisah',
    'Aktif',
    'Khawatir',
];

// Indeks soal PA dan NA
const PA = [1, 3, 5, 9, 10, 12, 14, 16, 17, 19];
const NA = [2, 4, 6, 7, 8, 11, 13, 15, 18, 20];

export default function TesPanas() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<{ nama: string; tanggal: string; jenisKelamin: string } | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));
    const currentQuestion = questions[currentIndex];
    const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

    // Ambil data user
    useEffect(() => {
        const stored = localStorage.getItem('userData');
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            alert('Data identitas tidak ditemukan. Silakan isi identitas terlebih dahulu.');
            router.visit('/tes/panas');
        }
    }, []);

    // Pilih jawaban
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

    const handleSelectQuestion = (index: number) => setCurrentIndex(index);

    // Submit jawaban
    const handleSubmit = () => {
        if (!user) return alert('Data identitas tidak ditemukan.');
        setIsSubmitting(true);

        // Hitung skor PA dan NA
        const skorPA = PA.reduce((sum, no) => sum + (answers[no - 1] || 0), 0);
        const skorNA = NA.reduce((sum, no) => sum + (answers[no - 1] || 0), 0);
        const totalSkor = skorPA - skorNA;

        let kategori = 'Seimbang';
        if (totalSkor < 0) kategori = 'Negatif';
        else if (totalSkor > 0) kategori = 'Positif';

        // Simpan hasil di localStorage
        const hasil = { kategori, totalSkor, skorPA, skorNA };
        localStorage.setItem('hasilPanas', JSON.stringify(hasil));
        localStorage.removeItem('userData');

        // Kirim ke backend
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
                <h1 className="mb-4 text-center text-lg font-bold md:text-2xl">Yuk, Jawab Semua Pernyataan!</h1>
                <h2 className="text-md mb-4 text-center font-semibold md:text-xl">
                    Berikut ini pernyataan yang menggambarkan perasaanmu selama seminggu terakhir. Silakan pilih frekuensi yang paling sesuai.
                </h2>

                <ProgressBarPanas currentIndex={currentIndex} progress={progress} total={questions.length} />

                <QuestionPanasCard
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
                    onPrev={() => setCurrentIndex(currentIndex - 1)}
                    onSelect={handleSelectQuestion}
                    isSubmitting={isSubmitting}
                    answers={answers}
                />
            </div>
        </FormLayout>
    );
}
