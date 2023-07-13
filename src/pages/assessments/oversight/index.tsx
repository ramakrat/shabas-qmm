import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "~/components/Layout/Layout";
import BrowseAssessmentForms from "~/components/Assessment/BrowseAssessmentForms";

const OversightAssessments: NextPage = () => {

    const { data: session } = useSession();

    return (
        <Layout active='oversight-assessments' session={session} requiredRoles={['OVERSIGHT_ASSESSOR']}>
            <BrowseAssessmentForms status='oversight' userId={Number(session?.user.id)} />
        </Layout>
    )
}

export default OversightAssessments;