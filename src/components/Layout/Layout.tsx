import * as React from 'react';
import Head from 'next/head';

import Header from './Header';

export type Tabs = 'dashboard' | 'assessments' | 'questions' | 'ongoing-assessments' | 'review-assessments' | 'oversight-assessments';

interface Props {
    active: Tabs;
    children?: React.ReactNode;
}

export const Layout: React.FC<Props> = (props) => {

    const { active, children } = props;
    return (
        <div>
            <Head>
                <title>Shabas QMM</title>
                <meta name="description" content="Shabas QMM" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className='content-body'>
                <Header active={active} />
                {children}
            </main>
        </div>
    )
}

export default Layout;