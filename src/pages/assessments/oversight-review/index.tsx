import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "~/components/Layout/Layout";
import BrowseAssessmentForms from "~/components/Assessment/BrowseAssessmentForms";

const ReviewOversightAssessments: NextPage = () => {

    const { data: session } = useSession();

    return (
        <Layout active='review-oversight-assessments' session={session} requiredRoles={['LEAD_ASSESSOR']}>
            <BrowseAssessmentForms status='oversight-review' userId={Number(session?.user.id)} />
        </Layout>
    )
}

export default ReviewOversightAssessments;