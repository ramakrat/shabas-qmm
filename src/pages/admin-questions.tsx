import * as React from 'react';
import { type NextPage } from "next";

import Layout from "~/components/Layout/Layout";
import { Button, Card, Checkbox, Grid, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Add, CheckBox } from '@mui/icons-material';
import IndustryModal from '~/components/Modals/QuestionFilters/IndustryModal';
import ApiSegmentModal from '~/components/Modals/QuestionFilters/APISegmentModal';
import SiteSpecificModal from '~/components/Modals/QuestionFilters/SiteSpecificModal';

const AdminDashboard: NextPage = () => {

    const [question, setQuestion] = React.useState<number>(1);
    const [addIndustry, setAddIndustry] = React.useState<boolean>(false);
    const [addApiSegment, setAddApiSegment] = React.useState<boolean>(false);
    const [addSiteSpecific, setAddSiteSpecific] = React.useState<boolean>(false);

    // TODO: Title the set of questions based on what mode is selected

    return (
        <Layout active='questions'>
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
                            <div className='filters'>
                                <Typography>Industry</Typography>
                                <Select value={1} size='small'>
                                    <MenuItem value={1}>Example 1</MenuItem>
                                    <MenuItem value={2}>Example 2</MenuItem>
                                    <MenuItem>
                                        <Button variant='contained' onClick={() => { setAddIndustry(true) }}>
                                            <Add />
                                            Add Industry
                                        </Button>
                                    </MenuItem>
                                </Select>
                                <Typography>API Segment</Typography>
                                <Select value={1} size='small'>
                                    <MenuItem value={1}>Example 1</MenuItem>
                                    <MenuItem value={2}>Example 2</MenuItem>
                                    <MenuItem>
                                        <Button variant='contained' onClick={() => { setAddApiSegment(true) }}>
                                            <Add />
                                            Add API Segment
                                        </Button>
                                    </MenuItem>
                                </Select>
                                <Typography>Site: Specific</Typography>
                                <Select value={1} size='small'>
                                    <MenuItem value={1}>Example 1</MenuItem>
                                    <MenuItem value={2}>Example 2</MenuItem>
                                    <MenuItem>
                                        <Button variant='contained' onClick={() => { setAddSiteSpecific(true) }}>
                                            <Add />
                                            Add Site Specific
                                        </Button>
                                    </MenuItem>
                                </Select>
                            </div>
                            <div className='question-content'>
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
                            </div>
                        </Grid>
                        <Grid item xs={4} className='reference'>
                            <div>
                                <Typography>Reference Questions</Typography>
                                1.
                                <TextField label='Question' size='small' />
                                <IconButton><Add /></IconButton>
                            </div>
                            <div>
                                <Typography>SME Info</Typography>
                                <TextField label='Name' size='small' />
                                <TextField label='Phone Number' size='small' />
                                <TextField label='Email' size='small' />
                            </div>
                            <div>
                                <Typography>References</Typography>
                                1.
                                <TextField label='Question' size='small' />
                                <IconButton><Add /></IconButton>
                            </div>
                            <div>
                                <Typography>Owned By:</Typography>
                                <Typography>Last Updated At:</Typography>
                                <Typography>Last Updated By:</Typography>
                                <Typography>Created At:</Typography>
                                <Typography>Created By:</Typography>
                            </div>
                        </Grid>
                        <div className='actions'>
                            <Button variant='contained'>Save</Button>
                            <div>
                                <Button variant='contained' color='error'>Deactivate</Button>
                                <Button variant='contained' color='success'>Activate</Button>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Card>
            <IndustryModal open={addIndustry} setOpen={setAddIndustry} />
            <ApiSegmentModal open={addApiSegment} setOpen={setAddApiSegment} />
            <SiteSpecificModal open={addSiteSpecific} setOpen={setAddSiteSpecific} />
        </Layout>
    );
};

export default AdminDashboard;