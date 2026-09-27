import Identitas from '@/Components/Identitas';
import IdentitasLayout from '@/layouts/IdentitasLayout';

export default function IdentitasGayaBelajar() {
    return (
        <IdentitasLayout>
            <Identitas testName="Pola Emosimu" nextUrl="/tes/panas/soal" totalSoal={20} />
        </IdentitasLayout>
    );
}
