import ProgressBar from '@/Components/ProgressBar';
import QuestionNavigation from '@/Components/QuestionNavigation';
import FormLayout from '@/layouts/FormLayout';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const questions = [
    "Saya senang membaca buku cerita, novel, atau komik di waktu luang.",
    "Saya mudah mengungkapkan perasaan atau ide lewat tulisan atau cerita.",
    "Saya pandai bermain kata-kata, teka-teki, atau permainan bahasa.",
    "Saya suka menulis puisi, cerita pendek, atau catatan harian.",
    "Saya mudah mengingat kutipan, slogan, atau lirik lagu.",
    "Saya senang memecahkan teka-teki logika, soal matematika, atau kuis sains.",
    "Saya suka mencari pola atau urutan, seperti angka atau gambar.",
    "Saya sering bertanya “kenapa” dan ingin tahu alasannya.",
    "Saya suka menyusun sesuatu secara rapi dan berurutan.",
    "Saya suka melakukan percobaan sederhana.",
    "Saya senang menggambar, melukis, atau membuat desain.",
    "Saya mudah membaca peta, diagram, atau denah tanpa banyak bantuan.",
    "Saya sering membayangkan sesuatu dalam bentuk gambar di kepala saya.",
    "Saya suka menyusun puzzle, lego, atau benda-benda tiga dimensi.",
    "Saya mudah mengingat detail tentang tampilan atau penampilan sesuatu.",
    "Saya mudah menghafal lagu baru hanya dengan mendengarkannya beberapa kali.",
    "Saya bisa membedakan nada atau irama dalam musik.",
    "Saya sering bernyanyi atau bersenandung sendiri.",
    "Saya merasa belajar lebih mudah jika ada latar musik tertentu.",
    "Saya tertarik belajar atau memainkan alat musik.",
    "Saya lebih mudah belajar jika bisa langsung mencoba atau bergerak.",
    "Saya senang berolahraga, menari, atau kegiatan fisik lainnya.",
    "Saya pandai dalam kegiatan yang membutuhkan koordinasi tangan dan mata.",
    "Saya sulit duduk diam terlalu lama; saya perlu bergerak agar bisa fokus.",
    "Saya suka membuat kerajinan tangan, memasak, atau memperbaiki benda.",
    "Saya mudah berteman dan senang berinteraksi dengan banyak orang.",
    "Saya pandai membaca perasaan atau suasana hati orang lain.",
    "Saya suka membantu menyelesaikan masalah atau konflik di antara teman.",
    "Saya merasa lebih semangat belajar saat bekerja dalam kelompok.",
    "Saya sering ikut memimpin atau membantu teman saat bermain.",
    "Saya suka merenung sendiri dan memahami perasaan serta pikiran sendiri.",
    "Saya tahu kelebihan dan kelemahan diri saya dengan cukup baik.",
    "Saya suka membuat target atau rencana untuk diri sendiri.",
    "Saya lebih nyaman belajar atau bekerja sendiri.",
    "Saya bisa menyemangati diri sendiri saat belajar.",
    "Saya suka mengamati alam: tumbuhan, hewan, cuaca, atau bintang.",
    "Saya suka mengelompokkan benda seperti daun, batu, atau hewan.",
    "Saya peduli terhadap kebersihan dan lingkungan.",
    "Saya suka kegiatan di luar ruangan: berkemah, berkebun, atau mendaki.",
    "Saya mudah mengingat nama-nama hewan, tanaman, atau fenomena alam."
];

const categories = [
    { name: 'Linguistik', questions: questions.slice(0, 5) },
    { name: 'Logis-Matematis', questions: questions.slice(5, 10) },
    { name: 'Spasial-Visual', questions: questions.slice(10, 15) },
    { name: 'Musikal', questions: questions.slice(15, 20) },
    { name: 'Kinestetik-Jasmani', questions: questions.slice(20, 25) },
    { name: 'Interpersonal', questions: questions.slice(25, 30) },
    { name: 'Intrapersonal', questions: questions.slice(30, 35) },
    { name: 'Naturalis', questions: questions.slice(35, 40) },
];

const options = [
    { label: 'Sesuai', value: '3' },
    { label: 'Kadang-kadang', value: '2' },
    { label: 'Tidak Sesuai', value: '1' }
];

export default function KecerdasanMajemuk() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<{ nama: string; kelas: string; sekolah: string } | null>(null);
    const [buktiFollow, setBuktiFollow] = useState<string | null>(null);
    const [currentCategory, setCurrentCategory] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const scrollAnchorRef = useRef<HTMLDivElement>(null);

    const currentQuestions = categories[currentCategory].questions;
    const progress = Math.round((Object.keys(answers).length / questions.length) * 100);

    useEffect(() => {
        document.body.classList.add('hide-scrollbar');
        const storedUser = localStorage.getItem('userDataKM');
        const storedBukti = localStorage.getItem('buktiFollowKM');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            alert('Data identitas tidak ditemukan. Silakan isi identitas terlebih dahulu.');
            router.visit('/tes/kecerdasan-majemuk');
        }

        if (storedBukti) {
            setBuktiFollow(storedBukti);
        }

        return () => {
            document.body.classList.remove('hide-scrollbar');
        };
    }, []);

    const handleSelect = (value: string, questionIndex: number) => {
        const questionNumber = currentCategory * 5 + questionIndex + 1;
        setAnswers({
            ...answers,
            [questionNumber]: value,
        });
    };

    const handleNext = () => {
        if (currentCategory < categories.length - 1) {
            setCurrentCategory(currentCategory + 1);
        } else {
            const answeredCount = Object.keys(answers).length;
            if (answeredCount < questions.length) {
                alert('Silakan jawab semua pertanyaan terlebih dahulu.');
                return;
            }
            handleSubmit();
        }
    };

    useEffect(() => {
        if (currentCategory > 0) {
            scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentCategory]);

    const handleSubmit = () => {
        if (!user) return;
        setIsSubmitting(true);

        // Convert base64 back to Blob for upload
        let file = null;
        if (buktiFollow) {
            const arr = buktiFollow.split(',');
            const mime = arr[0].match(/:(.*?);/)?.[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            file = new File([u8arr], 'bukti_follow.png', { type: mime });
        }

        // Send to backend
        router.post(
            '/tes/kecerdasan-majemuk/submit',
            {
                nama: user.nama,
                kelas: user.kelas,
                asal_sekolah: user.sekolah,
                bukti_follow: file,
                answers: answers,
            },
            {
                onSuccess: () => {
                    localStorage.removeItem('userDataKM');
                    localStorage.removeItem('buktiFollowKM');
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    console.error(errors);
                    alert('Terjadi kesalahan saat menyimpan hasil.');
                },
                forceFormData: true,
            }
        );
    };

    return (
        <FormLayout>
            <div ref={scrollAnchorRef} className="py-10 max-w-4xl mx-auto px-4 overflow-x-hidden hide-scrollbar">
                <div data-aos="fade-down">
                    <h1 className="mb-6 text-center text-2xl font-black text-purple-900 md:text-4xl tracking-tight">
                        Tes Kecerdasan Majemuk
                    </h1>

                    <div className="mb-8">
                        <ProgressBar currentIndex={currentCategory} progress={progress} total={categories.length} />
                        <div className="mt-2 flex justify-between text-[10px] font-black uppercase tracking-widest text-purple-400">
                            <span>Mulai</span>
                            <span>{progress}% Selesai</span>
                            <span>Selesai</span>
                        </div>

                        <div className="mt-6 rounded-3xl bg-gradient-to-br from-yellow-300 to-amber-500 p-6 shadow-xl text-amber-950">
                            <h3 className="text-lg font-black uppercase tracking-tight">Tips</h3>
                            <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">
                                Yuk, jawab sesuai dirimu.
                                Tidak perlu terlalu lama berpikir, karena tidak ada jawaban yang salah.
                                Pilih respon yang paling menggambarkan dirimu saat ini.
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    key={currentCategory}
                    className="mt-8 rounded-[2.5rem] bg-white p-5 sm:p-8 md:p-12 shadow-[0_20px_50px_rgba(166,124,186,0.15)] border border-purple-50 relative overflow-hidden"
                    data-aos="fade-up"
                    data-aos-duration="600"
                >
                    {/* Background decoration */}
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-50/50 blur-3xl"></div>
                    <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-50/50 blur-3xl"></div>

                    <div className="relative">
                        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-1.5 text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-purple-200">
                            Kategori {currentCategory + 1} <span className="opacity-50">/</span> {categories.length}
                        </span>

                        <h2 className="mt-8 text-2xl font-extrabold leading-snug text-gray-800 md:text-3xl md:leading-tight">
                            {categories[currentCategory].name}
                        </h2>

                        <div className="mt-8 space-y-8">
                            {currentQuestions.map((question, idx) => {
                                const questionNumber = currentCategory * 5 + idx + 1;
                                return (
                                    <div key={questionNumber} className="rounded-3xl border border-purple-100 bg-purple-50/70 p-4 sm:p-6">
                                        <p className="text-sm font-black uppercase tracking-[0.18em] text-purple-600">Soal {questionNumber}</p>
                                        <p className="mt-3 text-lg font-semibold text-gray-800">{question}</p>

                                        <div className="mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
                                            {options.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handleSelect(option.value, idx)}
                                                    className={`group relative rounded-2xl border-2 px-5 py-4 text-center transition-all duration-300 transform active:scale-95 touch-manipulation z-10 ${
                                                        answers[questionNumber] === option.value
                                                            ? 'border-purple-600 bg-purple-600 text-white shadow-xl shadow-purple-200 -translate-y-1'
                                                            : 'border-slate-100 bg-white text-purple-900 hover:border-purple-300 hover:bg-purple-50 hover:-translate-y-1'
                                                    }`}
                                                >
                                                    <span className="block text-base sm:text-lg font-black tracking-tight">{option.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="mt-10" data-aos="fade-up" data-aos-delay="400">
                    <QuestionNavigation
                        current={currentCategory}
                        total={categories.length}
                        onNext={handleNext}
                        onPrev={() => setCurrentCategory(currentCategory - 1)}
                        onSelect={(index) => setCurrentCategory(index)}
                        isSubmitting={isSubmitting}
                        answers={answers}
                        groupSize={5}
                    />
                </div>

                {/* Footnote */}
                <p className="mt-8 text-center text-xs font-bold text-gray-400 uppercase tracking-widest" data-aos="fade-up" data-aos-delay="600">
                    Jawaban Anda membantu kami memberikan saran terbaik
                </p>
            </div>
        </FormLayout>
    );
}
