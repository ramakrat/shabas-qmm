import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { api } from '~/utils/api';
import Layout from "~/components/Layout/Layout";
import AssessmentForm from '~/components/Assessment/AssessmentForm';

const OversightAssessment: NextPage = () => {

    const { data: session } = useSession();

    const { assessment } = useRouter().query;

    const userCanAccess = api.assessmentUser.existsOnAssessment.useQuery({ userId: Number(session?.user.id), assessmentId: Number(assessment) }).data;

    return (
        <Layout active='oversight-assessments' session={session} requiredRoles={['OVERSIGHT_ASSESSOR']} accessDenied={!userCanAccess}>
            <AssessmentForm assessment={Number(assessment)} status='oversight' userId={Number(session?.user.id)} />
        </Layout>
    );
};

export default OversightAssessment;