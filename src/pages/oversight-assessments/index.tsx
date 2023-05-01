import { type NextPage } from "next";
import Layout from "~/components/Layout/Layout";
import BrowseAssessmentForms from "~/components/Assessor/BrowseAssessmentForms";

const OversightAssessments: NextPage = () => {
    return (
        <Layout active='oversight-assessments'>
            <BrowseAssessmentForms status='oversight' />
        </Layout>
    )
}

export default OversightAssessments;