import Identitas from '@/Components/Identitas';
import IdentitasLayout from '@/layouts/IdentitasLayout';

export default function IdentitasGayaBelajar() {
    return (
        <IdentitasLayout>
            <Identitas testName="Positive Affect Negative Affect Schedule" nextUrl="/tes/panas/soal" totalSoal={20} />
        </IdentitasLayout>
    );
}
