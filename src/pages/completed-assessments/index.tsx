import { type NextPage } from "next";
import Layout from "~/components/Layout/Layout";
import BrowseAssessmentForms from "~/components/Assessor/BrowseAssessmentForms";

const CompletedAssessments: NextPage = () => {
    return (
        <Layout active='completed-assessments'>
            <BrowseAssessmentForms status='completed' />
        </Layout>
    )
}

export default CompletedAssessments;