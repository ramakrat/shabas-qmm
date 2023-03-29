import * as React from 'react';
import { type NextPage } from "next";

import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, IconButton, Tab, Tabs, Typography } from '@mui/material';
import { Add, Edit, ExpandMore } from '@mui/icons-material';

import Layout from "~/components/Layout/Layout";
import ClientModal from '~/components/Modals/ClientModal';
import SiteModal from '~/components/Modals/SiteModal';
import EngagementModal from '~/components/Modals/EngagementModal';
import AssessmentModal from '~/components/Modals/AssessmentModal';
import BrowseClients from '~/components/Browse/BrowseClients';
import BrowseSites from '~/components/Browse/BrowseSites';
import BrowseAssessments from '~/components/Browse/BrowseAssessments';

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

    return (
        <Layout active='dashboard'>
            <div className='dashboard'>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={value}
                            onChange={(_event: React.SyntheticEvent, newValue: number) => setValue(newValue)}
                            className='filters'
                        >
                            <Tab label={
                                <div className='filter'>
                                    <span>Clients</span>
                                    <span>1</span>
                                </div>
                            } />
                            <Tab label={
                                <div className='filter'>
                                    <span>Sites</span>
                                    <span>4</span>
                                </div>
                            } />
                            <Tab label={
                                <div className='filter'>
                                    <span>Engagement/Assessments</span>
                                    <span>15</span>
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
                </Box>
            </div>
        </Layout>
    );
};

export default AdminDashboard;