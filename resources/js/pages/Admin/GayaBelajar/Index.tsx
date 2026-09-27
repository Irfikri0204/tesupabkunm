import AdminLayout from '@/layouts/AdminLayout';
import { TesList } from '../Panas/Index';
import React from 'react';

export default function Index({ data, filters }: any) {
    return (
        <AdminLayout title="Tes Kenali Gaya Belajarmu">
            <TesList
                data={data}
                title="Daftar Hasil Tes Gaya Belajar"
                exportUrl="/admin/gaya-belajar/export/excel"
                deleteUrl={(id) => `/admin/gaya-belajar/${id}`}
                viewUrl={(id) => `/admin/gaya-belajar/${id}`}
                filters={filters}
                filterUrl="/admin/gaya-belajar"
            />
        </AdminLayout>
    );
}