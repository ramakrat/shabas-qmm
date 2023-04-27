import { type NextPage } from "next";
import Layout from "~/components/Layout/Layout";
import BrowseAssessmentForms from "~/components/Assessment/BrowseAssessmentForms";

const OngoingAssessments: NextPage = () => {
    return (
        <Layout active='ongoing-assessments'>
            <BrowseAssessmentForms status='ongoing' />
        </Layout>
    )
}

export default OngoingAssessments;