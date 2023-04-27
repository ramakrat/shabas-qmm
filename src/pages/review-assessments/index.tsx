import { type NextPage } from "next";
import Layout from "~/components/Layout/Layout";
import BrowseAssessmentForms from "~/components/Assessment/BrowseAssessmentForms";

const CompletedAssessments: NextPage = () => {
    return (
        <Layout active='review-assessments'>
            <BrowseAssessmentForms status='assessor-review' />
        </Layout>
    )
}

export default CompletedAssessments;