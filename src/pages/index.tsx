import React from "react";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "~/components/Layout/Layout";
import { Card } from "@mui/material";

const Homepage: NextPage = () => {

    const { data: session } = useSession();

    return (
        <Layout session={session} requiredRoles={['ADMIN', 'ASSESSOR', 'LEAD_ASSESSOR', 'OVERSIGHT_ASSESSOR']}>
            <div className='page-message'>
                <Card>
                    <span className='title'>
                        Welcome to Shabas QMM
                    </span>
                    <span className='subtitle'>
                        Select a feature at the top to get started
                    </span>
                </Card>
            </div>
        </Layout>
    );
};

export default Homepage;