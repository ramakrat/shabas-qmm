import { type NextPage } from "next";
import Layout from "~/components/Layout/Layout";
import BrowseAssessmentForms from "~/components/Browse/BrowseAssessmentForms";

const CompletedAssessments: NextPage = () => {
    return (
        <Layout active='review-assessments'>
            <BrowseAssessmentForms status='assessor-review' />
        </Layout>
    )
}

export default CompletedAssessments;