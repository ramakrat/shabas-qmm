import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import ViewQuestion from '~/components/Question/ViewQuestion';
import EditQuestion from '~/components/Question/EditQuestion';

const Question: NextPage = () => {

    const { data: session } = useSession();

    const { question } = useRouter().query;

    const { data } = api.question.getByIdInclude.useQuery({ id: Number(question) });
    
    const inUse = api.assessmentQuestion.getByQuestionUsage.useQuery(Number(question)).data ? true : false;


    if (inUse) {
        return (
            <Layout active='questions' session={session} requiredRoles={['ADMIN']}>
                <ViewQuestion data={data} />
            </Layout>
        )
    }
    return (
        <Layout active='questions' session={session} requiredRoles={['ADMIN']}>
            <EditQuestion data={data} />
        </Layout>
    );
};

export default Question;