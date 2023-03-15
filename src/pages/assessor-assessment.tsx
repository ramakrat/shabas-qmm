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
                            <Typography>Hint: XYZ</Typography>
                            <Typography>Start Time: XYZ</Typography>
                            <div>
                                Rating
                                <Checkbox />
                            </div>
                            <Typography>Rationale</Typography>
                            <TextField />
                            <Typography>Notes</Typography>
                            <TextField multiline />
                            <Button variant='contained'>Save</Button>
                        </Grid>
                        <Grid item xs={4} className='reference'>
                            <Typography>Reference Questions</Typography>
                            <Typography>References</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </Layout>
    );
};

export default AdminDashboard;