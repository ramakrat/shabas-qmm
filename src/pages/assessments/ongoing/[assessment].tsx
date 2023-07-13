import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { api } from '~/utils/api';
import Layout from "~/components/Layout/Layout";
import AssessmentForm from '~/components/Assessment/AssessmentForm';

const OngoingAssessment: NextPage = () => {

    const { data: session } = useSession();

    const { assessment } = useRouter().query;

    const userCanAccess = api.assessmentUser.existsOnAssessment.useQuery({ userId: Number(session?.user.id), assessmentId: Number(assessment) }).data;

    return (
        <Layout active='ongoing-assessments' session={session} requiredRoles={['ASSESSOR', 'LEAD_ASSESSOR']} accessDenied={!userCanAccess}>
            <AssessmentForm assessment={Number(assessment)} status='ongoing' userId={Number(session?.user.id)} />
        </Layout>
    );
};

export default OngoingAssessment;