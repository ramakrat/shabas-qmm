import * as React from 'react';
import { useRouter } from 'next/router';
import type { AssessmentQuestion, AssessmentUser, Engagement, Filter, Question, Rating, Site, User } from '@prisma/client';

import * as yup from "yup";
import { Field, Form, Formik, FormikProps } from "formik";
import TextField from '~/components/Form/TextField';
import Select from "~/components/Form/Select";

import {
    Button, Card, Grid, IconButton, MenuItem, Select as MuiSelect,
    Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

import { api } from "~/utils/api";
import { dateInputFormat, titleCase, truncate } from '~/utils/utils';
import StatusChip, { AssessmentStatus } from '~/components/Table/StatusChip';

interface QuestionType {
    id?: number;
    question: (Question & {
        ratings: (Rating & {
            filter: Filter | null;
        })[];
    });
    filterSelection: number;
}

type AssessmentQuestionReturnType = (
    AssessmentQuestion & {
        question: (Question & {
            ratings: (Rating & {
                filter: Filter | null;
            })[];
        });
        filter: Filter | null
    }
);

type AssessmentUserReturnType = (
    AssessmentUser & {
        user: User;
        id?: number;
    }
)

interface FormValues {
    description: string;
    startDate: string;
    endDate: string;
    siteId: string;
    engagementId: string;
    pocId: string;
    leadAssessorId: string;
    oversightAssessorId: string;
}

const validationSchema = yup.object().shape({
    description: yup.string().required("Required"),
    startDate: yup.date()
        .required("Required"),
    endDate: yup.date()
        .when('startDate',
            (startDate, schema) => {
                if (startDate) {
                    const start = startDate[0] as unknown as Date;
                    const dayAfter = new Date(start.getTime() + 86400000);
                    return schema.min(dayAfter, 'End Date has to be later than Start Date');
                }
                return schema;
            })
        .required("Required"),
    siteId: yup.string().required("Required"),
    engagementId: yup.string().required("Required"),
    pocId: yup.string().required("Required"),
    leadAssessorId: yup.number().required("Required"),
    oversightAssessorId: yup.number().required("Required"),
});

interface Props {
    data: any;
}

const EditAssessment: React.FC<Props> = (props) => {
    const { data } = props;

    const router = useRouter();

    // =========== Retrieve Form Context ===========

    const sites = api.site.getAll.useQuery().data;
    const engagements = api.engagement.getAll.useQuery().data;
    const questions = api.question.getAllActiveInclude.useQuery().data;
    const clientPOC = api.poc.getAllClient.useQuery().data;
    const allOversightAssessors = api.user.getAllByRole.useQuery('OVERSIGHT_ASSESSOR').data;
    const allLeadAssessors = api.user.getAllByRole.useQuery('LEAD_ASSESSOR').data;
    const allAssessors = api.user.getAllByRole.useQuery('ASSESSOR').data;

    const oversightAssessor = data?.assessment_users.find((o: { user: { role: string; }; }) => o.user.role == 'OVERSIGHT_ASSESSOR')
    const leadAssessor = data?.assessment_users.find((o: { user: { role: string; }; }) => o.user.role == 'LEAD_ASSESSOR')
    const assessors = data?.assessment_users.filter((o: { user: { role: string; }; }) => o.user.role == 'ASSESSOR')


    // =========== Input Field States ===========

    const [assessmentData, setAssessmentData] = React.useState<FormValues>({
        description: '',
        startDate: dateInputFormat(new Date()),
        endDate: dateInputFormat(new Date()),
        siteId: '',
        engagementId: '',
        pocId: '',
        leadAssessorId: '',
        oversightAssessorId: '',
    });

    const [existingAssessors, setExistingAssessors] = React.useState<AssessmentUserReturnType[]>([]);
    const [newAssessors, setNewAssessors] = React.useState<User[]>([]);
    const [deletedAssessors, setDeletedAssessors] = React.useState<AssessmentUserReturnType[]>([]);
    const [selectedAssessor, setSelectedAssessor] = React.useState<number | undefined>(undefined);

    const [existingQuestions, setExistingQuestions] = React.useState<AssessmentQuestionReturnType[]>([]);
    const [newQuestions, setNewQuestions] = React.useState<QuestionType[]>([]);
    const [deletedQuestions, setDeletedQuestions] = React.useState<AssessmentQuestionReturnType[]>([]);

    const [addQuestion, setAddQuestion] = React.useState<boolean>(false);
    const [selectedQuestion, setSelectedQuestion] = React.useState<Question | undefined>(undefined);

    const [questionError, setQuestionError] = React.useState<string | undefined>(undefined);
    const [assessorError, setAssessorError] = React.useState<string | undefined>(undefined);

    const assessorSelections = existingAssessors.map(o => o.user).concat(newAssessors).map(o => o.id);
    const assessorOptions = allAssessors?.filter(a => {
        return !assessorSelections.includes(a.id);
    })

    React.useEffect(() => {
        if (data) {
            setAssessmentData({
                description: data.description,
                startDate: dateInputFormat(data.start_date, true),
                endDate: dateInputFormat(data.end_date, true),
                siteId: data.site_id.toString(),
                engagementId: data.engagement_id.toString(),
                pocId: data.poc_id ? data.poc_id.toString() : '',
                leadAssessorId: leadAssessor ? leadAssessor.user_id.toString() : '',
                oversightAssessorId: oversightAssessor ? oversightAssessor.user_id.toString() : '',
            })
            if (assessors) {
                setExistingAssessors(assessors);
            } else {
                setExistingAssessors([]);
            }

            if (data.assessment_questions) {
                setExistingQuestions(data.assessment_questions as AssessmentQuestionReturnType[]);
            } else {
                setExistingQuestions([]);
            }
        } else {
            setAssessmentData({
                description: '',
                startDate: dateInputFormat(new Date()),
                endDate: dateInputFormat(new Date()),
                siteId: '',
                engagementId: '',
                pocId: '',
                leadAssessorId: '',
                oversightAssessorId: '',
            })
            setExistingQuestions([]);
            setNewQuestions([]);
        }
    }, [data])

    // =========== Submission Management ===========

    const create = api.assessment.create.useMutation();
    const update = api.assessment.update.useMutation();

    const createQuestions = api.assessmentQuestion.createArray.useMutation();
    const updateQuestion = api.assessmentQuestion.update.useMutation();
    const deleteQuestions = api.assessmentQuestion.deleteArray.useMutation();

    const createAssessmentUser = api.assessmentUser.create.useMutation();
    const createAssessmentUsers = api.assessmentUser.createArray.useMutation();
    const updateAssessmentUser = api.assessmentUser.update.useMutation();
    const updateAssessmentUsers = api.assessmentUser.updateArray.useMutation();
    const deleteAssessmentUsers = api.assessmentUser.deleteArray.useMutation();


    const handleSubmit = (values: FormValues) => {
        if ((existingQuestions.length + newQuestions.length) < 1) return;
        if ((existingAssessors.length + newAssessors.length) < 1) return;

        if (data) {
            update.mutate({
                id: data.id,
                start_date: new Date(values.startDate),
                end_date: new Date(values.endDate),
                description: values.description,
                site_id: Number(values.siteId),
                engagement_id: Number(values.engagementId),
                poc_id: Number(values.pocId),
            }, {
                onSuccess(data) {
                    existingQuestions.forEach(o =>
                        updateQuestion.mutate({
                            id: o.id,
                            question_id: o.question.id,
                            assessment_id: data.id,
                            filter_id: o.filter ? o.filter.id : undefined,
                        })
                    )
                    createQuestions.mutate(newQuestions.map(o => {
                        return {
                            question_id: o.question.id,
                            assessment_id: data.id,
                            filter_id: o.filterSelection != -1 ? o.filterSelection : undefined,
                        }
                    }), {
                        onSuccess(data) {
                            const newExistingArray = existingQuestions;
                            data.forEach((o, i) => {
                                newExistingArray.push(o)
                            });
                            setExistingQuestions(newExistingArray);
                            setNewQuestions([]);
                        }
                    })
                    deleteQuestions.mutate(deletedQuestions.map(o => o.id), {
                        onSuccess() {
                            setDeletedQuestions([]);
                        }
                    })

                    // Update Lead and Oversight

                    if (oversightAssessor) {
                        updateAssessmentUser.mutate({
                            id: oversightAssessor.id,
                            user_id: Number(values.oversightAssessorId),
                            assessment_id: data.id,
                        }, {
                            onSuccess() {
                            }
                        })
                    } else {
                        createAssessmentUser.mutate({
                            user_id: Number(values.oversightAssessorId),
                            assessment_id: data.id,
                        }, {
                            onSuccess() {
                            }
                        })
                    }

                    if (leadAssessor) {
                        updateAssessmentUser.mutate({
                            id: leadAssessor.id,
                            user_id: Number(values.leadAssessorId),
                            assessment_id: data.id,
                        }, {
                            onSuccess() {
                            }
                        })
                    } else {
                        createAssessmentUser.mutate({
                            user_id: Number(values.leadAssessorId),
                            assessment_id: data.id,
                        }, {
                            onSuccess() {
                            }
                        })
                    }

                    existingAssessors.forEach(o =>
                        updateAssessmentUser.mutate({
                            id: o.id,
                            user_id: Number(o.user.id),
                            assessment_id: data.id,
                        })
                    )
                    createAssessmentUsers.mutate(newAssessors.map(o => {
                        return {
                            user_id: Number(o.id),
                            assessment_id: data.id,
                        }
                    }), {
                        onSuccess(data) {
                            const newExistingArray = existingAssessors;
                            data.forEach((o) => {
                                const currUser = newAssessors.find(n => n.id == o.id)
                                if (currUser) newExistingArray.push({ ...o, user: currUser })
                            });
                            setExistingAssessors(newExistingArray);
                            setNewAssessors([]);
                        }
                    })
                    deleteAssessmentUsers.mutate(deletedAssessors.map(o => o.id), {
                        onSuccess() {
                            setDeletedAssessors([]);
                        }
                    })
                }
            })
        } else {
            create.mutate({
                start_date: new Date(values.startDate),
                end_date: new Date(values.endDate),
                description: values.description,
                site_id: Number(values.siteId),
                engagement_id: Number(values.engagementId),
                poc_id: Number(values.pocId),
            }, {
                onSuccess(data) {
                    createQuestions.mutate(newQuestions.map(o => {
                        return {
                            question_id: o.question.id,
                            assessment_id: data.id,
                            filter_id: o.filterSelection != -1 ? o.filterSelection : undefined,
                        }
                    }), {
                        onSuccess() {
                        }
                    })


                    createAssessmentUser.mutate({
                        user_id: Number(values.oversightAssessorId),
                        assessment_id: data.id,
                    }, {
                        onSuccess() {
                        }
                    })

                    createAssessmentUser.mutate({
                        user_id: Number(values.leadAssessorId),
                        assessment_id: data.id,
                    }, {
                        onSuccess() {
                        }
                    })

                    createAssessmentUsers.mutate(newAssessors.map(o => {
                        return {
                            user_id: Number(o.id),
                            assessment_id: data.id,
                        }
                    }), {
                        onSuccess() {
                        }
                    })

                    router.push(`/engagements/assessment/${data.id}`)
                }
            })

        }
    }

    return (
        <Formik
            enableReinitialize
            initialValues={assessmentData}
            validationSchema={validationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={handleSubmit}
        >
            {(formikProps: FormikProps<FormValues>) => (
                <Form>
                    <div className='assessment'>
                        <div className='assessment-content'>
                            <Card className='context'>
                                <div className='question-number'>
                                    <Typography>{data ? 'Edit Assessment # : ' : 'Create New Assessment'}</Typography>
                                    {data && <Typography>{data.id}</Typography>}
                                </div>
                                <div>
                                    {data && <StatusChip status='created' />}
                                    <Button variant='contained' type='submit' onClick={() => {
                                        if ((existingQuestions.length + newQuestions.length) < 1) {
                                            setQuestionError(`Requires at least 1 Question`);
                                        } else {
                                            setQuestionError(undefined);
                                        }
                                        if ((existingAssessors.length + newAssessors.length) < 1) {
                                            setAssessorError(`Requires at least 1 Assessor`);
                                        } else {
                                            setAssessorError(undefined);
                                        }
                                    }}>
                                        {data ? 'Save' : 'Create'}
                                    </Button>
                                </div>
                            </Card>
                            <div className='assessment-form'>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Card>
                                            <div className='widget-header'>General</div>
                                            <div className='widget-body widget-form'>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12}>
                                                        <Typography>Site</Typography>
                                                        <Field
                                                            name='siteId' label='' size='small'
                                                            component={Select}
                                                        >
                                                            <MenuItem value=''><em>Select a site...</em></MenuItem>
                                                            {sites && sites.map((site: Site) => {
                                                                return (
                                                                    <MenuItem value={site.id} key={site.id}>
                                                                        {site.id} - {site.name}
                                                                    </MenuItem>
                                                                )
                                                            })}
                                                        </Field>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography>Engagement</Typography>
                                                        <Field
                                                            name='engagementId' label='' size='small'
                                                            component={Select}
                                                        >
                                                            <MenuItem value=''><em>Select an engagement...</em></MenuItem>
                                                            {engagements && engagements.map((engagement: Engagement) => {
                                                                return (
                                                                    <MenuItem value={engagement.id} key={engagement.id}>
                                                                        {engagement.id} - {truncate(engagement.description, 50)}
                                                                    </MenuItem>
                                                                )
                                                            })}
                                                        </Field>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography>Client POC</Typography>
                                                        <Field
                                                            name='pocId' label='' size='small'
                                                            component={Select}
                                                        >
                                                            <MenuItem value=''><em>Select a POC...</em></MenuItem>
                                                            {clientPOC && clientPOC.map(poc => {
                                                                return (
                                                                    <MenuItem value={poc.id} key={poc.id}>
                                                                        {poc.first_name} {poc.last_name} - {poc.title}
                                                                    </MenuItem>
                                                                )
                                                            })}
                                                        </Field>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Typography>Start Date</Typography>
                                                        <Field
                                                            name='startDate' label='' size='small' type='date'
                                                            component={TextField}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Typography>End Date</Typography>
                                                        <Field
                                                            name='endDate' label='' size='small' type='date'
                                                            component={TextField}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography>Description</Typography>
                                                        <Field
                                                            name='description' label='' size='small' multiline
                                                            placeholder='Description...'
                                                            component={TextField}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card>
                                            <div className='widget-header'>Assessors</div>
                                            <div className='widget-body widget-form'>
                                                <Typography>Oversight Assessor</Typography>
                                                <Field
                                                    name='oversightAssessorId' label='' size='small'
                                                    component={Select}
                                                >
                                                    <MenuItem value=''><em>Select a user...</em></MenuItem>
                                                    {allOversightAssessors && allOversightAssessors.map((user: User) => {
                                                        return (
                                                            <MenuItem value={user.id} key={user.id}>
                                                                {user.first_name} {user.last_name}
                                                            </MenuItem>
                                                        )
                                                    })}
                                                </Field>
                                                <Typography>Lead Assessor</Typography>
                                                <Field
                                                    name='leadAssessorId' label='' size='small'
                                                    component={Select}
                                                >
                                                    <MenuItem value=''><em>Select a user...</em></MenuItem>
                                                    {allLeadAssessors && allLeadAssessors.map((user: User) => {
                                                        return (
                                                            <MenuItem value={user.id} key={user.id}>
                                                                {user.first_name} {user.last_name}
                                                            </MenuItem>
                                                        )
                                                    })}
                                                </Field>
                                                <Typography>Assessors</Typography>
                                                {existingAssessors.map((o, i) => {
                                                    return (
                                                        <div key={i} className='input-row hover-focus read-only'>
                                                            <span className='content'>
                                                                {o.user.first_name} {o.user.last_name}
                                                            </span>
                                                            <IconButton
                                                                color='default'
                                                                onClick={() => {
                                                                    setDeletedAssessors([...deletedAssessors, o]);
                                                                    const newExisting = existingAssessors.filter(x => x.id != o.id);
                                                                    setExistingAssessors(newExisting);
                                                                }}
                                                            ><Delete /></IconButton>
                                                        </div>
                                                    )
                                                })}
                                                {newAssessors.map((o, i) => {
                                                    return (
                                                        <div key={i} className='input-row hover-focus read-only'>
                                                            <span className='content'>
                                                                {o.first_name} {o.last_name}
                                                            </span>
                                                            <IconButton
                                                                color='default'
                                                                onClick={() => {
                                                                    const newNew = newAssessors.filter(x => x.id != o.id);
                                                                    setNewAssessors(newNew);
                                                                }}
                                                            ><Delete /></IconButton>
                                                        </div>
                                                    )
                                                })}
                                                <div className='input-row'>
                                                    <MuiSelect
                                                        size='small'
                                                        value={selectedAssessor ?? -1}
                                                        onChange={(event) => {
                                                            setSelectedAssessor(Number(event.target.value))
                                                            // setNewAssessors([...newAssessors, allAssessors.find(o => o.id == event.target.value]);
                                                        }}
                                                    >
                                                        <MenuItem value={-1}><em>Select a user...</em></MenuItem>
                                                        {assessorOptions && assessorOptions.map((o, i) => {
                                                            return (
                                                                <MenuItem key={i} value={o.id}>
                                                                    {o.first_name} {o.last_name}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                    </MuiSelect>
                                                    <IconButton
                                                        onClick={() => {
                                                            const assessor = allAssessors?.find(o => o.id == selectedAssessor)
                                                            if (assessor) {
                                                                setNewAssessors([...newAssessors, assessor]);
                                                                setSelectedAssessor(undefined);
                                                            }
                                                        }}
                                                    ><Add /></IconButton>
                                                </div>
                                                {assessorError &&
                                                    <div className='error-text'>
                                                        <span>{assessorError}</span>
                                                    </div>
                                                }
                                            </div>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Card>
                                            <div className='widget-header'>Assessment Questions</div>
                                            {questionError &&
                                                <div className='error-text'>
                                                    <span>{questionError}</span>
                                                </div>
                                            }
                                            <div className='changelog'>
                                                <div className='widget-table'>
                                                    <TableContainer component={Paper} className='browse-table'>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell align="center">Question #</TableCell>
                                                                    <TableCell align="center">Filter</TableCell>
                                                                    <TableCell align="left">Content</TableCell>
                                                                    <TableCell align="center">Action</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {existingQuestions && existingQuestions.map((q) => {
                                                                    return (
                                                                        <TableRow
                                                                            key={q.question.number}
                                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                        >
                                                                            <TableCell align="center">
                                                                                {q.question.number}
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                <MuiSelect
                                                                                    size='small'
                                                                                    value={q.filter ? q.filter.id : -1}
                                                                                    onChange={(event) => {
                                                                                        const newArr = existingQuestions.map(o => {
                                                                                            if (o.question.id == q.question.id) {
                                                                                                if (event.target.value == -1) {
                                                                                                    return {
                                                                                                        ...o,
                                                                                                        filter: null,
                                                                                                    }
                                                                                                }
                                                                                                const newFilter = o.question.ratings.find(o => o.filter_id == event.target.value);
                                                                                                if (newFilter) {
                                                                                                    return {
                                                                                                        ...o,
                                                                                                        filter: newFilter.filter,
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                            return o;
                                                                                        })
                                                                                        setExistingQuestions(newArr);
                                                                                    }}
                                                                                >
                                                                                    <MenuItem value={-1}><em>Standard</em></MenuItem>
                                                                                    {q.question.ratings.map((o, i) => {
                                                                                        if (o.filter)
                                                                                            return (
                                                                                                <MenuItem key={i} value={o.filter.id}>
                                                                                                    {titleCase(o.filter.type)}: {o.filter.name}
                                                                                                </MenuItem>
                                                                                            );
                                                                                    })}
                                                                                </MuiSelect>
                                                                            </TableCell>
                                                                            <TableCell align="left">{q.question.question}</TableCell>
                                                                            <TableCell align="center">
                                                                                <IconButton
                                                                                    color='default'
                                                                                    onClick={() => {
                                                                                        setDeletedQuestions([...deletedQuestions, q]);
                                                                                        const newExisting = existingQuestions.filter(x => x.id != q.id);
                                                                                        setExistingQuestions(newExisting);
                                                                                    }}
                                                                                ><Delete /></IconButton>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                })}
                                                                {newQuestions && newQuestions.map((q) => {
                                                                    const uniqueFilters = [...new Map(q.question.ratings.map(r => {
                                                                        return [r.filter?.type, r.filter]
                                                                    })).values()];
                                                                    return (
                                                                        <TableRow
                                                                            key={q.question.number}
                                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                        >
                                                                            <TableCell align="center">
                                                                                {q.question.number}
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                <MuiSelect
                                                                                    size='small'
                                                                                    value={q.filterSelection}
                                                                                    onChange={(event) => {
                                                                                        const newArr = newQuestions.map(o => {
                                                                                            if (o.question.id == q.question.id) {
                                                                                                return {
                                                                                                    ...o,
                                                                                                    filterSelection: Number(event.target.value),
                                                                                                }
                                                                                            }
                                                                                            return o;
                                                                                        })
                                                                                        setNewQuestions(newArr);
                                                                                    }}
                                                                                >
                                                                                    <MenuItem value={-1}><em>Standard</em></MenuItem>
                                                                                    {uniqueFilters.map((o, i) => {
                                                                                        if (o)
                                                                                            return (
                                                                                                <MenuItem key={i} value={o.id}>
                                                                                                    {titleCase(o.type)}: {o.name}
                                                                                                </MenuItem>
                                                                                            );
                                                                                        return;
                                                                                    })}
                                                                                </MuiSelect>
                                                                            </TableCell>
                                                                            <TableCell align="left">{q.question.question}</TableCell>
                                                                            <TableCell align="center">
                                                                                <IconButton
                                                                                    color='default'
                                                                                    onClick={() => {
                                                                                        const newNew = newQuestions.filter(x => x.id != q.id);
                                                                                        setNewQuestions(newNew);
                                                                                    }}
                                                                                ><Delete /></IconButton>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                    {addQuestion ?
                                                        <div className='questions-bank'>
                                                            <div>
                                                                {questions && questions.map((o, i) => {
                                                                    const existsA = existingQuestions.find(q => q.question.id == o.id);
                                                                    const existsB = newQuestions.find(q => q.question.id == o.id);
                                                                    if (existsA || existsB) return undefined;
                                                                    return (
                                                                        <Typography
                                                                            key={i}
                                                                            className={selectedQuestion && selectedQuestion.id == o.id ? 'active' : ''}
                                                                            onClick={() => {
                                                                                if (selectedQuestion == o) {
                                                                                    setSelectedQuestion(undefined)
                                                                                } else {
                                                                                    setSelectedQuestion(o)
                                                                                }
                                                                            }}
                                                                        >
                                                                            {o.number} - {o.question}
                                                                        </Typography>
                                                                    )
                                                                })}
                                                            </div>
                                                            <Button
                                                                variant='contained'
                                                                onClick={() => {
                                                                    if (selectedQuestion) {
                                                                        const newArr = newQuestions;
                                                                        newArr.push({ question: selectedQuestion, filterSelection: -1 } as QuestionType)
                                                                        setSelectedQuestion(undefined);
                                                                        setNewQuestions(newArr);
                                                                    }
                                                                    setAddQuestion(false);
                                                                }}
                                                            >
                                                                <Add />Add Question to Assessment
                                                            </Button>
                                                        </div> :
                                                        <Button variant='contained' onClick={() => { setAddQuestion(true) }}>
                                                            <Add />Add Question
                                                        </Button>
                                                    }
                                                </div>
                                            </div>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default EditAssessment;