import React from "react";
import type { Assessment, AssessmentQuestion, Engagement, Filter, Question, Rating, Site } from "@prisma/client";

import * as yup from "yup";
import { Field, Form, Formik, FormikProps } from "formik";
import TextField from "../../Form/TextField";
import Select from "../../Form/Select";

import { Button, Card, CardActions, CardContent, CardHeader, IconButton, MenuItem, Modal, Paper, Select as MuiSelect, Step, StepButton, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { api } from "~/utils/api";
import { dateInputFormat, titleCase } from "~/utils/utils";
import { useRouter } from "next/router";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    data?: Assessment;
}

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

const AssessmentModal: React.FC<Props> = (props) => {

    const { open, setOpen, data } = props;

    // =========== Retrieve Form Context ===========

    const sites = api.site.getAll.useQuery(open).data;
    const engagements = api.engagement.getAll.useQuery(open).data;
    const questions = api.question.getAllActiveInclude.useQuery(open).data;
    const assessmentData = api.assessment.getByIdInclude.useQuery({ id: data ? data.id : undefined }).data;
    const clientPOC = api.poc.getAllClient.useQuery().data;

    // =========== Input Field States ===========

    const [assessment, setAssessment] = React.useState<FormValues>({
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

    const steps = ['General Information', 'Edit Questions'];
    const [activeStep, setActiveStep] = React.useState(0);
    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    React.useEffect(() => {
        setError(undefined);
        setActiveStep(0);
        setAddQuestion(false);
        setNewQuestions([]);
    }, [open])

    React.useEffect(() => {
        if (data) {
            setAssessment({
                description: data.description,
                startDate: dateInputFormat(data.start_date, true),
                endDate: dateInputFormat(data.end_date, true),
                siteId: data.site_id.toString(),
                engagementId: data.engagement_id.toString(),
                pocId: data.poc_id ? data.poc_id.toString() : '',
            })
        } else {
            setAssessment({
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
        if (assessmentData && assessmentData.assessment_questions) {
            setExistingQuestions(assessmentData.assessment_questions as AssessmentQuestionReturnType);
        } else {
            setExistingQuestions([]);
        }
    }, [assessmentData])

    // =========== Submission Management ===========

    const create = api.assessment.create.useMutation();
    const update = api.assessment.update.useMutation();

    const createQuestions = api.assessmentQuestion.createArray.useMutation();
    const updateQuestion = api.assessmentQuestion.update.useMutation();

    const { reload } = useRouter();
    const handleSubmit = (
        values: FormValues,
    ) => {
        if (existingQuestions.length < 1 && newQuestions.length < 1) {
            return;
        }
        let succeeded = true;
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
                    }, {
                        onError(err: any) {
                            succeeded = false;
                            console.log(err);
                        }
                    })
                    createQuestions.mutate(newQuestions.map(o => {
                        return {
                            question_id: o.question.id,
                            assessment_id: data.id,
                            filter_id: o.filterSelection != -1 ? o.filterSelection : undefined,
                        }
                    }), {
                        onError(err) {
                            succeeded = false;
                            console.log(err);
                        }
                    })
                },
                onError(err) {
                    succeeded = false;
                    console.log(err);
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
                        onError(err) {
                            succeeded = false;
                            console.log(err);
                        }
                    })
                },
                onError(err) {
                    succeeded = false;
                    console.log(err);
                }
            })
        }
        if (succeeded) {
            setOpen(false);
            // reload();
        }
    }


    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal lg'>
            <div>
                <Formik
                    enableReinitialize
                    initialValues={assessment}
                    validationSchema={validationSchema}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={handleSubmit}
                >
                    {(formikProps: FormikProps<FormValues>) => (
                        <Form>
                            <Card>
                                <CardHeader
                                    title={data ? 'Edit Assessment ' + data.id : 'Create New Assessment'}
                                    action={
                                        <IconButton onClick={() => setOpen(false)}>
                                            <Close />
                                        </IconButton>
                                    }
                                />
                                <CardContent>
                                    <Stepper nonLinear activeStep={activeStep}>
                                        {steps.map((label, index) => (
                                            <Step key={label}>
                                                <StepButton color="inherit" onClick={handleStep(index)}>
                                                    {label}
                                                </StepButton>
                                            </Step>
                                        ))}
                                    </Stepper>
                                    {error &&
                                        <div className='error-text'>
                                            {error.map((e, i) => {
                                                return <span key={i}>{e}</span>;
                                            })}
                                        </div>
                                    }
                                    {activeStep == 0 &&
                                        <div className='form-info'>
                                            <Field
                                                name='siteId' label='Site' size='small'
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
                                            <Field
                                                name='engagementId' label='Engagement' size='small'
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
                                            <Field
                                                name='startDate' label='Start Date' size='small' type='date'
                                                component={TextField}
                                            />
                                            <Field
                                                name='endDate' label='End Date' size='small' type='date'
                                                component={TextField}
                                            />
                                            <Field
                                                name='description' label='Description' size='small'
                                                component={TextField}
                                            />
                                            <Field
                                                name='pocId' label='Client POC' size='small'
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
                                        </div>
                                    }
                                    {activeStep == 1 &&
                                        <div className='form-questions'>
                                            <TableContainer component={Paper}>
                                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                                                    {questions && questions.map((o, i) => {
                                                        const existsA = existingQuestions.find(q => q.question.id == o.id);
                                                        const existsB = newQuestions.find(q => q.question.id == o.id);
                                                        if (existsA || existsB) return undefined;
                                                        return (
                                                            <Typography
                                                                key={i}
                                                                className={selectedQuestion && selectedQuestion.id == o.id ? 'active' : ''}
                                                                onClick={() => setSelectedQuestion(o)}
                                                            >
                                                                {o.number} - {o.question}
                                                            </Typography>
                                                        )
                                                    })}
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
                                    }
                                </CardContent>
                                <CardActions>
                                    <Button variant='contained' color='error' onClick={() => setOpen(false)}>Cancel</Button>
                                    {data ?
                                        <Button variant='contained' type='submit'>Save</Button> :
                                        activeStep < steps.length - 1 ?
                                            <Button variant='contained' onClick={() => {
                                                setActiveStep(activeStep + 1)
                                            }}>
                                                Continue
                                            </Button> :
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
                                </CardActions>
                            </Card>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal >
    )
}

export default AssessmentModal;