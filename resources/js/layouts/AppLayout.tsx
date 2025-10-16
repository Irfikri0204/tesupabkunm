import Header from '@/Components/Header';
import { PropsWithChildren } from 'react';

export default function AppLayout({ children }: PropsWithChildren<{}>) {
    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
}
