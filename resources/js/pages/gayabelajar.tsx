import ProgressBar from '@/Components/ProgressBar';
import QuestionCard from '@/Components/QuestionCard';
import QuestionNavigation from '@/Components/QuestionNavigation';
import FormLayout from '@/layouts/FormLayout';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const questions = [
    {
        question: 'Ketika berbicara, kamu…',
        answers: ['Berbicara dengan tempo yang cepat', 'Berbicara dengan tempo yang sedang', 'Berbicara dengan tempo yang lambat'],
    },
    {
        question: 'Bagaimana caramu menghapal?',
        answers: ['Menulisnya berulang-ulang', 'Mengulang kata-kata sekeras mungkin', 'Menghafal sambil berjalan-jalan'],
    },
    {
        question: 'Ketika mengeja sebuah kata, yang kamu lakukan adalah…',
        answers: ['Membayangkan kata itu', 'Menyebutnya dengan keras', 'Menuliskannya'],
    },
    {
        question: 'Apa yang bisa membuatmu terganggu?',
        answers: ['Benda-benda di sekitar', 'Suara', 'Gerakan'],
    },
    {
        question: 'Apa yang paling kamu ingat?',
        answers: ['Orang, lingkungan, wajah', 'Perkataan, suara, makna', 'Kejadian, peristiwa, emosi'],
    },
    {
        question: 'Apa yang lebih kamu sukai?',
        answers: ['Lukisan', 'Musik', 'Menari/Olahraga'],
    },
    {
        question: 'Ketika membaca, apa yang kamu lakukan?',
        answers: ['Melihat bacaan sambil membaca dalam hati', 'Membaca dengan bersuara', 'Menggunakan jari untuk menunjuk bagian yang dibaca'],
    },
    {
        question: 'Ketika mendapat petunjuk cara pasang, apa yang kamu butuhkan?',
        answers: [
            'Diberi gambar untuk ditirukan',
            'Diberi tahu dengan kata-kata bagaimana cara melakukannya',
            'Diberi contoh untuk diperagakan secara langsung',
        ],
    },
    {
        question: 'Ketika ingat pasar, apa yang pertama muncul dalam pikiranmu?',
        answers: [
            'Pemandangan tentang orang-orang yang berbelanja dan barang-barang yang diperjualbelikan',
            'Ramainya suara orang-orang di pasar',
            'Orang-orang yang hilir mudik dan lalu-lalang di pasar',
        ],
    },
    {
        question: 'Ketika akan tidur, apa yang terpenting buatmu?',
        answers: ['Kamar yang gelap/samar/terang', 'Kamar yang tenang tidak berisik', 'Tempat tidur yang nyaman'],
    },
];

export default function TesGayaBelajar() {
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
            router.visit('/tes/gayabelajar'); // arahkan balik jika data belum ada
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
        setCurrentIndex(index);
    };

    const handleSubmit = () => {
        if (!user) return alert('Data identitas tidak ditemukan.');
        setIsSubmitting(true);
        // Hitung skor
        let skorA = 0,
            skorB = 0,
            skorC = 0;
        answers.forEach((answer, i) => {
            const idx = questions[i].answers.indexOf(answer);
            if (idx === 0) skorA++;
            else if (idx === 1) skorB++;
            else if (idx === 2) skorC++;
        });

        // Tentukan kategori dominan
        let kategori = 'visual';
        if (skorB > skorA && skorB > skorC) kategori = 'auditory';
        else if (skorC > skorA && skorC > skorB) kategori = 'kinesthetic';

        const total_skor = Math.max(skorA, skorB, skorC);
        localStorage.removeItem('userData');
        // Kirim ke backend
        router.post(
            '/tes/gayabelajar/submit',
            {
                nama: user.nama,
                tanggal_lahir: user.tanggal,
                jenis_kelamin: user.jenisKelamin,
                answers,
                total_skor,
                kategori,
            },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    // Simpan ke localStorage untuk ditampilkan di hasil
                    localStorage.setItem(
                        'hasilGayaBelajar',
                        JSON.stringify({
                            kategori,
                            total_skor,
                        }),
                    );

                    alert('Tes selesai! Jawaban kamu telah dikirim.');
                    router.visit('/hasil/gayabelajar');
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    console.error(errors);
                    alert('Gagal mengirim data, silakan coba lagi.');
                },
            },
        );
    };

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
