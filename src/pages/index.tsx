import * as React from 'react';
import { type NextPage } from "next";

import { Accordion, AccordionDetails, AccordionSummary, Button, Card, IconButton, Typography } from '@mui/material';
import { Add, Edit, ExpandMore } from '@mui/icons-material';

import Layout from "~/components/Layout/Layout";
import ClientModal from '~/components/Modals/ClientModal';
import SiteModal from '~/components/Modals/SiteModal';
import EngagementModal from '~/components/Modals/EngagementModal';
import AssessmentModal from '~/components/Modals/AssessmentModal';

const AdminDashboard: NextPage = () => {

    type MainFilters = 'clients' | 'sites' | 'engage-assess';
    const [mainFilter, setMainFilter] = React.useState<MainFilters>('clients');

    type SecondaryFilters = 'ongoing' | 'assessor-review' | 'oversight' | 'client-review' | 'completed';
    const [secondaryFilter, setSecondaryFilter] = React.useState<SecondaryFilters>('ongoing');

    const clientList = [{
        id: 'Client ID',
        name: 'Client Name',
        address: '123456 Main Street, City, NY 123456',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    }]

    const siteList = [{
        id: 'Site ID',
        name: 'Site Name',
        address: '123456 Main Street, City, NY 123456',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    }, {
        id: 'Site ID',
        name: 'Site Name',
        address: '123456 Main Street, City, NY 123456',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    }, {
        id: 'Site ID',
        name: 'Site Name',
        address: '123456 Main Street, City, NY 123456',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    }, {
        id: 'Site ID',
        name: 'Site Name',
        address: '123456 Main Street, City, NY 123456',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    }]

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

    const [clientData, setClientData] = React.useState<any>(null);
    const [siteData, setSiteData] = React.useState<any>(null);
    const [engagementData, setEngagementData] = React.useState<any>(null);
    const [assessmentData, setAssessmentData] = React.useState<any>(null);


    const [clientModal, setClientModal] = React.useState<boolean>(false);
    const [siteModal, setSiteModal] = React.useState<boolean>(false);
    const [engagementModal, setEngagementModal] = React.useState<boolean>(false);
    const [assessmentModal, setAssessmentModal] = React.useState<boolean>(false);

    return (
        <Layout active='dashboard'>
            <div className='dashboard'>
                <div className='filters'>
                    <div className='main-filters'>
                        <div className='filter' onClick={() => setMainFilter('clients')}>
                            <span className={mainFilter == 'clients' ? 'active' : ''}>Clients</span>
                            <span>1</span>
                        </div>
                        <div className='filter' onClick={() => setMainFilter('sites')}>
                            <span className={mainFilter == 'sites' ? 'active' : ''}>Sites</span>
                            <span>4</span>
                        </div>
                        <div className='filter' onClick={() => setMainFilter('engage-assess')}>
                            <span className={mainFilter == 'engage-assess' ? 'active' : ''}>Engagement/Assessments</span>
                            <span>15</span>
                        </div>
                    </div>
                    <div className='secondary-filters'>
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
                </div>
                <div className='add-new-buttons'>
                    <Button variant='contained' endIcon={<Add />} onClick={() => { setClientData(null); setClientModal(true) }}>
                        New Client
                    </Button>
                    <Button variant='contained' endIcon={<Add />} onClick={() => { setSiteData(null); setSiteModal(true) }}>
                        New Site
                    </Button>
                    <Button variant='contained' endIcon={<Add />} onClick={() => { setEngagementData(null); setEngagementModal(true) }}>
                        New Engagement
                    </Button>
                    <Button variant='contained' endIcon={<Add />} onClick={() => { setAssessmentData(null); setAssessmentModal(true) }}>
                        New Assessment
                    </Button>
                </div>
                {mainFilter == 'clients' &&
                    <div className='basic-rows'>
                        <Card className='data-row row-header'>
                            <Typography>Client ID</Typography>
                            <Typography>Name</Typography>
                            <Typography>Address</Typography>
                            <Typography>Description</Typography>
                            <Typography>Edit</Typography>
                        </Card>
                        {clientList.map((data, i) => {
                            return (
                                <Card className='data-row' key={i}>
                                    <Typography>{data.id}</Typography>
                                    <Typography>{data.name}</Typography>
                                    <Typography>{data.address}</Typography>
                                    <Typography>{data.description}</Typography>
                                    <IconButton onClick={() => { setClientData(1); setClientModal(true) }}>
                                        <Edit fontSize='small' />
                                    </IconButton>
                                </Card>
                            )
                        })}
                    </div>
                }
                {mainFilter == 'sites' &&
                    <div className='basic-rows'>
                        <Card className='data-row row-header'>
                            <Typography>Site ID</Typography>
                            <Typography>Name</Typography>
                            <Typography>Address</Typography>
                            <Typography>Description</Typography>
                            <Typography>Edit</Typography>
                        </Card>
                        {siteList.map((data, i) => {
                            return (
                                <Card className='data-row' key={i}>
                                    <Typography>{data.id}</Typography>
                                    <Typography>{data.name}</Typography>
                                    <Typography>{data.address}</Typography>
                                    <Typography>{data.description}</Typography>
                                    <IconButton onClick={() => { setSiteData(1); setSiteModal(true) }}>
                                        <Edit fontSize='small' />
                                    </IconButton>
                                </Card>
                            )
                        })}
                    </div>
                }
                {mainFilter == 'engage-assess' && engagementList.map((data, i) => {
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
            <ClientModal open={clientModal} setOpen={setClientModal} data={clientData} />
            <SiteModal open={siteModal} setOpen={setSiteModal} data={siteData} />
            <EngagementModal open={engagementModal} setOpen={setEngagementModal} data={engagementData} />
            <AssessmentModal open={assessmentModal} setOpen={setAssessmentModal} data={assessmentData} />
        </Layout>
    );
};

export default AdminDashboard;