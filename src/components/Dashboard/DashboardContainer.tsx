import * as React from 'react';

import { Box, Tab, Tabs } from '@mui/material';

import { api } from '~/utils/api';
import Layout from "~/components/Layout/Layout";
import BrowseClients from '~/components/Dashboard/Clients/BrowseClients';
import BrowseAssessments from '~/components/Dashboard/Assessments/BrowseAssessments';
import BrowsePocs from '~/components/Dashboard/Pocs/BrowsePocs';
import { useRouter } from 'next/router';

interface Props {
    tab: string;
}

const DashboardContainer: React.FC<Props> = (props) => {

    const { tab } = props;

    const { push } = useRouter()

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
                            value={tab}
                            // eslint-disable-next-line @typescript-eslint/no-misused-promises
                            onChange={(_event: React.SyntheticEvent, newValue: string) => push(`/dashboard/${newValue}`)}
                        >
                            <Tab
                                value='clients'
                                label={
                                    <div className='filter'>
                                        <span className='label'>Clients</span>
                                        <span className='count'>{totalClient}</span>
                                        <span className='label'> / Sites</span>
                                        <span className='count'>{totalSite}</span>
                                    </div>
                                }
                            />
                            <Tab
                                value='pocs'
                                label={
                                    <div className='filter'>
                                        <span className='label'>POC</span>
                                        <span className='count'>{totalPOC}</span>
                                    </div>
                                }
                            />
                            <Tab
                                value='assessments'
                                label={<>
                                    <div className='filter'>
                                        <span className='label'>Engagement</span>
                                        <span className='count'>{totalEngagement}</span>
                                        <span className='label'> / Assessments</span>
                                        <span className='count'>{totalAssessment}</span>
                                    </div>
                                </>}
                            />
                        </Tabs>
                    </Box>
                    <div
                        role="tabpanel"
                        hidden={tab !== 'clients'}
                        id={`simple-tabpanel-clients`}
                        aria-labelledby={`simple-tab-clients`}
                        className='tab-panel'
                    >
                        {tab == 'clients' && (
                            <BrowseClients clientModal={clientModal} setClientModal={setClientModal} siteModal={siteModal} setSiteModal={setSiteModal}/>
                        )}
                    </div>
                    <div
                        role="tabpanel"
                        hidden={tab !== 'pocs'}
                        id={`simple-tabpanel-pocs`}
                        aria-labelledby={`simple-tab-pocs`}
                        className='tab-panel'
                    >
                        {tab == 'pocs' && (
                            <BrowsePocs pocModal={pocModal} setPOCModal={setPOCModal} />
                        )}
                    </div>
                    <div
                        role="tabpanel"
                        hidden={tab !== 'assessments'}
                        id={`simple-tabpanel-assessments`}
                        aria-labelledby={`simple-tab-assessments`}
                        className='tab-panel'
                    >
                        {tab == 'assessments' && (
                            <BrowseAssessments engagementModal={engagementModal} setEngagementModal={setEngagementModal} assessmentModal={assessmentModal} setAssessmentModal={setAssessmentModal} />
                        )}
                    </div>
                </Box>
            </div>
        </Layout>
    );
};

export default DashboardContainer;