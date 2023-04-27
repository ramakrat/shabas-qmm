import * as React from 'react';
import Router, { useRouter } from 'next/router';
import type { Answer, Assessment, AssessmentQuestion, Engagement, Filter, InterviewGuide, Question, Rating, Reference } from '@prisma/client';

import * as yup from "yup";
import { Field, Form, Formik } from "formik";
import TextField from '~/components/Form/TextField';

import { Button, Card, Grid, MenuItem, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';

import { api } from "~/utils/api";
import QuestionsSidebar from '~/components/Question/QuestionsSidebar';
import QuestionContext from '~/components/Question/QuestionContext';
import Select from '~/components/Form/Select';
import ChangelogTable from '~/components/Common/ChangelogTable';

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

interface Props {
    assessment: number;
    status: 'ongoing' | 'assessor-review' | 'oversight' | 'client-review';
}

const OngoingAssessment: React.FC<Props> = (props) => {

    const { assessment, status } = props;

    // =========== Retrieve Form Context ===========

    const data = api.assessment.getByIdIncludeAssessor.useQuery({ id: assessment }).data as (
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

    // Update the statuses of Assessment and Engagement if needed
    const assessmentStatus = api.assessment.status.useMutation();
    const engagementStatus = api.engagement.status.useMutation();
    React.useEffect(() => {
        if (data && status == 'ongoing') {
            if (data.status == 'created' || data.status == '') {
                assessmentStatus.mutate({
                    id: data.id,
                    status: 'ongoing',
                })
                if (data.engagement.status == 'created' || data.status == '') {
                    engagementStatus.mutate({
                        id: data.id,
                        status: 'ongoing',
                    })
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            if (status == 'ongoing')
                setAnswer({
                    rating: selectedAssessmentQuestion.answer.assessor_rating ?? '',
                    rationale: selectedAssessmentQuestion.answer.assessor_explanation ?? '',
                    notes: selectedAssessmentQuestion.answer.assessor_evidence ?? '',
                });
            if (status == 'assessor-review')
                setAnswer({
                    rating: selectedAssessmentQuestion.answer.consensus_rating ?? '',
                    rationale: selectedAssessmentQuestion.answer.consensus_explanation ?? '',
                    notes: selectedAssessmentQuestion.answer.consensus_evidence ?? '',
                });
            if (status == 'oversight')
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAssessmentQuestion])


    // =========== Submission Management ===========

    const initialValues = () => {
        if (status == 'ongoing')
            return {
                assessor_rating: selectedAssessmentQuestion?.answer?.assessor_rating ?? '',
                assessor_explanation: selectedAssessmentQuestion?.answer?.assessor_explanation ?? '',
                assessor_evidence: selectedAssessmentQuestion?.answer?.assessor_evidence ?? '',
            }
        if (status == 'assessor-review')
            return {
                rating: selectedAssessmentQuestion?.answer?.consensus_rating ?? '',
                rationale: selectedAssessmentQuestion?.answer?.consensus_explanation ?? '',
                notes: selectedAssessmentQuestion?.answer?.consensus_evidence ?? '',
            }
        if (status == 'oversight')
            return {
                rating: selectedAssessmentQuestion?.answer?.oversight_concurrence ?? '',
                rationale: selectedAssessmentQuestion?.answer?.oversight_explanation ?? '',
                notes: selectedAssessmentQuestion?.answer?.oversight_evidence ?? '',
            }
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
                if (status == 'ongoing')
                    update.mutate({
                        id: selectedAssessmentQuestion.answer.id,
                        assessment_question_id: selectedAssessmentQuestion.id,
                        assessor_rating: values.rating.toString(),
                        assessor_explanation: values.rationale,
                        assessor_evidence: values.notes,
                    }, {
                        onSuccess(data) {
                            compareChanges(data, initialValues);
                            Router.reload();
                        }
                    })
                if (status == 'assessor-review')
                    update.mutate({
                        id: selectedAssessmentQuestion.answer.id,
                        assessment_question_id: selectedAssessmentQuestion.id,
                        consensus_rating: values.rating.toString(),
                        consensus_explanation: values.rationale,
                        consensus_evidence: values.notes,
                    }, {
                        onSuccess(data) {
                            compareChanges(data, initialValues);
                            Router.reload();
                        }
                    })
                if (status == 'oversight')
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
                if (status == 'ongoing')
                    create.mutate({
                        assessment_question_id: selectedAssessmentQuestion.id,
                        assessor_rating: values.rating.toString(),
                        assessor_explanation: values.rationale,
                        assessor_evidence: values.notes,
                    }, {
                        onSuccess() { Router.reload() }
                    })
                if (status == 'assessor-review')
                    create.mutate({
                        assessment_question_id: selectedAssessmentQuestion.id,
                        consensus_rating: values.rating.toString(),
                        consensus_explanation: values.rationale,
                        consensus_evidence: values.notes,
                    }, {
                        onSuccess() { Router.reload() }
                    })
                if (status == 'oversight')
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
            if (status == 'ongoing')
                statusChange.mutate({
                    id: data.id,
                    status: 'assessor-review',
                }, {
                    async onSuccess() {
                        await push(`/review-assessments/${data.id}`)
                    }
                })
            if (status == 'assessor-review')
                statusChange.mutate({
                    id: data.id,
                    status: 'oversight',
                }, {
                    async onSuccess() {
                        await push(`/oversight-assessments/${data.id}`)
                    }
                })
            if (status == 'oversight')
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
        </div>
    );
};

export default OngoingAssessment;