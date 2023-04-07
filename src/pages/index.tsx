import * as React from 'react';
import { type NextPage } from "next";

import { Box, Tab, Tabs } from '@mui/material';

import { api } from '~/utils/api';
import Layout from "~/components/Layout/Layout";
import BrowseClients from '~/components/Browse/BrowseClients';
import BrowseSites from '~/components/Browse/BrowseSites';
import BrowseAssessments from '~/components/Browse/BrowseAssessments';
import BrowsePOCs from '~/components/Browse/BrowsePOCs';

const AdminDashboard: NextPage = () => {

    const [value, setValue] = React.useState(0);

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    const TabPanel = (props: TabPanelProps) => {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        {children}
                    </Box>
                )}
            </div>
        );
    }

    // TODO: Make dynamic
    const totalClient = api.client.getTotalCount.useQuery().data;
    const totalSite = api.site.getTotalCount.useQuery().data;
    const totalEngagement = api.engagement.getTotalCount.useQuery().data;
    const totalAssessment = api.assessment.getTotalCount.useQuery().data;
    const totalPOC = api.poc.getTotalCount.useQuery().data;
    const totaleEngageAssess = (totalEngagement ?? 0) + (totalAssessment ?? 0);

    return (
        <Layout active='dashboard'>
            <div className='dashboard'>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={value}
                            onChange={(_event: React.SyntheticEvent, newValue: number) => setValue(newValue)}
                        >
                            <Tab label={
                                <div className='filter'>
                                    <span>Clients</span>
                                    <span>{totalClient}</span>
                                </div>
                            } />
                            <Tab label={
                                <div className='filter'>
                                    <span>Sites</span>
                                    <span>{totalSite}</span>
                                </div>
                            } />
                            <Tab label={
                                <div className='filter'>
                                    <span>Engagement/Assessments</span>
                                    <span>{totaleEngageAssess}</span>
                                </div>
                            } />
                            <Tab label={
                                <div className='filter'>
                                    <span>POC</span>
                                    <span>{totalPOC}</span>
                                </div>
                            } />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <BrowseClients />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <BrowseSites />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <BrowseAssessments />
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <BrowsePOCs />
                    </TabPanel>
                </Box>
            </div>
        </Layout>
    );
};

export default AdminDashboard;