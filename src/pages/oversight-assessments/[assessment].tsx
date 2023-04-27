import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import Layout from "~/components/Layout/Layout";
import AssessmentForm from '~/components/Assessment/AssessmentForm';

const OversightAssessment: NextPage = () => {
    const { assessment } = useRouter().query;

    return (
        <Layout active='oversight-assessments'>
            <AssessmentForm assessment={Number(assessment)} status='oversight' />
        </Layout>
    );
};

export default OversightAssessment;