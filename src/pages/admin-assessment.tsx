import * as React from 'react';
import { type NextPage } from "next";

import Layout from "~/components/Layout/Layout";
import { Button, Card, Checkbox, Grid, TextField, Typography } from '@mui/material';
import { Add, CheckBox } from '@mui/icons-material';

const AdminDashboard: NextPage = () => {

    return (
        <Layout>
            <Card className='assessment'>
                <Grid container>
                    <Grid item xs={2} className='questions-sidebar'>
                        <Typography>S1</Typography>
                        <Typography>S2</Typography>
                        <Typography>S3</Typography>
                        <Typography>S4</Typography>
                        <Typography>S5</Typography>
                        <Typography>S6</Typography>
                        <Typography>S7</Typography>
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
                            <div>
                                Question ID
                                <Checkbox />
                            </div>
                            <Typography>Question Content</Typography>
                            <TextField />
                            <Typography>Level 1</Typography>
                            <TextField multiline />
                            <Typography>Progression Statement</Typography>
                            <TextField multiline />
                            <Typography>Level 2</Typography>
                            <TextField multiline />
                            <Typography>Progression Statement</Typography>
                            <TextField multiline />
                            <Typography>Level 3</Typography>
                            <TextField multiline />
                            <Typography>Progression Statement</Typography>
                            <TextField multiline />
                            <Typography>Level 4</Typography>
                            <TextField multiline />
                            <Typography>Progression Statement</Typography>
                            <TextField multiline />
                            <Typography>Level 5</Typography>
                            <TextField multiline />
                            <div className='actions'>
                                <Button variant='contained'>Save</Button>
                                <Button variant='contained' color='error'>Deactivate</Button>
                                <Button variant='contained' color='success'>Activate</Button>
                            </div>
                        </Grid>
                        <Grid item xs={4} className='reference'>
                            <Typography>Reference Questions</Typography>
                            <Typography>Notes</Typography>
                            <TextField multiline />
                            <Typography>SME Info</Typography>
                            <Typography>Name:</Typography>
                            <Typography>Phone Number:</Typography>
                            <Typography>Email:</Typography>
                            <Typography>References</Typography>
                            <Typography>Owned By:</Typography>
                            <Typography>Last Updated At:</Typography>
                            <Typography>Last Updated By:</Typography>
                            <Typography>Created At:</Typography>
                            <Typography>Created By:</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </Layout>
    );
};

export default AdminDashboard;