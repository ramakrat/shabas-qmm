import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import Layout from "~/components/Layout/Layout";
import AssessmentForm from '~/components/Assessor/AssessmentForm';
import { useSession } from 'next-auth/react';
import AccessDenied from '~/components/Common/AccessDenied';

const ReviewAssessment: NextPage = () => {

    const { data: session } = useSession();

    const { assessment } = useRouter().query;

    if (session?.user && session.user.role == 'ADMIN') {
        return (
            <Layout active='review-assessments'>
                <AssessmentForm assessment={Number(assessment)} status='assessor-review' />
            </Layout>
        );
    } else {
        return (
            <AccessDenied />
        )
    }
};

export default ReviewAssessment;