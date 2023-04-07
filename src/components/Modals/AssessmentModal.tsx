import React from "react";
import type { Assessment, AssessmentQuestion, Filter, Question, Rating } from "@prisma/client";
import { Button, Card, CardActions, CardContent, CardHeader, FormControl, IconButton, InputLabel, MenuItem, Modal, Paper, Select, Step, StepButton, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { api } from "~/utils/api";
import { dateInputFormat, titleCase } from "~/utils/utils";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    data?: Assessment;
}

interface QuestionType {
    id?: number;
    question: (Question & {
        Rating: (Rating & {
            filter: Filter | null;
        })[];
    });
    filterSelection: number;
}

type AssessmentQuestionReturnType = (
    AssessmentQuestion &
    {
        question: (Question & {
            Rating: (Rating & {
                filter: Filter | null;
            })[];
        });
        filter: Filter | null
    }
)[]

const AssessmentModal: React.FC<Props> = (props) => {

    const { open, setOpen, data } = props;

    // =========== Retrieve Form Context ===========

    const sites = api.site.getAll.useQuery(open).data;
    const engagements = api.engagement.getAll.useQuery(open).data;
    const questions = api.question.getAllActiveInclude.useQuery(open).data;
    const assessment = api.assessment.getByIdInclude.useQuery({ id: data ? data.id : undefined }).data;

    // =========== Input Field States ===========

    const [status, setStatus] = React.useState<string>('');
    const [startDate, setStartDate] = React.useState<Date>(new Date());
    const [endDate, setEndDate] = React.useState<Date>(new Date());
    const [description, setDescription] = React.useState<string>('');
    const [siteId, setSiteId] = React.useState<number>(1);
    const [engagementId, setEngagementId] = React.useState<number>(1);

    const [existingQuestions, setExistingQuestions] = React.useState<AssessmentQuestionReturnType>([]);
    const [newQuestions, setNewQuestions] = React.useState<QuestionType[]>([]);

    const [addQuestion, setAddQuestion] = React.useState<boolean>(false);
    const [question, setQuestion] = React.useState<Question | undefined>(undefined);

    const steps = ['General Information', 'Edit Questions'];
    const [activeStep, setActiveStep] = React.useState(0);
    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };


    React.useEffect(() => {
        setActiveStep(0);
        if (data) {
            setStatus(data.status);
            setStartDate(data.start_date);
            setEndDate(data.end_date);
            setDescription(data.description);
            setSiteId(data.site_id);
            setEngagementId(data.engagement_id);
        } else {
            setStatus('');
            setStartDate(new Date());
            setEndDate(new Date());
            setDescription('');
            setSiteId(1);
            setEngagementId(1);

            setExistingQuestions([]);
            setNewQuestions([]);
        }
    }, [data])


    React.useEffect(() => {
        if (assessment && assessment.AssessmentQuestion) {
            setExistingQuestions(assessment.AssessmentQuestion as AssessmentQuestionReturnType);
        } else {
            setExistingQuestions([]);
        }
    }, [assessment])

    // =========== Submission Management ===========

    const create = api.assessment.create.useMutation();
    const update = api.assessment.update.useMutation();

    const assessQuestionCreate = api.assessmentQuestion.create.useMutation();
    const assessQuestionUpdate = api.assessmentQuestion.update.useMutation();

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (data) {
            let succeeded = true;
            update.mutate({
                id: data.id,
                status: status,
                start_date: startDate,
                end_date: endDate,
                description: description,
                site_id: siteId,
                engagement_id: engagementId,
            }, {
                onSuccess(data) {
                    existingQuestions.forEach(o => {
                        assessQuestionUpdate.mutate({
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
                    newQuestions.forEach(o => {
                        assessQuestionCreate.mutate({
                            question_id: o.question.id,
                            assessment_id: data.id,
                            filter_id: o.filterSelection != -1 ? o.filterSelection : undefined,
                        })
                    }, {
                        onError(err: any) {
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
            if (succeeded) {
                setOpen(false)
            }
        } else {
            let succeeded = true;
            create.mutate({
                status: status,
                start_date: startDate,
                end_date: endDate,
                description: description,
                site_id: siteId,
                engagement_id: engagementId,
            }, {
                onSuccess(data) {
                    console.log('hit');
                    newQuestions.forEach(o => {
                        assessQuestionCreate.mutate({
                            question_id: o.question.id,
                            assessment_id: data.id,
                            filter_id: o.filterSelection != -1 ? o.filterSelection : undefined,
                        })
                    }, {
                        onError(err: any) {
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
            if (succeeded) {
                setOpen(false)
            }
        }
    }


    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal lg'>
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader
                        title={data ? 'Edit Assessment' : 'Create New Assessment'}
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
                        {activeStep == 0 &&
                            <div className='form-info'>
                                <FormControl>
                                    <InputLabel size="small">Site</InputLabel>
                                    <Select
                                        name='siteId' label='Site' size='small'
                                        value={siteId}
                                        onChange={e => setSiteId(Number(e.target.value))}
                                    >
                                        {sites && sites.map(o => {
                                            return (
                                                <MenuItem value={o.id} key={o.id}>
                                                    {o.id} {o.name}
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <InputLabel size="small">Engagement</InputLabel>
                                    <Select
                                        name='engagementId' label='Engagement' size='small'
                                        value={siteId}
                                        onChange={e => setEngagementId(Number(e.target.value))}
                                    >
                                        {engagements && engagements.map(o => {
                                            return (
                                                <MenuItem value={o.id} key={o.id}>
                                                    {o.id} {o.description}
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                                <TextField
                                    name='status' label='Status' size='small'
                                    value={status}
                                    onChange={e => setStatus(e.target.value)}
                                />
                                <TextField
                                    name='startDate' label='Start Date' size='small' type='date'
                                    value={dateInputFormat(startDate)}
                                    onChange={e => setStartDate(new Date(e.target.value))}
                                />
                                <TextField
                                    name='endDate' label='End Date' size='small' type='date'
                                    value={dateInputFormat(endDate)}
                                    onChange={e => setEndDate(new Date(e.target.value))}
                                />
                                <TextField
                                    name='description' label='Description' size='small'
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
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
                                            {existingQuestions && existingQuestions.map((q) => (
                                                <TableRow
                                                    key={q.question.number}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="center">
                                                        {q.question.number}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Select
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
                                                                        const newFilter = o.question.Rating.find(o => o.filter_id == event.target.value);
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
                                                            {q.question.Rating.map((o, i) => {
                                                                if (o.filter)
                                                                    return (
                                                                        <MenuItem key={i} value={o.filter.id}>
                                                                            {titleCase(o.filter.type)}: {o.filter.name}
                                                                        </MenuItem>
                                                                    );
                                                                return;
                                                            })}
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell align="left">{q.question.question}</TableCell>
                                                </TableRow>
                                            ))}
                                            {newQuestions && newQuestions.map((q) => (
                                                <TableRow
                                                    key={q.question.number}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="center">
                                                        {q.question.number}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Select
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
                                                            {q.question.Rating.map((o, i) => {
                                                                if (o.filter)
                                                                    return (
                                                                        <MenuItem key={i} value={o.filter.id}>
                                                                            {titleCase(o.filter.type)}: {o.filter.name}
                                                                        </MenuItem>
                                                                    );
                                                                return;
                                                            })}
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell align="left">{q.question.question}</TableCell>
                                                </TableRow>
                                            ))}
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
                                                    className={question && question.id == o.id ? 'active' : ''}
                                                    onClick={() => setQuestion(o)}
                                                >
                                                    {o.number}
                                                </Typography>
                                            )
                                        })}
                                        <Button
                                            variant='contained'
                                            onClick={() => {
                                                const newArr = newQuestions;
                                                newArr.push({ question: question, filterSelection: -1 } as QuestionType)
                                                setQuestion(undefined);
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
                            <Button variant='contained' type='submit'>Create</Button>
                        }
                    </CardActions>
                </Card>
            </form>
        </Modal >
    )
}

export default AssessmentModal;