import FormLayout from '@/layouts/FormLayout';
import { Link } from '@inertiajs/react';

interface Props {
    title?: string;
    message?: string;
}

export default function TestClosed({
    title = 'Tes Ditutup',
    message = 'Tes ini sementara tidak menerima jawaban. Silakan cek kembali nanti.',
}: Props) {
    return (
        <FormLayout>
            <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-black/5">
                <div className="mb-8 rounded-3xl bg-gradient-to-r from-yellow-300 to-orange-500 p-8 text-amber-950 shadow-inner">
                    <h1 className="text-3xl font-black">{title}</h1>
                    <p className="mt-4 text-base leading-relaxed">{message}</p>
                </div>

                <div className="flex justify-center">
                    <Link
                        href="/"
                        className="w-full sm:w-auto rounded-2xl bg-purple-600 px-10 py-4 text-center font-bold text-white shadow-lg transition hover:bg-purple-700 hover:shadow-purple-200 hover:-translate-y-0.5 active:scale-95"
                    >
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </FormLayout>
    );
}
