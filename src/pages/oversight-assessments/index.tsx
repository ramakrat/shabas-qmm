import { type NextPage } from "next";
import Layout from "~/components/Layout/Layout";
import BrowseAssessmentForms from "~/components/Assessor/BrowseAssessmentForms";
import { useSession } from "next-auth/react";
import AccessDenied from "~/components/Common/AccessDenied";

const OversightAssessments: NextPage = () => {

    const { data: session } = useSession();

    if (session?.user && session.user.role == 'ADMIN') {
        return (
            <Layout active='oversight-assessments'>
                <BrowseAssessmentForms status='oversight' userId={Number(session.user.id)} />
            </Layout>
        )
    } else {
        return (
            <AccessDenied />
        )
    }
}

export default OversightAssessments;