import Identitas from '@/Components/Identitas';
import IdentitasLayout from '@/layouts/IdentitasLayout';

export default function IdentitasGayaBelajar() {
    return (
        <IdentitasLayout>
            <Identitas testName="Kenali Kesehatan Mentalmu" nextUrl="/tes/srq20/soal" totalSoal={20} />
        </IdentitasLayout>
    );
}
