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
import ConfirmModal from '../Common/ConfirmModal';
import MessageModal from '../Common/MessageModal';
import { priorityIndicator } from '~/pages/questions/[question]';
import BrowseTable from '../Common/BrowseTable';

type AssessmentType = (
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
)

interface FormValues {
    id?: number;
    startTime?: Date;
    rating: string;
    rationale: string;
    notes: string;
}

const validationSchema = yup.object().shape({
    rating: yup.string().required("Required"),
    rationale: yup.string().required("Required"),
    notes: yup.string(),
});

interface Props {
    assessment: number;
    status: 'ongoing' | 'assessor-review' | 'oversight' | 'client-review';
}

const OngoingAssessment: React.FC<Props> = (props) => {

    const { assessment, status } = props;

    const [confirmSubmitModal, setConfirmSubmitModal] = React.useState<boolean>(false);
    const [messageModal, setMessageModal] = React.useState<boolean>(false);

    // =========== Retrieve Form Context ===========

    const data = api.assessment.getByIdIncludeAssessor.useQuery({ id: assessment }).data as AssessmentType;


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
        setQuestion(questions && questions[0] ? questions[0].question.id : -2)
    }, [questions])

    const selectedAssessmentQuestion = data?.assessment_questions.find(o => o.question.id == question);
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


    // Update the statuses of Assessment and Engagement if needed
    const assessmentStatus = api.assessment.updateStatus.useMutation();
    const createAnswer = api.answer.create.useMutation()
    React.useEffect(() => {
        if (data && status == 'ongoing') {
            if (data.status == 'created' || data.status == '') {
                assessmentStatus.mutate({
                    id: data.id,
                    status: 'ongoing',
                })
            }
        }
    }, [data])
    React.useEffect(() => {
        if (selectedAssessmentQuestion && !selectedAssessmentQuestion.answer) {
            createAnswer.mutate({ assessmentQuestionId: selectedAssessmentQuestion.id }, {
                onSuccess(data) {
                    setAnswer({
                        ...answer,
                        id: data.id,
                        startTime: data.start_time ?? undefined,
                    })
                }
            })
        }
        if (selectedAssessmentQuestion && selectedAssessmentQuestion.answer) {
            setAnswer({
                id: selectedAssessmentQuestion.answer.id ?? '',
                startTime: selectedAssessmentQuestion.answer.start_time ?? undefined,
                rating: selectedAssessmentQuestion.answer.rating ?? '',
                rationale: selectedAssessmentQuestion.answer.rationale ?? '',
                notes: selectedAssessmentQuestion.answer.notes ?? '',
            });
        } else {
            setAnswer({
                ...answer,
                rating: '',
                rationale: '',
                notes: '',
            });
        }
    }, [selectedAssessmentQuestion])


    const changelog = api.changelog.getAllByAnswer.useQuery(answer?.id).data;

    // =========== Submission Management ===========

    const initialValues = {
        rating: selectedAssessmentQuestion?.answer?.rating ?? '',
        rationale: selectedAssessmentQuestion?.answer?.rationale ?? '',
        notes: selectedAssessmentQuestion?.answer?.notes ?? '',
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
                            answer_id: Number(answer?.id),
                        })
                    }
                }
            }
        }
    }

    const update = api.answer.update.useMutation();
    const statusChange = api.assessment.updateStatus.useMutation();

    const handleSubmit = (
        values: FormValues,
    ) => {
        if (selectedAssessmentQuestion) {
            if (values.id && values.startTime) {
                update.mutate({
                    id: values.id,
                    assessment_question_id: selectedAssessmentQuestion.id,
                    rating: values.rating.toString(),
                    rationale: values.rationale,
                    notes: values.notes,
                }, {
                    onSuccess(data) {
                        compareChanges(data, initialValues);
                    }
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
    const checkCompletion = api.assessmentQuestion.getUnfinishedAssessmentQuestions.useQuery({ assessmentId: assessment, status: status }).data;

    const handleSubmitAssessmentCheck = () => {
        if (checkCompletion && checkCompletion.length > 0) {
            setMessageModal(true);
        } else {
            setConfirmSubmitModal(true);
        }
    }

    if (data && (data.status != 'created') && (data.status != status)) {
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
                                submitAssessment={handleSubmitAssessmentCheck}
                                resetForm={resetForm}
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
                                                        <Typography>{answer.startTime?.toLocaleString() ?? 'Not Started'}</Typography>
                                                    </div>
                                                </div>
                                                <div className='widget-sub-header'>
                                                    <div className='rating-input'>
                                                        {status == 'ongoing' && <Typography>Rating:</Typography>}
                                                        {status == 'assessor-review' && <Typography>Consensus Rating:</Typography>}
                                                        {status == 'oversight' && <Typography>Oversight Rating:</Typography>}
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
                                                        {ratings.length > 0 ?
                                                            ratings.map((r, i) => {
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
                                                            }) :
                                                            'None'
                                                        }
                                                    </div>
                                                }
                                                <div className='widget-header'>Details</div>
                                                <div className='widget-body widget-form'>
                                                    {status == 'ongoing' || status == 'assessor-review' && <>
                                                        <Typography>Rationale</Typography>
                                                        <Field
                                                            name='rationale' label='' size='small' multiline={3}
                                                            placeholder='Rationale...'
                                                            component={TextField}
                                                        />
                                                    </>}
                                                    {status == 'ongoing' && <Typography>Notes</Typography>}
                                                    {status == 'assessor-review' && <Typography>Improvement Suggestions</Typography>}
                                                    {status == 'oversight' && <Typography>Oversight Comments</Typography>}
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
                                                        <Typography>{questionRef ? priorityIndicator(convertToQuestion(questionRef).priority) : undefined}</Typography>
                                                    </div>
                                                </div>
                                                {status == 'ongoing' && <>
                                                    <div className='widget-header'>Interview Guide</div>
                                                    <div className='widget-body information-list'>
                                                        {guide && guide.length > 0 ?
                                                            guide.map((r, i) => {
                                                                return (
                                                                    <div key={i}>
                                                                        <Typography>{i + 1}.</Typography>
                                                                        <Typography>{r.interview_question}</Typography>
                                                                    </div>
                                                                )
                                                            }) :
                                                            'None'
                                                        }
                                                    </div>
                                                    <div className='widget-header'>References</div>
                                                    <div className='widget-body information-list'>
                                                        {references && references.length > 0 ?
                                                            references?.map((r, i) => {
                                                                return (
                                                                    <div key={i}>
                                                                        <Typography>{i + 1}.</Typography>
                                                                        <Typography>{r.citation}</Typography>
                                                                    </div>
                                                                )
                                                            }) :
                                                            'None'
                                                        }
                                                    </div>
                                                </>}
                                                {status == 'assessor-review' && <>
                                                    <div className='widget-header'>Assessor Answers</div>
                                                    <ChangelogTable changelogs={changelog} fileName={`Assessment${data?.id} Question${selectedAssessmentQuestion.id}`} />
                                                    {/* <BrowseTable
                                                        dataList={convertTableData(changelogs) ?? []}
                                                        tableInfoColumns={columns}
                                                    /> */}
                                                </>}
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
                    </Form>
                )}
            </Formik>
            <ConfirmModal message={`Are you sure you want to submit ongoing assessment ${assessment}?`} open={confirmSubmitModal} setOpen={setConfirmSubmitModal} handleConfirm={handleSubmitAssesment} />
            <MessageModal message={`Assessment ${assessment} cannot be submitted because there are unfinished question forms.`} open={messageModal} setOpen={setMessageModal} />
        </div >
    );
};

export default OngoingAssessment;