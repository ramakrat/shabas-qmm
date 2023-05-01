import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import Layout from "~/components/Layout/Layout";
import AssessmentForm from '~/components/Assessor/AssessmentForm';

const ReviewAssessment: NextPage = () => {
    const { assessment } = useRouter().query;

    return (
        <Layout active='review-assessments'>
            <AssessmentForm assessment={Number(assessment)} status='assessor-review' />
        </Layout>
    );
};

export default ReviewAssessment;