import * as React from 'react';
import { type NextPage } from "next";

import Layout from "~/components/Layout/Layout";
import { Button, Card, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';

const AdminDashboard: NextPage = () => {

    const engagementData = [{
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

    const assessmentData = [{
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

    return (
        <Layout>
            <div className='dashboard'>
                <div className='add-new-buttons'>
                    <Button variant='contained' endIcon={<Add />}>
                        New Client
                    </Button>
                    <Button variant='contained' endIcon={<Add />}>
                        New Site
                    </Button>
                    <Button variant='contained' endIcon={<Add />}>
                        New Engagement
                    </Button>
                    <Button variant='contained' endIcon={<Add />}>
                        New Assessor
                    </Button>
                </div>
                {engagementData.map((data, i) => {
                    return (
                        <Card className='data-row' key={i}>
                            <Typography>
                                {data.id}
                            </Typography>
                            <Typography>
                                {data.client}
                            </Typography>
                            <Typography>
                                {data.startDate.toDateString()}
                            </Typography>
                            <Typography>
                                {data.endDate.toDateString()}
                            </Typography>
                            <Typography>
                                {data.poc}
                            </Typography>
                            <Typography>
                                {data.shabasPoc}
                            </Typography>
                        </Card>
                    )
                })}
                {assessmentData.map((data, i) => {
                    return (
                        <Card className='data-row' key={i}>
                            <Typography>
                                {data.id}
                            </Typography>
                            <Typography>
                                {data.site}
                            </Typography>
                            <Typography>
                                {data.startDate.toDateString()}
                            </Typography>
                            <Typography>
                                {data.endDate.toDateString()}
                            </Typography>
                            <Typography>
                                {data.clientPoc}
                            </Typography>
                            <Typography>
                                {data.assessors}
                            </Typography>
                            <Typography>
                                {data.status}
                            </Typography>
                        </Card>
                    )
                })}
            </div>
        </Layout>
    );
};

export default AdminDashboard;