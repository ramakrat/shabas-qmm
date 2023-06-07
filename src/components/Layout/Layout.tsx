import * as React from 'react';
import Head from 'next/head';

import Header from './Header';


interface Props {
    active?: string;
    children?: React.ReactNode;
    admin?: boolean;
    empty?: boolean;
}

export const Layout: React.FC<Props> = (props) => {

    const { active, children, admin, empty } = props;

    return (
        <div>
            <Head>
                <title>Shabas QMM</title>
                <meta name="description" content="Shabas QMM" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className='content-body'>
                <Header active={active} admin={admin} empty={empty} />
                {children}
            </main>
        </div>
    )
}

export default Layout;