import { type NextPage } from "next";
import Layout from "~/components/Layout/Layout";
import BrowseAssessmentForms from "~/components/Assessor/BrowseAssessmentForms";
import { useSession } from "next-auth/react";

const OversightAssessments: NextPage = () => {

    const { data: session } = useSession();

    return (
        <Layout active='oversight-assessments' session={session} requiredRoles={['OVERSIGHT_ASSESSOR']}>
            <BrowseAssessmentForms status='oversight' userId={Number(session?.user.id)} />
        </Layout>
    )
}

export default OversightAssessments;