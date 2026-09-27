import { TesShow } from '@/Components/Admin/TesShow';
import { RiMentalHealthLine } from '@remixicon/react';
import React from 'react';

export default function Show({ data }: any) {
    return (
        <TesShow
            data={data}
            title="Tes Kesehatan Mental (SRQ-20)"
            backUrl="/admin/srq20"
            color="from-teal-500 to-emerald-600"
            icon={<RiMentalHealthLine size={32} />}
        />
    );
}
