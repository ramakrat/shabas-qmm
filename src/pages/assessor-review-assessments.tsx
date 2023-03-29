import * as React from 'react';
import { type NextPage } from "next";

import { Button, Card, Grid } from '@mui/material';
import Layout from "~/components/Layout/Layout";
import QuestionContext from '~/components/Assessment/QuestionContext';
import QuestionForm from '~/components/Assessment/QuestionForm';
import QuestionRating from '~/components/Assessment/QuestionRating';
import QuestionReference from '~/components/Assessment/QuestionReference';
import QuestionsSidebar from '~/components/Assessment/QuestionsSidebar';

const ReviewAssessment: NextPage = () => {

    const [question, setQuestion] = React.useState<number>(1);

    return (
        <Layout active='review-assessments'>
            <div className='assessment'>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <QuestionsSidebar question={question} setQuestion={setQuestion} />
                    </Grid>
                    <Grid item xs={10} container spacing={2}>
                        <Grid item xs={12}>
                            <QuestionContext />
                        </Grid>
                        <Grid item xs={8}>
                            <QuestionRating review />
                            <QuestionForm />
                            <Card className='actions simple'>
                                <Button variant='contained'>Save</Button>
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                            <QuestionReference />
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </Layout>
    );
};

export default ReviewAssessment;