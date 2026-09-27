import AdminLayout from '@/layouts/AdminLayout';
import { TesList } from '../Panas/Index';
import React from 'react';

export default function Index({ data, filters }: any) {
    return (
        <AdminLayout title="Tes Kepuasan Hidup (SWLS)">
            <TesList
                data={data}
                title="Daftar Hasil Tes SWLS"
                exportUrl="/admin/swls/export/excel"
                deleteUrl={(id) => `/admin/swls/${id}`}
                viewUrl={(id) => `/admin/swls/${id}`}
                filters={filters}
                filterUrl="/admin/swls"
            />
        </AdminLayout>
    );
}