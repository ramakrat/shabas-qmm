import React from "react";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "~/components/Layout/Layout";

const Homepage: NextPage = () => {

    const { data: session } = useSession();

    return (
        <Layout session={session} requiredRoles={['ADMIN', 'ASSESSOR', 'LEAD_ASSESSOR', 'OVERSIGHT_ASSESSOR']}>
            <div className='page-message'>
                <span className='title'>
                    Welcome to Shabas QMM
                </span>
            </div>
        </Layout>
    );
};

export default Homepage;