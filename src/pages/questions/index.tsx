import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';

import { Grid } from '@mui/material';

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import QuestionsSidebar from '~/components/Assessment/QuestionsSidebar';

const Question: NextPage = () => {

    const { push } = useRouter();

    const setQuestionSelection = (question: number) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        push(`/questions/${question}`);
    }

    // =========== Retrieve Form Context ===========

    const questions = api.question.getAll.useQuery(true).data;

    return (
        <Layout active='questions'>
            <div className='assessment'>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        {questions &&
                            <QuestionsSidebar
                                questions={questions}
                                question={-1}
                                setQuestion={setQuestionSelection}
                                addOption
                            />
                        }
                    </Grid>
                </Grid>
            </div>
        </Layout>
    );
};

export default Question;