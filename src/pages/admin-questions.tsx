import * as React from 'react';
import { type NextPage } from "next";

import Layout from "~/components/Layout/Layout";
import { Button, Card, Checkbox, Grid, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Add, CheckBox } from '@mui/icons-material';
import IndustryModal from '~/components/Modals/QuestionFilters/IndustryModal';
import ApiSegmentModal from '~/components/Modals/QuestionFilters/ApiSegmentModal';
import SiteSpecificModal from '~/components/Modals/QuestionFilters/SiteSpecificModal';
import QuestionsSidebar from '~/components/Assessment/QuestionsSidebar';
import QuestionContext from '~/components/Assessment/QuestionContext';

const AdminDashboard: NextPage = () => {

    const [question, setQuestion] = React.useState<number>(1);
    const [addIndustry, setAddIndustry] = React.useState<boolean>(false);
    const [addApiSegment, setAddApiSegment] = React.useState<boolean>(false);
    const [addSiteSpecific, setAddSiteSpecific] = React.useState<boolean>(false);

    // TODO: Title the set of questions based on what mode is selected

    return (
        <Layout active='questions'>
            <div className='assessment'>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <QuestionsSidebar question={question} setQuestion={setQuestion} />
                    </Grid>
                    <Grid item xs={10} container spacing={2}>
                        <Grid item xs={12}>
                            <QuestionContext />
                        </Grid>
                        <Grid item xs={8}>
                            <Card className='filters'>
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
                            </Card>
                            <Card className='question-content'>
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
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                            <Card className='reference'>
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
                            </Card>
                        </Grid>
                        <Grid item xs={8}>
                            <Card className='actions'>
                                <div>
                                    <Button variant='contained' color='error'>Deactivate</Button>
                                    <Button variant='contained' color='success'>Activate</Button>
                                </div>
                                <Button variant='contained'>Save</Button>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <IndustryModal open={addIndustry} setOpen={setAddIndustry} />
            <ApiSegmentModal open={addApiSegment} setOpen={setAddApiSegment} />
            <SiteSpecificModal open={addSiteSpecific} setOpen={setAddSiteSpecific} />
        </Layout>
    );
};

export default AdminDashboard;