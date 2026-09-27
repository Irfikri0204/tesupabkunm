import AdminLayout from '@/layouts/AdminLayout';
import { TesList } from '../Panas/Index';
import React from 'react';

export default function Index({ data, filters }: any) {
    return (
        <AdminLayout title="Tes Kesehatan Mental (SRQ-20)">
            <TesList
                data={data}
                title="Daftar Hasil Tes SRQ-20"
                exportUrl="/admin/srq20/export/excel"
                deleteUrl={(id) => `/admin/srq20/${id}`}
                viewUrl={(id) => `/admin/srq20/${id}`}
                filters={filters}
                filterUrl="/admin/srq20"
            />
        </AdminLayout>
    );
}