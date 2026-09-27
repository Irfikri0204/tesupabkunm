import { TesShow } from '@/Components/Admin/TesShow';
import { RiUserHeartLine } from '@remixicon/react';
import React from 'react';

export default function Show({ data }: any) {
    return (
        <TesShow
            data={data}
            title="Tes Kenali Gaya Belajarmu"
            backUrl="/admin/gaya-belajar"
            color="from-pink-500 to-rose-600"
            icon={<RiUserHeartLine size={32} />}
        />
    );
}
