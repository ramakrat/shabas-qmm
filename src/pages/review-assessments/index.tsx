import { type NextPage } from "next";
import Layout from "~/components/Layout/Layout";
import BrowseAssessmentForms from "~/components/Assessor/BrowseAssessmentForms";
import { useSession } from "next-auth/react";

const CompletedAssessments: NextPage = () => {

    const { data: session } = useSession();

    return (
        <Layout active='review-assessments' session={session} requiredRoles={['LEAD_ASSESSOR']}>
            <BrowseAssessmentForms status='assessor-review' userId={Number(session?.user.id)} />
        </Layout>
    )
}

export default CompletedAssessments;