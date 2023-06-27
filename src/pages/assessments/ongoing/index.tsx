import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "~/components/Layout/Layout";
import BrowseAssessmentForms from "~/components/Assessment/BrowseAssessmentForms";

const OngoingAssessments: NextPage = () => {
    const { data: session } = useSession();

    return (
        <Layout active='ongoing-assessments' session={session} requiredRoles={['ASSESSOR', 'LEAD_ASSESSOR']}>
            <BrowseAssessmentForms status='ongoing' userId={Number(session?.user.id)} />
        </Layout>
    )
}

export default OngoingAssessments;