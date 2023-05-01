import * as React from 'react';
import { type NextPage } from "next";
import BrowseAssessments from '~/components/Dashboard/Assessments/BrowseAssessments';
import Layout from '~/components/Layout/Layout';

const EngagementsAssessments: NextPage = () => {
    const [engagementModal, setEngagementModal] = React.useState<boolean>(false);
    const [assessmentModal, setAssessmentModal] = React.useState<boolean>(false);

    return (
        <Layout active='assessments' admin>
            <div className='dashboard'>
                <BrowseAssessments engagementModal={engagementModal} setEngagementModal={setEngagementModal} assessmentModal={assessmentModal} setAssessmentModal={setAssessmentModal} />
            </div>
        </Layout>
    );
};

export default EngagementsAssessments;