import background from '@/../img/background.png';
import image from '@/../img/hero-section.png';
import ButtonPrimary from '@/Components/ButtonPrimary';
import CardTes from '@/Components/CardTes';
import AppLayout from '@/layouts/AppLayout';

export default function Home() {
    return (
        <AppLayout>
            <div className="hero-section flex flex-col items-center justify-around gap-x-30 px-8 py-20 md:flex-row">
                <div
                    className="konten flex w-full flex-col gap-y-6 md:w-1/2"
                    data-aos="fade-right"
                    data-aos-anchor="#example-anchor"
                    data-aos-offset="500"
                    data-aos-duration="700"
                >
                    <h2 className="w-fit rounded-xl bg-[#A67CBA] px-4 py-2 font-semibold text-white">Platform Tes Psikologi</h2>
                    <h1 className="text-3xl font-semibold">
                        Kenali Dirimu <span className="text-[#FFD700]">Lebih Dalam</span>
                    </h1>
                    <p>
                        Unit Penunjang Akademik Bimbingan dan Konseling Universitas Negeri Makassar menyediakan berbagai tes psikologi untuk membantu
                        Anda memahami diri dengan lebih baik.
                    </p>
                    <ButtonPrimary text="Mulai Tes Sekarang" link="#tes" />
                </div>
                <img
                    src={image}
                    alt="gambar tes psikologi"
                    className="w-[400px]"
                    data-aos="fade-left"
                    data-aos-anchor="#example-anchor"
                    data-aos-offset="500"
                    data-aos-duration="700"
                />
            </div>
            <div style={{ backgroundImage: `url(${background})` }} className="tes bg-cover bg-center px-10 py-20 text-white" id="tes">
                <h1 className="mb-4 text-center text-2xl font-semibold">Tes Yang Tersedia</h1>
                <p className="text-center">Pilih Tes yang Sesuai dengan Kebutuhan Anda</p>
                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4" data-aos="fade-up" data-aos-duration="900">
                    <CardTes title="Tes PANAS" description="Mengukur Skala Afek Positif dan Negatif dalam Kehidupan Sehari-hari" link="/tes/panas" />
                    <CardTes
                        title="Tes SWLS"
                        description="Mengukur tingkat kepuasan individu terhadap kehidupan yang dijalaninya secara menyeluruh"
                        link="/tes/swls"
                    />
                    <CardTes title="Tes Gaya Belajar" description="Mengetahui Gaya Belajar yang Paling Efektif Untuk Anda" link="/tes/gayabelajar" />
                    <CardTes title="Tes SRQ-20" description="Screening Kesehatan Mental dan Deteksi Dini Gangguan Psikologis" link="/tes/srq20" />
                </div>
            </div>
        </AppLayout>
    );
}
