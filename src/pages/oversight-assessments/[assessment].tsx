import * as React from 'react';
import { type NextPage } from "next";
import Router, { useRouter } from 'next/router';
import type { Answer, Assessment, AssessmentQuestion, Engagement, Filter, InterviewGuide, Question, Rating, Reference } from '@prisma/client';

import * as yup from "yup";
import { Field, Form, Formik } from "formik";
import TextField from '~/components/Form/TextField';

import { Button, Card, Grid, MenuItem, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import QuestionsSidebar from '~/components/Question/QuestionsSidebar';
import QuestionContext from '~/components/Question/QuestionContext';
import Select from '~/components/Form/Select';
import ChangelogTable from '~/components/Browse/ChangelogTable';

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

const OversightAssessment: NextPage = () => {

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
    const changelog = api.changelog.getAllByAssessmentQuestion.useQuery(selectedAssessmentQuestion?.id).data;
    const fullChangelog = api.changelog.getAllByAssessment.useQuery(data?.id).data;


    // =========== Input Field States ===========

    const [showRating, setShowRating] = React.useState<boolean>(false);

    const [answer, setAnswer] = React.useState<FormValues>({
        rating: '',
        rationale: '',
        notes: '',
    });

    React.useEffect(() => {
        if (selectedAssessmentQuestion && selectedAssessmentQuestion.answer) {
            setAnswer({
                rating: selectedAssessmentQuestion.answer.oversight_concurrence ?? '',
                rationale: selectedAssessmentQuestion.answer.oversight_explanation ?? '',
                notes: selectedAssessmentQuestion.answer.oversight_evidence ?? '',
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

    const initialValues = {
        oversight_concurrence: selectedAssessmentQuestion?.answer?.oversight_concurrence ?? '',
        oversight_explanation: selectedAssessmentQuestion?.answer?.oversight_explanation ?? '',
        oversight_evidence: selectedAssessmentQuestion?.answer?.oversight_evidence ?? '',
    }
    const createChangelog = api.changelog.create.useMutation();
    const compareChanges = (changed: any, former: any) => {
        for (const prop in changed) {
            if (prop == 'created_at' || prop == 'updated_at') return;
            if (Object.prototype.hasOwnProperty.call(changed, prop)) {
                if (Object.prototype.hasOwnProperty.call(former, prop)) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    if (changed[prop] != former[prop]) {
                        createChangelog.mutate({
                            field: prop,
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                            former_value: former[prop].toString(),
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                            new_value: changed[prop].toString(),
                            assessment_question_id: Number(selectedAssessmentQuestion?.id),
                        })
                    }
                }
            }
        }
    }

    const create = api.answer.create.useMutation();
    const update = api.answer.update.useMutation();
    const statusChange = api.assessment.status.useMutation();

    const handleSubmit = (
        values: FormValues,
    ) => {
        if (selectedAssessmentQuestion) {
            if (selectedAssessmentQuestion.answer) {
                update.mutate({
                    id: selectedAssessmentQuestion.answer.id,
                    assessment_question_id: selectedAssessmentQuestion.id,
                    oversight_concurrence: values.rating.toString(),
                    oversight_explanation: values.rationale,
                    oversight_evidence: values.notes,
                }, {
                    onSuccess(data) {
                        compareChanges(data, initialValues);
                        Router.reload();
                    }
                })
            } else {
                create.mutate({
                    assessment_question_id: selectedAssessmentQuestion.id,
                    oversight_concurrence: values.rating.toString(),
                    oversight_explanation: values.rationale,
                    oversight_evidence: values.notes,
                }, {
                    onSuccess() { Router.reload() }
                })
            }
        }
    }

    const { push } = useRouter();
    const handleSubmitAssesment = () => {
        if (data) {
            statusChange.mutate({
                id: data.id,
                status: 'completed',
            }, {
                async onSuccess() {
                    await push(`/completed-assessments/${data.id}`)
                }
            })
        }
    }

    return (
        <Layout active='oversight-assessments'>
            <div className='assessment'>
                <Formik
                    enableReinitialize
                    initialValues={answer}
                    validationSchema={validationSchema}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={handleSubmit}
                >
                    {({ resetForm }) => (
                        <Form>
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    {questions &&
                                        <QuestionsSidebar
                                            questions={questions.map(o => convertToQuestion(o.question))}
                                            question={question}
                                            setQuestion={setQuestion}
                                            submitAssessment={handleSubmitAssesment}
                                            resetForm={resetForm}
                                            assessmentChangelogs={() => { setQuestion(-1) }}
                                        />
                                    }
                                </Grid>
                                {selectedAssessmentQuestion &&
                                    <Grid item xs={10} container spacing={2}>
                                        <Grid item xs={12}>
                                            <QuestionContext question={questionRef && convertToQuestion(questionRef)} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Card className='pre-questions'>
                                                <div>
                                                    <Typography>Question Content: {selectedAssessmentQuestion.question.question}</Typography>
                                                    <Typography>Hint: {questionRef?.hint}</Typography>
                                                    <Typography>Start Time: XYZ</Typography>
                                                    <div className='rating'>
                                                        <div className='rating-input'>
                                                            <Typography>Rating</Typography>
                                                            <Info fontSize='small' onClick={() => setShowRating(!showRating)} />
                                                            <Field
                                                                name='rating' label='' size='small'
                                                                component={Select}
                                                            >
                                                                <MenuItem value=''><em>Select rating...</em></MenuItem>
                                                                <MenuItem value={1}>1</MenuItem>
                                                                <MenuItem value={2}>2</MenuItem>
                                                                <MenuItem value={3}>3</MenuItem>
                                                                <MenuItem value={4}>4</MenuItem>
                                                                <MenuItem value={5}>5</MenuItem>
                                                            </Field>
                                                        </div>
                                                        {(showRating && ratings) &&
                                                            <div>
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
                                        </Grid>
                                        <Grid item xs={6}>
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
                                        <Grid item xs={12}>
                                            <Card>
                                                <ChangelogTable changelogs={changelog} fileName={`Assessment${data?.id} Question${selectedAssessmentQuestion.id}`} />
                                            </Card>
                                        </Grid>
                                    </Grid>
                                }
                                {question == -1 &&
                                    <Grid item xs={10}>
                                        <Card>
                                            <ChangelogTable changelogs={fullChangelog} fileName={`Assessment${data?.id}`} />
                                        </Card>
                                    </Grid>
                                }
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </div >
        </Layout >
    );
};

export default OversightAssessment;