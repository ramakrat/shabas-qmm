import React from "react";
import { NextPage } from "next";
import { Button, Card, Typography, IconButton, Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { Add, Edit, ExpandMore } from "@mui/icons-material";
import AssessmentModal from "../Modals/AssessmentModal";
import EngagementModal from "../Modals/EngagementModal";

const engagementList = [{
    id: 'Engagement ID',
    client: 'Client ID',
    startDate: new Date(),
    endDate: new Date(),
    poc: 'FirstName Last Name',
    shabasPoc: 'FirstName Last Name',
}, {
    id: 'Engagement ID',
    client: 'Client ID',
    startDate: new Date(),
    endDate: new Date(),
    poc: 'FirstName Last Name',
    shabasPoc: 'FirstName Last Name',
}, {
    id: 'Engagement ID',
    client: 'Client ID',
    startDate: new Date(),
    endDate: new Date(),
    poc: 'FirstName Last Name',
    shabasPoc: 'FirstName Last Name',
}]

const assessmentList = [{
    id: 'Assessment ID',
    site: 'Site ID',
    startDate: new Date(),
    endDate: new Date(),
    clientPoc: 'FirstName Last Name',
    assessors: 'FirstName Last Name',
    status: 'Open',
}, {
    id: 'Assessment ID',
    site: 'Site ID',
    startDate: new Date(),
    endDate: new Date(),
    clientPoc: 'FirstName Last Name',
    assessors: 'FirstName Last Name',
    status: 'Open',
}, {
    id: 'Assessment ID',
    site: 'Site ID',
    startDate: new Date(),
    endDate: new Date(),
    clientPoc: 'FirstName Last Name',
    assessors: 'FirstName Last Name',
    status: 'Open',
}, {
    id: 'Assessment ID',
    site: 'Site ID',
    startDate: new Date(),
    endDate: new Date(),
    clientPoc: 'FirstName Last Name',
    assessors: 'FirstName Last Name',
    status: 'Open',
}, {
    id: 'Assessment ID',
    site: 'Site ID',
    startDate: new Date(),
    endDate: new Date(),
    clientPoc: 'FirstName Last Name',
    assessors: 'FirstName Last Name',
    status: 'Open',
}]

const BrowseAssessments: NextPage = () => {
    const [engagementData, setEngagementData] = React.useState<any>(null);
    const [assessmentData, setAssessmentData] = React.useState<any>(null);

    const [engagementModal, setEngagementModal] = React.useState<boolean>(false);
    const [assessmentModal, setAssessmentModal] = React.useState<boolean>(false);

    type SecondaryFilters = 'ongoing' | 'assessor-review' | 'oversight' | 'client-review' | 'completed';
    const [secondaryFilter, setSecondaryFilter] = React.useState<SecondaryFilters>('ongoing');

    return (
        <>
            <div>
                <div className='add-new-buttons'>
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
                {engagementList.map((data, i) => {
                    return (
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore />} className='data-row'>
                                <div className='attribute'>
                                    <Typography>Engagement ID</Typography>
                                    <Typography>{data.id}</Typography>
                                </div>
                                <div className='attribute'>
                                    <Typography>Client</Typography>
                                    <Typography>{data.client}</Typography>
                                </div>
                                <div className='attribute'>
                                    <Typography>Start Date</Typography>
                                    <Typography>{data.startDate.toDateString()}</Typography>
                                </div>
                                <div className='attribute'>
                                    <Typography>End Date</Typography>
                                    <Typography>{data.endDate.toDateString()}</Typography>
                                </div>
                                <div className='attribute'>
                                    <Typography>POC</Typography>
                                    <Typography>{data.poc}</Typography>
                                </div>
                                <div className='attribute'>
                                    <Typography>Shabas POC</Typography>
                                    <Typography>{data.shabasPoc}</Typography>
                                </div>
                                <div className='attribute'>
                                    <Typography>Edit</Typography>
                                    <IconButton onClick={() => { setEngagementData(1); setEngagementModal(true) }}>
                                        <Edit fontSize='small' />
                                    </IconButton>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Card className='data-row row-header' key={i}>
                                    <Typography>Assessment ID</Typography>
                                    <Typography>Site</Typography>
                                    <Typography>Start Date</Typography>
                                    <Typography>End Date</Typography>
                                    <Typography>Client POC</Typography>
                                    <Typography>Assessors</Typography>
                                    <Typography>Status</Typography>
                                    <Typography>Edit</Typography>
                                </Card>
                                {assessmentList.map((data, i) => {
                                    return (
                                        <Card className='data-row' key={i}>
                                            <Typography>{data.id}</Typography>
                                            <Typography>{data.site}</Typography>
                                            <Typography>{data.startDate.toDateString()}</Typography>
                                            <Typography>{data.endDate.toDateString()}</Typography>
                                            <Typography>{data.clientPoc}</Typography>
                                            <Typography>{data.assessors}</Typography>
                                            <Typography>{data.status}</Typography>
                                            <IconButton onClick={() => { setAssessmentData(1); setAssessmentModal(true) }}>
                                                <Edit fontSize='small' />
                                            </IconButton>
                                        </Card>
                                    )
                                })}
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
            </div>
            <EngagementModal open={engagementModal} setOpen={setEngagementModal} data={engagementData} />
            <AssessmentModal open={assessmentModal} setOpen={setAssessmentModal} data={assessmentData} />
        </>
    );
};

export default BrowseAssessments;