import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import Layout from "~/components/Layout/Layout";
import AssessmentForm from '~/components/Assessor/AssessmentForm';
import { useSession } from 'next-auth/react';
import AccessDenied from '~/components/Common/AccessDenied';
import { api } from '~/utils/api';

const OngoingAssessment: NextPage = () => {

    const { data: session } = useSession();

    const { assessment } = useRouter().query;

    const userCanAccess = api.assessmentUser.existsOnAssessment.useQuery({ userId: Number(session?.user.id), assessmentId: Number(assessment) }).data;

    if (session?.user && session.user.role == 'ADMIN' && userCanAccess) {
        return (
            <Layout active='ongoing-assessments'>
                <AssessmentForm assessment={Number(assessment)} status='ongoing' userId={Number(session.user.id)} />
            </Layout>
        );
    } else {
        return (
            <AccessDenied />
        )
    }
};

export default OngoingAssessment;