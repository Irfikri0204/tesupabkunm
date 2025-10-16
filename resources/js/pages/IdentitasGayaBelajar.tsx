import Identitas from '@/Components/Identitas';
import IdentitasLayout from '@/layouts/IdentitasLayout';

export default function IdentitasGayaBelajar() {
    return (
        <IdentitasLayout>
            <Identitas testName="Gaya Belajar" nextUrl="/tes/gayabelajar/soal" totalSoal={10} />
        </IdentitasLayout>
    );
}
