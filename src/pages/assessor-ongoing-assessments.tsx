import * as React from 'react';
import { type NextPage } from "next";

import Layout from "~/components/Layout/Layout";
import { Button, Card, Checkbox, Grid, TextField, Typography } from '@mui/material';
import { Add, CheckBox, Info } from '@mui/icons-material';

const AdminDashboard: NextPage = () => {
    
    const [question, setQuestion] = React.useState<number>(1);
    const [showRating, setShowRating] = React.useState<boolean>(false);

    return (
        <Layout active='review-assessments'>
            <Card className='assessment'>
                <Grid container>
                    <Grid item xs={2} className='questions-sidebar'>
                        <div className='question-steppers'>
                            <Button variant='contained' disabled={question == 1} onClick={() => setQuestion(question - 1)}>Previous</Button>
                            <Button variant='contained' disabled={question == 7} onClick={() => setQuestion(question + 1)}>Next</Button>
                        </div>
                        <Typography className={question == 1 ? 'active' : ''} onClick={() => setQuestion(1)}>S1</Typography>
                        <Typography className={question == 2 ? 'active' : ''} onClick={() => setQuestion(2)}>S2</Typography>
                        <Typography className={question == 3 ? 'active' : ''} onClick={() => setQuestion(3)}>S3</Typography>
                        <Typography className={question == 4 ? 'active' : ''} onClick={() => setQuestion(4)}>S4</Typography>
                        <Typography className={question == 5 ? 'active' : ''} onClick={() => setQuestion(5)}>S5</Typography>
                        <Typography className={question == 6 ? 'active' : ''} onClick={() => setQuestion(6)}>S6</Typography>
                        <Typography className={question == 7 ? 'active' : ''} onClick={() => setQuestion(7)}>S7</Typography>
                    </Grid>
                    <Grid item xs={10} container>
                        <Grid item xs={12} className='context'>
                            <div>
                                <Typography>Question #</Typography>
                                <Typography>Question #</Typography>
                            </div>
                            <div>
                                <Typography>Pillar (Not Needed)</Typography>
                                <Typography>Pillar (Not Needed)</Typography>
                            </div>
                            <div>
                                <Typography>Practice Area</Typography>
                                <Typography>Practice Area</Typography>
                            </div>
                            <div>
                                <Typography>Topic Area</Typography>
                                <Typography>Topic Area</Typography>
                            </div>
                            <div>
                                <Typography>Priority</Typography>
                                <Typography>Priority</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={8} className='form'>
                            <div className='pre-questions'>
                                <Typography>Hint: XYZ</Typography>
                                <Typography>Start Time: XYZ</Typography>
                                <div className='rating'>
                                    <div className='rating-input'>
                                        <Typography>Rating</Typography>
                                        <Info fontSize='small' onClick={() => setShowRating(!showRating)} />
                                        <TextField size='small' />
                                    </div>
                                    {showRating &&
                                        <div>
                                            Level 1:<br />
                                            Progression Statement:<br />
                                            Level 2:<br />
                                            Progression Statement:<br />
                                            Level 3:<br />
                                            Progression Statement:<br />
                                            Level 4:<br />
                                            Progression Statement:<br />
                                            Level 5:<br />
                                            Progression Statement:
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className='question-content'>
                                <Typography>Rationale</Typography>
                                <TextField />
                                <Typography>Notes</Typography>
                                <TextField multiline />
                            </div>
                            <div className='save'>
                                <Button variant='contained'>Save</Button>
                            </div>
                        </Grid>
                        <Grid item xs={4} className='reference'>
                            <div>
                                <Typography>Reference Questions</Typography>
                                1. Example<br />
                                2. Example<br />
                                3. Example<br />
                                4. Example<br />
                                5. Example<br />
                                6. Example<br />
                                7. Example
                            </div>
                            <div>
                                <Typography>References</Typography>
                                1. Example<br />
                                2. Example<br />
                                3. Example<br />
                                4. Example<br />
                                5. Example<br />
                                6. Example<br />
                                7. Example
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </Layout >
    );
};

export default AdminDashboard;