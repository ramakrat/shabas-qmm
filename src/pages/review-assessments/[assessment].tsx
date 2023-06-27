import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import Layout from "~/components/Layout/Layout";
import AssessmentForm from '~/components/Assessor/AssessmentForm';
import { useSession } from 'next-auth/react';
import { api } from '~/utils/api';

const ReviewAssessment: NextPage = () => {

    const { data: session } = useSession();

    const { assessment } = useRouter().query;

    const userCanAccess = api.assessmentUser.existsOnAssessment.useQuery({ userId: Number(session?.user.id), assessmentId: Number(assessment) }).data;

    return (
        <Layout active='review-assessments' session={session} requiredRoles={['LEAD_ASSESSOR']} accessDenied={!userCanAccess}>
            <AssessmentForm assessment={Number(assessment)} status='assessor-review' userId={Number(session?.user.id)} />
        </Layout>
    );
};

export default ReviewAssessment;