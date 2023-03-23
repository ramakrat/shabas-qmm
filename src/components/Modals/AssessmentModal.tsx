import React from "react";
import { Button, Card, CardActions, CardContent, CardHeader, IconButton, Modal, Paper, Step, StepButton, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Add, Close } from "@mui/icons-material";

interface Props {
    open: boolean;
    setOpen: any;
    data?: any;
}

const AssessmentModal: React.FC<Props> = (props) => {
    const { open, setOpen, data } = props;

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
                            <TextField id='title' name='title' label='title' size='small' />
                            <TextField id='title' name='title' label='title' size='small' />
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
                        <Button variant='contained'>Save</Button> :
                        <Button variant='contained'>Create</Button>
                    }
                </CardActions>
            </Card>
        </Modal>
    )
}

export default AssessmentModal;