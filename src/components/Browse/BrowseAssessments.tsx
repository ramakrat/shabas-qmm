import React from "react";
import { NextPage } from "next";
import { Button, Card, Typography, IconButton, Accordion, AccordionDetails, AccordionSummary, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Add, Edit, ExpandMore } from "@mui/icons-material";
import AssessmentModal from "../Modals/AssessmentModal";
import EngagementModal from "../Modals/EngagementModal";
import { api } from "~/utils/api";

// const engagementList = [{
//     id: 'Engagement ID',
//     client: 'Client ID',
//     startDate: new Date(),
//     endDate: new Date(),
//     poc: 'FirstName Last Name',
//     shabasPoc: 'FirstName Last Name',
// }, {
//     id: 'Engagement ID',
//     client: 'Client ID',
//     startDate: new Date(),
//     endDate: new Date(),
//     poc: 'FirstName Last Name',
//     shabasPoc: 'FirstName Last Name',
// }, {
//     id: 'Engagement ID',
//     client: 'Client ID',
//     startDate: new Date(),
//     endDate: new Date(),
//     poc: 'FirstName Last Name',
//     shabasPoc: 'FirstName Last Name',
// }]

// const assessmentList = [{
//     id: 'Assessment ID',
//     site: 'Site ID',
//     startDate: new Date(),
//     endDate: new Date(),
//     clientPoc: 'FirstName Last Name',
//     assessors: 'FirstName Last Name',
//     status: 'Open',
// }, {
//     id: 'Assessment ID',
//     site: 'Site ID',
//     startDate: new Date(),
//     endDate: new Date(),
//     clientPoc: 'FirstName Last Name',
//     assessors: 'FirstName Last Name',
//     status: 'Open',
// }, {
//     id: 'Assessment ID',
//     site: 'Site ID',
//     startDate: new Date(),
//     endDate: new Date(),
//     clientPoc: 'FirstName Last Name',
//     assessors: 'FirstName Last Name',
//     status: 'Open',
// }, {
//     id: 'Assessment ID',
//     site: 'Site ID',
//     startDate: new Date(),
//     endDate: new Date(),
//     clientPoc: 'FirstName Last Name',
//     assessors: 'FirstName Last Name',
//     status: 'Open',
// }, {
//     id: 'Assessment ID',
//     site: 'Site ID',
//     startDate: new Date(),
//     endDate: new Date(),
//     clientPoc: 'FirstName Last Name',
//     assessors: 'FirstName Last Name',
//     status: 'Open',
// }]

const BrowseAssessments: NextPage = () => {

    const [engagementData, setEngagementData] = React.useState<any>(null);
    const [assessmentData, setAssessmentData] = React.useState<any>(null);

    const [engagementModal, setEngagementModal] = React.useState<boolean>(false);
    const [assessmentModal, setAssessmentModal] = React.useState<boolean>(false);

    type SecondaryFilters = 'ongoing' | 'assessor-review' | 'oversight' | 'client-review' | 'completed';
    const [secondaryFilter, setSecondaryFilter] = React.useState<SecondaryFilters>('ongoing');

    const { data } = api.engagement.getAll.useQuery();

    return (
        <>
            <div className='browse-add'>
                <Button variant='contained' endIcon={<Add />} onClick={() => { setEngagementData(null); setEngagementModal(true) }}>
                    New Engagement
                </Button>
                <Button variant='contained' endIcon={<Add />} onClick={() => { setAssessmentData(null); setAssessmentModal(true) }}>
                    New Assessment
                </Button>
            </div>
            <div className='filters'>
                <div className='filter' onClick={() => setSecondaryFilter('ongoing')}>
                    <span className={secondaryFilter == 'ongoing' ? 'active' : ''}>Ongoing</span>
                    <span>4</span>
                </div>
                <div className='filter' onClick={() => setSecondaryFilter('assessor-review')}>
                    <span className={secondaryFilter == 'assessor-review' ? 'active' : ''}>Assessor Review</span>
                    <span>1</span>
                </div>
                <div className='filter' onClick={() => setSecondaryFilter('oversight')}>
                    <span className={secondaryFilter == 'oversight' ? 'active' : ''}>Oversight</span>
                    <span>15</span>
                </div>
                <div className='filter' onClick={() => setSecondaryFilter('client-review')}>
                    <span className={secondaryFilter == 'client-review' ? 'active' : ''}>Client Review</span>
                    <span>4</span>
                </div>
                <div className='filter' onClick={() => setSecondaryFilter('completed')}>
                    <span className={secondaryFilter == 'completed' ? 'active' : ''}>Completed</span>
                    <span>15</span>
                </div>
            </div>
            {data && data.map((e, i) => {
                return (
                    <Accordion key={i}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Engagement ID</TableCell>
                                            <TableCell align="left">Client</TableCell>
                                            <TableCell align="left">Start Date</TableCell>
                                            <TableCell align="left">End Date</TableCell>
                                            <TableCell align="left">POC</TableCell>
                                            <TableCell align="center">Edit</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow
                                            key={i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">{e.id}</TableCell>
                                            <TableCell align="left">{e.client_id}</TableCell>
                                            <TableCell align="left">{e.start_date.toDateString()}</TableCell>
                                            <TableCell align="left">{e.end_date.toDateString()}</TableCell>
                                            <TableCell align="left">e.POC</TableCell>
                                            <TableCell align="center">
                                                <IconButton onClick={() => { setEngagementData(e); setEngagementModal(true) }}>
                                                    <Edit fontSize='small' />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Assessment ID</TableCell>
                                            <TableCell align="left">Site</TableCell>
                                            <TableCell align="left">Start Date</TableCell>
                                            <TableCell align="left">End Date</TableCell>
                                            <TableCell align="left">Client POC</TableCell>
                                            <TableCell align="left">Assessors</TableCell>
                                            <TableCell align="left">Status</TableCell>
                                            <TableCell align="center">Edit</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {e.Assessment.map((a, i) => {
                                            return (
                                                <TableRow
                                                    key={i}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="center">{a.id}</TableCell>
                                                    <TableCell align="left">{a.site_id}</TableCell>
                                                    <TableCell align="left">{a.start_date.toDateString()}</TableCell>
                                                    <TableCell align="left">{a.end_date.toDateString()}</TableCell>
                                                    <TableCell align="left">a.POC</TableCell>
                                                    <TableCell align="left">a.assessor</TableCell>
                                                    <TableCell align="left">{a.status}</TableCell>
                                                    <TableCell align="center">
                                                        <IconButton onClick={() => { setAssessmentData(a); setAssessmentModal(true) }}>
                                                            <Edit fontSize='small' />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>
                )
            })}
            <EngagementModal open={engagementModal} setOpen={setEngagementModal} data={engagementData} />
            <AssessmentModal open={assessmentModal} setOpen={setAssessmentModal} data={assessmentData} />
        </>
    );
};

export default BrowseAssessments;