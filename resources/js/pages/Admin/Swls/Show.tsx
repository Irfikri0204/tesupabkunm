import { TesShow } from '@/Components/Admin/TesShow';
import { RiHeartLine } from '@remixicon/react';
import React from 'react';

export default function Show({ data }: any) {
    return (
        <TesShow
            data={data}
            title="Tes Kepuasan Hidup (SWLS)"
            backUrl="/admin/swls"
            color="from-blue-500 to-indigo-600"
            icon={<RiHeartLine size={32} />}
        />
    );
}
