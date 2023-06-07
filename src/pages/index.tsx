import React from "react";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "~/components/Layout/Layout";
import AccessDenied from "~/components/Common/AccessDenied";

const Homepage: NextPage = () => {

    const { data: session } = useSession();

    if (session && session.user) {
        return (
            <Layout admin={session.user.role == 'ADMIN'}>
                <div className='page-message'>
                    <span className='title'>
                        Welcome to Shabas QMM
                    </span>
                </div>
            </Layout>
        );
    } else {
        return (
            <AccessDenied />
        )
    }
};

export default Homepage;