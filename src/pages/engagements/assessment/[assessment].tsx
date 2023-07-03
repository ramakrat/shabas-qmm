import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import ViewAssessment from '~/components/EngagementAssessment/ViewAssessment';
import EditAssessment from '~/components/EngagementAssessment/EditAssessment';


const Assessment: NextPage = () => {

    const { data: session } = useSession();

    const { assessment } = useRouter().query;

    const data = api.assessment.getByIdInclude.useQuery({ id: assessment ? Number(assessment) : undefined }).data;

    if (data && data.status != 'created') {
        return (
            <Layout active='assessments' session={session} requiredRoles={['ADMIN']}>
                <ViewAssessment data={data} />
            </Layout>
        )
    }
    return (
        <Layout active='assessments' session={session} requiredRoles={['ADMIN']}>
            <EditAssessment data={data} />
        </Layout>
    );
};

export default Assessment;