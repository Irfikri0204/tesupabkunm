import { TesShow } from '@/Components/Admin/TesShow';
import { RiFireLine } from '@remixicon/react';
import React from 'react';

export default function Show({ data }: any) {
    return (
        <TesShow
            data={data}
            title="Tes Pola Emosi (PANAS)"
            backUrl="/admin/panas"
            color="from-orange-500 to-red-600"
            icon={<RiFireLine size={32} />}
        />
    );
}
