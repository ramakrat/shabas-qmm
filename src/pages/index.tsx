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
                className='tab-panel'
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

    // =========== Add Object Modal State Management ===========
    // Keep modal boolean states here to trigger count query update

    const [clientModal, setClientModal] = React.useState<boolean>(false);
    const [siteModal, setSiteModal] = React.useState<boolean>(false);
    const [engagementModal, setEngagementModal] = React.useState<boolean>(false);
    const [assessmentModal, setAssessmentModal] = React.useState<boolean>(false);
    const [pocModal, setPOCModal] = React.useState<boolean>(false);



    // TODO: Make dynamic
    const totalClient = api.client.getTotalCount.useQuery().data;
    const totalSite = api.site.getTotalCount.useQuery(siteModal).data;
    const totalEngagement = api.engagement.getTotalCount.useQuery(engagementModal).data;
    const totalAssessment = api.assessment.getTotalCount.useQuery(assessmentModal).data;
    const totalPOC = api.poc.getTotalCount.useQuery(pocModal).data;

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
                                    <span className='label'>Clients</span>
                                    <span className='count'>{totalClient}</span>
                                </div>
                            } />
                            <Tab label={
                                <div className='filter'>
                                    <span className='label'>Sites</span>
                                    <span className='count'>{totalSite}</span>
                                </div>
                            } />
                            <Tab label={
                                <div className='filter'>
                                    <span className='label'>POC</span>
                                    <span className='count'>{totalPOC}</span>
                                </div>
                            } />
                            <Tab label={<>
                                <div className='filter'>
                                    <span className='label'>Engagement</span>
                                    <span className='count'>{totalEngagement}</span>
                                    <span className='label'> / Assessments</span>
                                    <span className='count'>{totalAssessment}</span>
                                </div>
                            </>} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <BrowseClients clientModal={clientModal} setClientModal={setClientModal} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <BrowseSites siteModal={siteModal} setSiteModal={setSiteModal} />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <BrowsePOCs pocModal={pocModal} setPOCModal={setPOCModal} />
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <BrowseAssessments engagementModal={engagementModal} setEngagementModal={setEngagementModal} assessmentModal={assessmentModal} setAssessmentModal={setAssessmentModal} />
                    </TabPanel>
                </Box>
            </div>
        </Layout>
    );
};

export default AdminDashboard;