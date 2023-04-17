import * as React from 'react';
import { type NextPage } from "next";
import Router, { useRouter } from 'next/router';
import type { Answer, Assessment, AssessmentQuestion, Engagement, Filter, InterviewGuide, Question, Rating, Reference } from '@prisma/client';

import * as yup from "yup";
import { Field, Form, Formik, type FormikHelpers } from "formik";
import TextField from '~/components/Form/TextField';

import { Button, Card, Grid, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import QuestionsSidebar from '~/components/Assessment/QuestionsSidebar';
import QuestionContext from '~/components/Assessment/QuestionContext';

interface FormValues {
    rating: string;
    rationale: string;
    notes: string;
}

const validationSchema = yup.object().shape({
    rating: yup.string().required("Required"),
    rationale: yup.string().required("Required"),
    notes: yup.string().required("Required"),
});

const OngoingAssessment: NextPage = () => {

    const { assessment } = useRouter().query;

    // =========== Retrieve Form Context ===========

    const data = api.assessment.getByIdIncludeAssessor.useQuery({ id: Number(assessment) }).data as (
        Assessment & {
            engagement: Engagement;
            AssessmentQuestion: (AssessmentQuestion & {
                question: Question & {
                    Rating: Rating[];
                    Reference: Reference[];
                    InterviewGuide: InterviewGuide[];
                };
                filter: Filter | null;
                answer: Answer | null;
            })[];
        }
    );

    const assessmentStatus = api.assessment.status.useMutation();
    const engagementStatus = api.engagement.status.useMutation();


    // Update the statuses of Assessment and Engagement if needed
    React.useEffect(() => {
        if (data) {
            if (data.status == 'created' || data.status == '') {
                assessmentStatus.mutate({
                    id: data.id,
                    status: 'in-progress',
                })
                if (data.engagement.status == 'created' || data.status == '') {
                    engagementStatus.mutate({
                        id: data.id,
                        status: 'in-progress',
                    })
                }
            }
        }
    }, [data])

    const convertToQuestion = (object: (Question & {
        Rating?: Rating[];
        Reference?: Reference[];
        InterviewGuide?: InterviewGuide[];
    })) => {
        const q = object;
        delete q.Rating;
        delete q.InterviewGuide;
        delete q.Reference;
        return q as Question;
    }

    const questions = data?.AssessmentQuestion;

    const [question, setQuestion] = React.useState<number>(questions && questions[0] ? questions[0].question.id : -1);

    React.useEffect(() => {
        setQuestion(questions && questions[0] ? questions[0].question.id : -1)
    }, [questions])

    const selectedAssessmentQuestion = data?.AssessmentQuestion.find(o => o.question.id == question);
    const questionRef = selectedAssessmentQuestion?.question;
    const ratings = api.rating.getByQuestionFilter.useQuery({ questionId: questionRef?.id, filterId: selectedAssessmentQuestion?.filter_id ?? undefined }).data;
    const guide = api.interviewGuide.getByQuestionId.useQuery({ id: questionRef?.id }).data;
    const references = api.reference.getByQuestionId.useQuery({ id: questionRef?.id }).data


    // =========== Input Field States ===========

    const [showRating, setShowRating] = React.useState<boolean>(false);

    const [answer, setAnswer] = React.useState<FormValues>({
        rating: '',
        rationale: '',
        notes: '',
    });

    React.useEffect(() => {
        if (selectedAssessmentQuestion) {
            setAnswer({
                rating: selectedAssessmentQuestion.answer?.assessor_rating ?? '',
                rationale: selectedAssessmentQuestion.answer?.assessor_explanation ?? '',
                notes: selectedAssessmentQuestion.answer?.assessor_evidence ?? '',
            });
        } else {
            setAnswer({
                rating: '',
                rationale: '',
                notes: '',
            });
        }
    }, [selectedAssessmentQuestion])


    // =========== Submission Management ===========

    const create = api.answer.create.useMutation();
    const update = api.answer.update.useMutation();
    const statusChange = api.assessment.status.useMutation();

    const handleSubmit = (
        values: FormValues,
        formikHelpers: FormikHelpers<FormValues>
    ) => {
        if (selectedAssessmentQuestion) {
            if (selectedAssessmentQuestion.answer) {
                update.mutate({
                    id: selectedAssessmentQuestion.answer.id,
                    assessment_question_id: selectedAssessmentQuestion.id,
                    assessor_rating: values.rating,
                    assessor_explanation: values.rationale,
                    assessor_evidence: values.notes,
                }, {
                    onSuccess() { Router.reload() }
                })
            } else {
                create.mutate({
                    assessment_question_id: selectedAssessmentQuestion.id,
                    assessor_rating: values.rating,
                    assessor_explanation: values.rationale,
                    assessor_evidence: values.notes,
                }, {
                    onSuccess() { Router.reload() }
                })
            }
        }
    }

    const handleSubmitAssesment = () => {
        if (data) {
            statusChange.mutate({
                id: data.id,
                status: 'in-review',
            })
        }
    }

    return (
        <Layout active='ongoing-assessments'>
            <div className='assessment'>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        {questions &&
                            <QuestionsSidebar
                                questions={questions.map(o => convertToQuestion(o.question))}
                                question={question}
                                setQuestion={setQuestion}
                                submitAssessment={handleSubmitAssesment}
                            />
                        }
                    </Grid>
                    {selectedAssessmentQuestion &&
                        <Grid item xs={10} container spacing={2}>
                            <Grid item xs={12}>
                                <QuestionContext question={questionRef && convertToQuestion(questionRef)} />
                            </Grid>
                            <Grid item xs={8}>
                                <Formik
                                    enableReinitialize
                                    initialValues={answer}
                                    validationSchema={validationSchema}
                                    validateOnBlur={false}
                                    validateOnChange={false}
                                    onSubmit={handleSubmit}
                                >
                                    <Form>
                                        <Card className='pre-questions'>
                                            <div>
                                                <Typography>Hint: {questionRef?.hint}</Typography>
                                                <Typography>Start Time: XYZ</Typography>
                                                <div className='rating'>
                                                    <div className='rating-input'>
                                                        <Typography>Rating</Typography>
                                                        <Info fontSize='small' onClick={() => setShowRating(!showRating)} />
                                                        <Field
                                                            name='rating' label='' size='small'
                                                            component={TextField}
                                                        />
                                                    </div>
                                                    {(showRating && ratings) &&
                                                        <div>
                                                            <div>Question Content: {selectedAssessmentQuestion.question.question}</div>
                                                            {ratings.map((r, i) => {
                                                                return (
                                                                    <div key={i}>
                                                                        <div>Level {r.level_number}: {r.criteria}</div>
                                                                        {i !== ratings.length - 1 &&
                                                                            <div>Progression Statement: {r.progression_statement}</div>
                                                                        }
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </Card>
                                        <Card className='question-content'>
                                            <Typography>Rationale</Typography>
                                            <Field
                                                name='rationale' label='' size='small' multiline
                                                component={TextField}
                                            />
                                            <Typography>Notes</Typography>
                                            <Field
                                                name='notes' label='' size='small' multiline
                                                component={TextField}
                                            />
                                        </Card>
                                        <Card className='actions simple'>
                                            <Button variant='contained' type='submit'>Save</Button>
                                        </Card>
                                    </Form>
                                </Formik>
                            </Grid>
                            <Grid item xs={4}>
                                <Card className='reference'>
                                    <div>
                                        <Typography>Interview Guide</Typography>
                                        {guide?.map((r, i) => {
                                            return (
                                                <div key={i}>
                                                    <span>{i + 1}. {r.interview_question}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div>
                                        <Typography>References</Typography>
                                        {references?.map((r, i) => {
                                            return (
                                                <div key={i}>
                                                    <span>{i + 1}. {r.citation}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Card>
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </div>
        </Layout>
    );
};

export default OngoingAssessment;