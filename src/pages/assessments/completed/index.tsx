import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "~/components/Layout/Layout";
import BrowseAssessmentForms from "~/components/Assessment/BrowseAssessmentForms";

const CompletedAssessments: NextPage = () => {

    const { data: session } = useSession();

    return (
        <Layout active='completed-assessments' session={session} requiredRoles={['ADMIN']}>
            <BrowseAssessmentForms status='completed' />
        </Layout>
    )
}

export default CompletedAssessments;