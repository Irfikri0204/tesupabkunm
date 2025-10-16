import Identitas from '@/Components/Identitas';
import IdentitasLayout from '@/layouts/IdentitasLayout';

export default function IdentitasGayaBelajar() {
    return (
        <IdentitasLayout>
            <Identitas testName="SRQ-20" nextUrl="/tes/srq20/soal" totalSoal={20} />
        </IdentitasLayout>
    );
}
