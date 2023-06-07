import { type NextPage } from "next";
import Layout from "~/components/Layout/Layout";
import BrowseAssessmentForms from "~/components/Assessor/BrowseAssessmentForms";
import { useSession } from "next-auth/react";
import AccessDenied from "~/components/Common/AccessDenied";

const CompletedAssessments: NextPage = () => {

    const { data: session } = useSession();

    if (session?.user && session.user.role == 'ADMIN') {
        return (
            <Layout active='review-assessments'>
                <BrowseAssessmentForms status='assessor-review' />
            </Layout>
        )
    } else {
        return (
            <AccessDenied />
        )
    }
}

export default CompletedAssessments;