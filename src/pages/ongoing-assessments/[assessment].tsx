import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import Layout from "~/components/Layout/Layout";
import AssessmentForm from '~/components/Assessment/AssessmentForm';

const OngoingAssessment: NextPage = () => {
    const { assessment } = useRouter().query;

    return (
        <Layout active='ongoing-assessments'>
            <AssessmentForm assessment={Number(assessment)} status='ongoing' />
        </Layout>
    );
};

export default OngoingAssessment;