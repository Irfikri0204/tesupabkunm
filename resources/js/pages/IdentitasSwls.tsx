import Identitas from '@/Components/Identitas';
import IdentitasLayout from '@/layouts/IdentitasLayout';

export default function IdentitasGayaBelajar() {
    return (
        <IdentitasLayout>
            <Identitas testName="Satisfaction with Life Scale" nextUrl="/tes/swls/soal" totalSoal={5} />
        </IdentitasLayout>
    );
}
