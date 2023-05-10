import * as React from 'react';
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import type { AssessmentQuestion, Engagement, Filter, Question, Rating, Site } from '@prisma/client';

import * as yup from "yup";
import { Field, Form, Formik, FormikProps } from "formik";
import TextField from '~/components/Form/TextField';
import Select from "~/components/Form/Select";

import {
    Button, Card, Grid, IconButton, MenuItem, Select as MuiSelect,
    TextField as MuiTextField, Typography, CardActions, CardContent, CardHeader, Paper, Step, StepButton, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { Add, Close, Delete } from '@mui/icons-material';

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import { dateInputFormat, titleCase, underscoreToTitle } from '~/utils/utils';
import StatusChip from '~/components/Common/StatusChip';

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
)[];

interface FormValues {
    description: string;
    startDate: string;
    endDate: string;
    siteId: string;
    engagementId: string;
    pocId: string;
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
});

const Assessment: NextPage = () => {

    const { assessment } = useRouter().query;
    const router = useRouter();

    // =========== Retrieve Form Context ===========

    const data = api.assessment.getByIdInclude.useQuery({ id: assessment ? Number(assessment) : undefined }).data;
    const sites = api.site.getAll.useQuery().data;
    const engagements = api.engagement.getAll.useQuery().data;
    const questions = api.question.getAllActiveInclude.useQuery().data;
    const clientPOC = api.poc.getAllClient.useQuery().data;

    // =========== Input Field States ===========

    const [assessmentData, setAssessmentData] = React.useState<FormValues>({
        description: '',
        startDate: dateInputFormat(new Date()),
        endDate: dateInputFormat(new Date()),
        siteId: '',
        engagementId: '',
        pocId: '',
    });

    const [existingQuestions, setExistingQuestions] = React.useState<AssessmentQuestionReturnType>([]);
    const [newQuestions, setNewQuestions] = React.useState<QuestionType[]>([]);

    const [addQuestion, setAddQuestion] = React.useState<boolean>(false);
    const [selectedQuestion, setSelectedQuestion] = React.useState<Question | undefined>(undefined);

    const [error, setError] = React.useState<string[] | undefined>(undefined);

    React.useEffect(() => {
        if (data) {
            setAssessmentData({
                description: data.description,
                startDate: dateInputFormat(data.start_date, true),
                endDate: dateInputFormat(data.end_date, true),
                siteId: data.site_id.toString(),
                engagementId: data.engagement_id.toString(),
                pocId: data.poc_id ? data.poc_id.toString() : '',
            })
        } else {
            setAssessmentData({
                description: '',
                startDate: dateInputFormat(new Date()),
                endDate: dateInputFormat(new Date()),
                siteId: '',
                engagementId: '',
                pocId: '',
            })
            setExistingQuestions([]);
            setNewQuestions([]);
        }
    }, [data])


    React.useEffect(() => {
        if (data && data.assessment_questions) {
            setExistingQuestions(data.assessment_questions as AssessmentQuestionReturnType);
        } else {
            setExistingQuestions([]);
        }
    }, [data])

    // =========== Submission Management ===========

    const create = api.assessment.create.useMutation();
    const update = api.assessment.update.useMutation();

    const createQuestions = api.assessmentQuestion.createArray.useMutation();
    const updateQuestion = api.assessmentQuestion.update.useMutation();


    const handleSubmit = (values: FormValues) => {

        if (existingQuestions.length < 1 && newQuestions.length < 1) return;

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
                    existingQuestions.forEach(o => {
                        updateQuestion.mutate({
                            id: o.id,
                            question_id: o.question.id,
                            assessment_id: data.id,
                            filter_id: o.filter ? o.filter.id : undefined,
                        })
                    })
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
                            router.push(`/assessments/${data.id}`)
                        }
                    })
                }
            })
        }
    }

    if (data && data.status != 'created') {
        return (
            <Layout active='assessments' admin>
                <div className='assessment'>
                    <div className='assessment-content'>
                        <Card className='context'>
                            <div className='question-number'>
                                <Typography>Assessment # : </Typography>
                                <Typography>{data.id}</Typography>
                            </div>
                            <div>
                                <StatusChip status={data.status as any} />
                            </div>
                        </Card>
                        <div className='assessment-form'>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Card>
                                        <div className='widget-header'>General</div>
                                        <div className='widget-body information-list'>
                                            <div>
                                                <Typography>Site</Typography>
                                                <Typography>{data.site_id}</Typography>
                                            </div>
                                            <div>
                                                <Typography>Engagement</Typography>
                                                <Typography>{data.engagement_id}</Typography>
                                            </div>
                                            <div>
                                                <Typography>Client POC</Typography>
                                                <Typography>{data.poc_id}</Typography>
                                            </div>
                                            <div>
                                                <Typography>Start Date</Typography>
                                                <Typography>{dateInputFormat(data.start_date, true, true)}</Typography>
                                            </div>
                                            <div>
                                                <Typography>End Date</Typography>
                                                <Typography>{dateInputFormat(data.end_date, true, true)}</Typography>
                                            </div>
                                            <div>
                                                <Typography>Description</Typography>
                                                <Typography>{data.description}</Typography>
                                            </div>
                                        </div>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card>
                                        <div className='widget-header'>Assessment Questions</div>
                                        <div className='changelog'>
                                            {error &&
                                                <div className='error-text'>
                                                    {error.map((e, i) => {
                                                        return <span key={i}>{e}</span>;
                                                    })}
                                                </div>
                                            }
                                            <TableContainer component={Paper} className='browse-table'>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align="center">Question #</TableCell>
                                                            <TableCell align="center">Filter</TableCell>
                                                            <TableCell align="left">Content</TableCell>
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
                                                                        {q.filter ? q.filter.toString() : 'Standard'}
                                                                    </TableCell>
                                                                    <TableCell align="left">{q.question.question}</TableCell>
                                                                </TableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </div>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card>
                                        <div className='widget-header'>Assessors</div>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
            </Layout >
        )
    }
    return (
        <Layout active='assessments' admin>
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
                                        <Typography>{data ? 'Edit Assessment ' + data.id : 'Create New Assessment'}</Typography>
                                    </div>
                                    <div>
                                        {data ?
                                            <Button variant='contained' type='submit'>Save</Button> :
                                            <Button variant='contained' type='submit' onClick={() => {
                                                const errStr = [];
                                                if (Object.keys(formikProps.errors).length > 0) {
                                                    errStr.push(`Cannot create assessment with errors in "General Information" form.`);
                                                }
                                                if (existingQuestions.length < 1 && newQuestions.length < 1) {
                                                    errStr.push(`Assessments must contain ${'\n'} at least 1 question.`);
                                                }

                                                if (errStr.length > 1) {
                                                    setError(errStr)
                                                } else {
                                                    setError(undefined);
                                                }
                                            }}>
                                                Create
                                            </Button>
                                        }
                                    </div>
                                </Card>
                                <div className='assessment-form'>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Card>
                                                <div className='widget-header'>General</div>
                                                <div className='widget-body widget-form'>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={12} md={4}>
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
                                                        <Grid item xs={12} md={4}>
                                                            <Typography>Engagement</Typography>
                                                            <Field
                                                                name='engagementId' label='' size='small'
                                                                component={Select}
                                                            >
                                                                <MenuItem value=''><em>Select an engagement...</em></MenuItem>
                                                                {engagements && engagements.map((engagement: Engagement) => {
                                                                    return (
                                                                        <MenuItem value={engagement.id} key={engagement.id}>
                                                                            {engagement.id} - {engagement.description}
                                                                        </MenuItem>
                                                                    )
                                                                })}
                                                            </Field>
                                                        </Grid>
                                                        <Grid item xs={12} md={4}>
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
                                        <Grid item xs={12}>
                                            <Card>
                                                <div className='widget-header'>Assessment Questions</div>
                                                <div className='changelog'>
                                                    {error &&
                                                        <div className='error-text'>
                                                            {error.map((e, i) => {
                                                                return <span key={i}>{e}</span>;
                                                            })}
                                                        </div>
                                                    }
                                                    <TableContainer component={Paper} className='browse-table'>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell align="center">Question #</TableCell>
                                                                    <TableCell align="center">Filter</TableCell>
                                                                    <TableCell align="left">Content</TableCell>
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
                                                                    const newArr = newQuestions;
                                                                    newArr.push({ question: selectedQuestion, filterSelection: -1 } as QuestionType)
                                                                    setSelectedQuestion(undefined);
                                                                    setNewQuestions(newArr);
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
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Card>
                                                <div className='widget-header'>Assessors</div>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default Assessment;