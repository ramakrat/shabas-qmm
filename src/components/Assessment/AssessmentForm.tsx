import * as React from 'react';
import { useRouter } from 'next/router';
import type {
    Answer, Assessment, AssessmentQuestion, Engagement, Filter,
    InterviewGuide, Question, Rating, Reference, User
} from '@prisma/client';

import * as yup from "yup";
import { Field, Form, Formik } from "formik";
import { Button, Card, Grid, IconButton, MenuItem, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

import { api } from "~/utils/api";
import Select from '../Form/Select';
import TextField from '../Form/TextField';
import { AssessmentStatus } from '../Table/StatusChip';
import ChangelogTable from '../Table/ChangelogTable';
import BrowseTable, { TableColumn } from '../Table/BrowseTable';
import ConfirmModal from '../Modal/Common/ConfirmModal';
import MessageModal from '../Modal/Common/MessageModal';
import QuestionsSidebar from '../Assessment/QuestionsSidebar';
import PriorityIndicator from "~/components/Question/PriorityIndicator";

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
            answers: (Answer & {
                user: User | null;
            })[];
        })[];
    }
)

interface FormValues {
    id?: number;
    startTime?: Date;
    rating: string;
    rationale?: string;
    notes: string;
}

const validationSchema = yup.object().shape({
    rating: yup.string().required("Required"),
    rationale: yup.string().required("Required"),
    notes: yup.string(),
});

const validationSchemaOversight = yup.object().shape({
    rating: yup.string().required("Required"),
    notes: yup.string(),
});

interface Props {
    assessment: number;
    status: AssessmentStatus
    userId: number;
}

export interface AnswersTableData {
    user: string;
    rating: string;
    rationale: string;
    notes: string;
}

export const answersColumns: TableColumn[] = [{
    type: 'user',
    displayValue: 'Assessor',
}, {
    type: 'rating',
    displayValue: 'Rating',
}, {
    type: 'rationale',
    displayValue: 'Rationale',
}, {
    type: 'notes',
    displayValue: 'Notes',
}];

export const leadAnswersColumns: TableColumn[] = [{
    type: 'user',
    displayValue: 'Assessor',
}, {
    type: 'rating',
    displayValue: 'Consensus Rating',
}, {
    type: 'rationale',
    displayValue: 'Rationale',
}, {
    type: 'notes',
    displayValue: 'Improvement Suggestions',
}];

export const oversightAnswersColumns: TableColumn[] = [{
    type: 'user',
    displayValue: 'Assessor',
}, {
    type: 'rating',
    displayValue: 'Oversight Rating',
}, {
    type: 'notes',
    displayValue: 'OversightComments',
}];

export const convertAnswersTableData = (data?: any[]) => {
    if (data) {
        const newData: AnswersTableData[] = [];
        data.forEach(obj => {
            newData.push({
                user: obj.user.first_name + ' ' + obj.user.last_name,
                rating: obj.rating ?? '',
                rationale: obj.rationale ?? '',
                notes: obj.notes ?? '',
            })
        })
        return newData;
    }
}

const AssessmentForm: React.FC<Props> = (props) => {

    const { assessment, status, userId } = props;

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

    const userAnswer = selectedAssessmentQuestion?.answers.find(a => a.user_id == userId);

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
        if (selectedAssessmentQuestion && userId && !userAnswer) {
            createAnswer.mutate({ assessmentQuestionId: selectedAssessmentQuestion.id, userId: userId, status: status }, {
                onSuccess(data) {
                    setAnswer({
                        ...answer,
                        id: data.id,
                        startTime: data.start_time ?? undefined,
                    })
                }
            })
        }
        if (selectedAssessmentQuestion && userAnswer) {
            setAnswer({
                id: userAnswer.id ?? '',
                startTime: userAnswer.start_time ?? undefined,
                rating: userAnswer.rating ?? '',
                rationale: userAnswer.rationale ?? '',
                notes: userAnswer.notes ?? '',
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
        rating: userAnswer?.rating ?? '',
        rationale: userAnswer?.rationale ?? '',
        notes: userAnswer?.notes ?? '',
    }
    const createChangelog = api.changelog.create.useMutation();
    const compareChanges = (changed: any, former: any) => {
        for (const prop in former) {
            if (prop == 'created_at' || prop == 'updated_at') return;
            if (Object.prototype.hasOwnProperty.call(changed, prop)) {
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

    const update = api.answer.update.useMutation();
    const statusChange = api.assessment.updateStatus.useMutation();

    const handleSubmit = (values: FormValues) => {
        if (selectedAssessmentQuestion) {
            if (values.id && values.startTime) {
                update.mutate({
                    id: values.id,
                    assessment_question_id: selectedAssessmentQuestion.id,
                    user_id: userId,
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
                    status: 'ongoing-review',
                }, {
                    async onSuccess() {
                        await push(`/assessments/ongoing-review/${data.id}`)
                    }
                })
            if (status == 'ongoing-review')
                statusChange.mutate({
                    id: data.id,
                    status: 'oversight',
                }, {
                    async onSuccess() {
                        await push(`/assessments/oversight/${data.id}`)
                    }
                })
            if (status == 'oversight')
                statusChange.mutate({
                    id: data.id,
                    status: 'oversight-review',
                }, {
                    async onSuccess() {
                        await push(`/assessments/oversight-review/${data.id}`)
                    }
                })
            if (status == 'oversight-review')
                statusChange.mutate({
                    id: data.id,
                    status: 'completed',
                }, {
                    async onSuccess() {
                        await push(`/assessments/completed/${data.id}`)
                    }
                })
        }
    }
    const checkCompletion = api.assessmentUser.getUnfinishedAssessmentQuestions.useQuery({ assessmentId: assessment, userId: userId, status: status }).data;
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
                validationSchema={status == 'oversight' ? validationSchemaOversight : validationSchema}
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
                                                        {(status == 'ongoing-review' || status == 'oversight-review') && <Typography>Consensus Rating:</Typography>}
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
                                                        <div>
                                                            <Typography>Level 1:</Typography>
                                                            <Typography>{ratings.criteria_1}</Typography>
                                                        </div>
                                                        <div>
                                                            <Typography>Progression Statement:</Typography>
                                                            <Typography>{ratings.progression_statement_1}</Typography>
                                                        </div>
                                                        <div>
                                                            <Typography>Level 2:</Typography>
                                                            <Typography>{ratings.criteria_2}</Typography>
                                                        </div>
                                                        <div>
                                                            <Typography>Progression Statement:</Typography>
                                                            <Typography>{ratings.progression_statement_2}</Typography>
                                                        </div>
                                                        <div>
                                                            <Typography>Level 3:</Typography>
                                                            <Typography>{ratings.criteria_3}</Typography>
                                                        </div>
                                                        <div>
                                                            <Typography>Progression Statement:</Typography>
                                                            <Typography>{ratings.progression_statement_3}</Typography>
                                                        </div>
                                                        <div>
                                                            <Typography>Level 4:</Typography>
                                                            <Typography>{ratings.criteria_4}</Typography>
                                                        </div>
                                                        <div>
                                                            <Typography>Progression Statement:</Typography>
                                                            <Typography>{ratings.progression_statement_4}</Typography>
                                                        </div>
                                                        <div>
                                                            <Typography>Level 5:</Typography>
                                                            <Typography>{ratings.criteria_5}</Typography>
                                                        </div>
                                                    </div>
                                                }
                                                <div className='widget-header'>Details</div>
                                                <div className='widget-body widget-form'>
                                                    {(status == 'ongoing' || status == 'ongoing-review' || status == 'oversight-review') && <>
                                                        <Typography>Rationale</Typography>
                                                        <Field
                                                            name='rationale' label='' size='small' multiline
                                                            placeholder='Rationale...'
                                                            component={TextField}
                                                        />
                                                    </>}
                                                    {status == 'ongoing' && <Typography>Notes</Typography>}
                                                    {(status == 'ongoing-review' || status == 'oversight-review') && <Typography>Improvement Suggestions</Typography>}
                                                    {status == 'oversight' && <Typography>Oversight Comments</Typography>}
                                                    <Field
                                                        name='notes' label='' size='small' multiline
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
                                                        <Typography>{questionRef ? <PriorityIndicator priority={convertToQuestion(questionRef).priority} /> : undefined}</Typography>
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
                                                {status == 'ongoing-review' && <>
                                                    <div className='widget-header'>Assessor Answers</div>
                                                    <div className='widget-table'>
                                                        <BrowseTable
                                                            dataList={convertAnswersTableData(selectedAssessmentQuestion.answers.filter(a => a.status == 'ongoing')) ?? []}
                                                            tableInfoColumns={answersColumns}
                                                        />
                                                    </div>
                                                </>}
                                                {status == 'oversight' && <>
                                                    <div className='widget-header'>Lead Assessor Answers</div>
                                                    <div className='widget-table'>
                                                        <BrowseTable
                                                            dataList={convertAnswersTableData(selectedAssessmentQuestion.answers.filter(a => a.status == 'ongoing-review')) ?? []}
                                                            tableInfoColumns={leadAnswersColumns}
                                                        />
                                                    </div>
                                                </>}
                                                {status == 'oversight-review' && <>
                                                    <div className='widget-header'>Oversight Assessor Answers</div>
                                                    <div className='widget-table'>
                                                        <BrowseTable
                                                            dataList={convertAnswersTableData(selectedAssessmentQuestion.answers.filter(a => a.status == 'oversight')) ?? []}
                                                            tableInfoColumns={oversightAnswersColumns}
                                                        />
                                                    </div>
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
            {confirmSubmitModal &&
                <ConfirmModal message={`Are you sure you want to submit ongoing assessment ${assessment}?`} open={confirmSubmitModal} setOpen={setConfirmSubmitModal} handleConfirm={handleSubmitAssesment} />
            }
            {messageModal &&
                <MessageModal message={`Assessment ${assessment} cannot be submitted because there are unfinished question forms.`} open={messageModal} setOpen={setMessageModal} />
            }
        </div>
    );
};

export default AssessmentForm;