import Identitas from '@/Components/Identitas';
import IdentitasLayout from '@/layouts/IdentitasLayout';

export default function IdentitasGayaBelajar() {
    return (
        <IdentitasLayout>
            <Identitas testName="Dimensi Kepuasan Hidup" nextUrl="/tes/swls/soal" totalSoal={5} />
        </IdentitasLayout>
    );
}
