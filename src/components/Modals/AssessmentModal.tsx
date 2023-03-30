import React from "react";
import { Button, Card, CardActions, CardContent, CardHeader, FormControl, IconButton, InputLabel, MenuItem, Modal, Paper, Select, Step, StepButton, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { Assessment } from "@prisma/client";
import { api } from "~/utils/api";

interface Props {
    open: boolean;
    setOpen: any;
    data?: Assessment;
}

const AssessmentModal: React.FC<Props> = (props) => {

    const { open, setOpen, data } = props;

    // =========== Retrieve Form Context ===========

    const sites = api.site.getAll.useQuery().data;
    const engagements = api.engagement.getAll.useQuery().data;

    // =========== Input Field States ===========

    const [status, setStatus] = React.useState<string>('');
    const [startDate, setStartDate] = React.useState<Date>(new Date());
    const [endDate, setEndDate] = React.useState<Date>(new Date());
    const [description, setDescription] = React.useState<string>('');
    const [siteId, setSiteId] = React.useState<number>(1);
    const [engagementId, setEngagementId] = React.useState<number>(1);

    // =========== Submission Management ===========

    const create = api.assessment.create.useMutation();
    const update = api.assessment.update.useMutation();

    React.useEffect(() => {
        if (data) {
            setStatus(data.status);
            setStartDate(data.start_date);
            setEndDate(data.end_date);
            setDescription(data.description);
            setSiteId(data.site_id);
            setEngagementId(data.engagement_id);
        }
    }, [data])

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (data) {
            update.mutate({
                id: data.id,
                status: status,
                start_date: startDate,
                end_date: endDate,
                description: description,
                site_id: siteId,
                engagement_id: engagementId,
            })
        } else {
            create.mutate({
                status: status,
                start_date: startDate,
                end_date: endDate,
                description: description,
                site_id: siteId,
                engagement_id: engagementId,
            })
        }
        if (create.isSuccess || update.isSuccess)
            setOpen(false)
    }


    const [question, setQuestion] = React.useState<number>(1);

    const steps = ['General Information', 'Edit Questions'];

    const [addQuestion, setAddQuestion] = React.useState<boolean>(false);

    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});


    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    const rows = [{
        name: 'S1',
        industry: 'N/A',
        api: 'N/A',
        site: 'N/A',
        content: 'Question Content',
    }, {
        name: 'S2',
        industry: 'N/A',
        api: 'N/A',
        site: 'N/A',
        content: 'Question Content',
    }];

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
                                <Step key={label} completed={completed[index]}>
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
                                    name='startDate' label='Start Date' size='small'
                                    value={startDate}
                                    onChange={e => setStartDate(new Date(e.target.value))}
                                />
                                <TextField
                                    name='endDate' label='End Date' size='small'
                                    value={endDate}
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
                                                <TableCell align="center">Industry</TableCell>
                                                <TableCell align="center">API Segment</TableCell>
                                                <TableCell align="center">Site Specific</TableCell>
                                                <TableCell align="left">Content</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow
                                                    key={row.name}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="center" component="th" scope="row">
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {row.industry}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {row.api}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {row.site}
                                                    </TableCell>
                                                    <TableCell align="left">{row.content}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {addQuestion ?
                                    <div className='questions-bank'>
                                        <Typography className={question == 1 ? 'active' : ''} onClick={() => setQuestion(1)}>S1</Typography>
                                        <Typography className={question == 2 ? 'active' : ''} onClick={() => setQuestion(2)}>S2</Typography>
                                        <Typography className={question == 3 ? 'active' : ''} onClick={() => setQuestion(3)}>S3</Typography>
                                        <Typography className={question == 4 ? 'active' : ''} onClick={() => setQuestion(4)}>S4</Typography>
                                        <Typography className={question == 5 ? 'active' : ''} onClick={() => setQuestion(5)}>S5</Typography>
                                        <Typography className={question == 6 ? 'active' : ''} onClick={() => setQuestion(6)}>S6</Typography>
                                        <Typography className={question == 7 ? 'active' : ''} onClick={() => setQuestion(7)}>S7</Typography>
                                        <Button variant='contained' onClick={() => { setAddQuestion(false) }}><Add />Add Question to Assessment</Button>
                                    </div> :
                                    <Button variant='contained' onClick={() => { setAddQuestion(true) }}><Add />Add Question</Button>
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
        </Modal>
    )
}

export default AssessmentModal;