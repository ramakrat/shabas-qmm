import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "~/components/Layout/Layout";
import BrowseAssessmentForms from "~/components/Assessment/BrowseAssessmentForms";

const CompletedAssessments: NextPage = () => {

    const { data: session } = useSession();

    return (
        <Layout active='review-assessments' session={session} requiredRoles={['LEAD_ASSESSOR']}>
            <BrowseAssessmentForms status='ongoing-review' userId={Number(session?.user.id)} />
        </Layout>
    )
}

export default CompletedAssessments;