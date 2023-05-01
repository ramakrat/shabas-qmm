import * as React from 'react';
import Router, { useRouter } from 'next/router';
import type { Answer, Assessment, AssessmentQuestion, Engagement, Filter, InterviewGuide, Question, Rating, Reference } from '@prisma/client';

import * as yup from "yup";
import { Field, Form, Formik } from "formik";
import TextField from '~/components/Form/TextField';

import { Button, Card, Grid, IconButton, MenuItem, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

import { api } from "~/utils/api";
import QuestionsSidebar from '~/components/Assessor/QuestionsSidebar';
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
            assessment_questions: (AssessmentQuestion & {
                question: Question & {
                    ratings: Rating[];
                    references: Reference[];
                    interview_guides: InterviewGuide[];
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

    const questions = data?.assessment_questions;

    const [question, setQuestion] = React.useState<number>(questions && questions[0] ? questions[0].question.id : -1);

    React.useEffect(() => {
        setQuestion(questions && questions[0] ? questions[0].question.id : -1)
    }, [questions])

    const selectedAssessmentQuestion = data?.assessment_questions.find(o => o.question.id == question);
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
                    if (changed[prop] != former[prop]) {
                        createChangelog.mutate({
                            field: prop,
                            former_value: former[prop].toString(),
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

    if (data?.status != status) {
        return (
            <div className='not-found'>
                <span>404</span>
                <span>Page Not Found</span>
            </div>
        )
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
                        {questions &&
                            <QuestionsSidebar
                                assessmentId={assessment.toString()}
                                questions={questions.map(o => convertToQuestion(o.question))}
                                question={question}
                                setQuestion={setQuestion}
                                submitAssessment={handleSubmitAssesment}
                                resetForm={resetForm}
                                assessmentChangelogs={() => { setQuestion(-1) }}
                            />
                        }
                        {selectedAssessmentQuestion &&
                            <div className='assessment-content'>
                                <Card className='context'>
                                    <div className='question-number'>
                                        <Typography>Question # :</Typography>
                                        <Typography>{questionRef ? convertToQuestion(questionRef).number : undefined}</Typography>
                                    </div>
                                    <Button variant='contained' type='submit'>Save</Button>
                                </Card>
                                <div className='assessment-form'>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Card className='question-content'>
                                                <div className='widget-header'>General</div>
                                                <div className='widget-body information-list'>
                                                    <div>
                                                        <Typography>Question Content:</Typography>
                                                        <Typography>{selectedAssessmentQuestion.question.question}</Typography>
                                                    </div>
                                                    <div>
                                                        <Typography>Hint:</Typography>
                                                        <Typography>{questionRef?.hint}</Typography>
                                                    </div>
                                                    <div>
                                                        <Typography>Start Time:</Typography>
                                                        <Typography>XYZ</Typography>
                                                    </div>
                                                </div>
                                                <div className='widget-sub-header'>
                                                    <div className='rating-input'>
                                                        <Typography>Rating:</Typography>
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
                                                    <IconButton onClick={() => setShowRating(!showRating)}>
                                                        {showRating ? <KeyboardArrowUp fontSize='small' /> : <KeyboardArrowDown fontSize='small' />}
                                                    </IconButton>
                                                </div>
                                                {(showRating && ratings) &&
                                                    <div className='widget-body information-list'>
                                                        {ratings.map((r, i) => {
                                                            return (
                                                                <>
                                                                    <div key={'level-' + i}>
                                                                        <Typography>Level {r.level_number}:</Typography>
                                                                        <Typography>{r.criteria}</Typography>
                                                                    </div>
                                                                    {i !== ratings.length - 1 &&
                                                                        <div key={'progression-' + i}>
                                                                            <Typography>Progression Statement:</Typography>
                                                                            <Typography>{r.progression_statement}</Typography>
                                                                        </div>
                                                                    }
                                                                </>
                                                            )
                                                        })}
                                                    </div>
                                                }
                                                <div className='widget-header'>Details</div>
                                                <div className='widget-body widget-form'>
                                                    <Typography>Rationale</Typography>
                                                    <Field
                                                        name='rationale' label='' size='small' multiline={3}
                                                        placeholder='Rationale...'
                                                        component={TextField}
                                                    />
                                                    <Typography>Notes</Typography>
                                                    <Field
                                                        name='notes' label='' size='small' multiline={3}
                                                        placeholder='Notes...'
                                                        component={TextField}
                                                    />
                                                </div>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Card className='reference'>
                                                <div className='widget-header'>Question Information</div>
                                                <div className='widget-body information-list'>
                                                    <div>
                                                        <Typography>Pillar:</Typography>
                                                        <Typography>{questionRef ? convertToQuestion(questionRef).pillar : undefined}</Typography>
                                                    </div>
                                                    <div>
                                                        <Typography>Practice Area:</Typography>
                                                        <Typography>{questionRef ? convertToQuestion(questionRef).practice_area : undefined}</Typography>
                                                    </div>
                                                    <div>
                                                        <Typography>Topic Area:</Typography>
                                                        <Typography>{questionRef ? convertToQuestion(questionRef).topic_area : undefined}</Typography>
                                                    </div>
                                                    <div>
                                                        <Typography>Priority:</Typography>
                                                        <Typography>{questionRef ? convertToQuestion(questionRef).priority : undefined}</Typography>
                                                    </div>
                                                </div>
                                                <div className='widget-header'>Interview Guide</div>
                                                <div className='widget-body information-list'>
                                                    {guide?.map((r, i) => {
                                                        return (
                                                            <div key={i}>
                                                                <Typography>{i + 1}.</Typography>
                                                                <Typography>{r.interview_question}</Typography>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <div className='widget-header'>References</div>
                                                <div className='widget-body information-list'>
                                                    {references?.map((r, i) => {
                                                        return (
                                                            <div key={i}>
                                                                <Typography>{i + 1}.</Typography>
                                                                <Typography>{r.citation}</Typography>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Card>
                                                <div className='widget-header'>Changelog</div>
                                                {changelog && changelog.length > 0 ?
                                                    <ChangelogTable changelogs={changelog} fileName={`Assessment${data?.id} Question${selectedAssessmentQuestion.id}`} /> :
                                                    <div className='widget-body'>No Changes</div>
                                                }
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        }
                        {question == -1 &&
                            <Grid item xs={10}>
                                <Card>
                                    <div className='widget-header'>Changelog</div>
                                    {fullChangelog && fullChangelog.length > 0 ?
                                        <ChangelogTable changelogs={fullChangelog} fileName={`Assessment${data?.id}`} /> :
                                        <div className='widget-body'>No Changes</div>
                                    }
                                </Card>
                            </Grid>
                        }
                    </Form>
                )}
            </Formik>
        </div >
    );
};

export default OngoingAssessment;