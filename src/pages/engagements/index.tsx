import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import type { Assessment, AssessmentUser, Client, Engagement, EngagementPoc, Poc, User } from "@prisma/client";

import { Button, Card, IconButton } from "@mui/material";
import { Add, Edit, Visibility } from "@mui/icons-material";

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import EngagementModal from "~/components/Modal/Objects/EngagementModal";
import BrowseTable, { TableColumn } from "~/components/Table/BrowseTable";

interface EngagementTableData {
    id: number;
    client: string;
    startDate: Date;
    endDate: Date;
    clientPoc: string;
    shabasPoc: string;
    status: string;
    actions: React.ReactNode;
    child: React.ReactNode;
}

const engagementColumns: TableColumn[] = [{
    type: 'id',
    displayValue: 'Engagement ID',
    align: 'center',
}, {
    type: 'client',
    displayValue: 'Client',
    align: 'left',
}, {
    type: 'startDate',
    displayValue: 'Start Date',
    align: 'left',
    format: 'date',
}, {
    type: 'endDate',
    displayValue: 'End Date',
    align: 'left',
    format: 'date',
}, {
    type: 'clientPoc',
    displayValue: 'Client POC',
    align: 'left',
}, {
    type: 'shabasPoc',
    displayValue: 'Shabas POC',
    align: 'left',
}, {
    type: 'status',
    displayValue: 'Status',
    align: 'center',
    format: 'status',
}, {
    type: 'actions',
    displayValue: 'Actions',
    align: 'center',
    format: 'jsx-element',
}];

interface AssessmentTableData {
    id: number;
    site: string;
    startDate: Date;
    endDate: Date;
    clientPoc: string;
    assessors: string;
    status: string;
    actions: React.ReactNode;
}

const assessmentColumns: TableColumn[] = [{
    type: 'id',
    displayValue: 'Assessment ID',
    align: 'center',
}, {
    type: 'site',
    displayValue: 'Site',
    align: 'left',
}, {
    type: 'startDate',
    displayValue: 'Start Date',
    align: 'left',
    format: 'date',
}, {
    type: 'endDate',
    displayValue: 'End Date',
    align: 'left',
    format: 'date',
}, {
    type: 'clientPoc',
    displayValue: 'Client POC',
    align: 'left',
}, {
    type: 'assessors',
    displayValue: 'Assessors',
    align: 'left',
}, {
    type: 'status',
    displayValue: 'Status',
    align: 'center',
    format: 'status',
}, {
    type: 'actions',
    displayValue: 'Actions',
    align: 'center',
    format: 'jsx-element',
}];

type EngagementAssessmentType = (
    Engagement & {
        client: Client;
        pocs: Poc[];
        engagement_pocs: (EngagementPoc & {
            poc: Poc;
        })[];
        assessments: AssessmentType[];
    }
)

type AssessmentType = (
    Assessment & {
        poc: Poc | null;
        assessment_users: (AssessmentUser & {
            user: User;
        })[];
    }
)

const BrowseAssessments: NextPage = () => {

    const { data: session } = useSession();

    const router = useRouter();

    // ================== Create Management ==================

    const [engagementModal, setEngagementModal] = React.useState<boolean>(false);

    const [engagementData, setEngagementData] = React.useState<EngagementAssessmentType | undefined>(undefined);


    // ================== Filter Management ==================

    const [createdFilter, setCreatedFilter] = React.useState<boolean>(true);
    const [ongoingFilter, setOngoingFilter] = React.useState<boolean>(true);
    const [ongoingReviewFilter, setOngoingReviewFilter] = React.useState<boolean>(true);
    const [oversightFilter, setOversightFilter] = React.useState<boolean>(true);
    const [oversightReviewFilter, setOversightReviewFilter] = React.useState<boolean>(true);
    const [completedFilter, setCompletedFilter] = React.useState<boolean>(true);

    const filterObject = () => {
        const filters = [];
        if (createdFilter) filters.push({ status: 'created' })
        if (ongoingFilter) filters.push({ status: 'ongoing' })
        if (ongoingReviewFilter) filters.push({ status: 'ongoing-review' })
        if (oversightFilter) filters.push({ status: 'oversight' })
        if (oversightReviewFilter) filters.push({ status: 'oversight-review' })
        // if () filters.push({ status: 'client' })
        // if () filters.push({ status: 'client-review' })
        if (completedFilter) filters.push({ status: 'completed' })
        return filters;
    }

    // ================== Table Management ==================

    // TODO: Don't run query unless modal closed
    const { data } = api.engagement.getAllInclude.useQuery({
        filters: filterObject(),
        states: engagementModal,
        includeEmptyEngagements: true,
    });
    const assessmentStatusCounts = api.assessment.getStatusCounts.useQuery().data;

    const convertTableData = (engagements?: EngagementAssessmentType[]) => {
        if (engagements) {
            const newData: EngagementTableData[] = [];

            engagements.forEach(engagement => {

                const convertAssessmentTableData = (assessments?: AssessmentType[]) => {
                    if (assessments) {
                        const newAssessmentData: AssessmentTableData[] = [];

                        assessments.forEach(assessment => {
                            let assessorList = '';
                            assessment.assessment_users.forEach(u => {
                                if (assessorList.length != 0) {
                                    assessorList = assessorList.concat(', ')
                                }
                                assessorList = assessorList.concat(u.user.first_name + ' ' + u.user.last_name)
                            })

                            const actions = assessment.status == 'created' ? (
                                <IconButton onClick={() => { router.push(`/engagements/assessment/${assessment.id}`) }}>
                                    <Edit fontSize='small' />
                                </IconButton>
                            ) : (
                                <IconButton onClick={() => { router.push(`/engagements/assessment/${assessment.id}`) }}>
                                    <Visibility fontSize='small' />
                                </IconButton>
                            )

                            newAssessmentData.push({
                                id: assessment.id,
                                site: assessment.site_id.toString(),
                                startDate: assessment.start_date,
                                endDate: assessment.end_date,
                                clientPoc: assessment.poc ? `${assessment.poc.first_name} ${assessment.poc.last_name}` : '',
                                assessors: assessorList,
                                status: assessment.status,
                                actions: actions,
                            })
                        })

                        return newAssessmentData;
                    }
                }

                const existingClientPoc = engagement.engagement_pocs.find(o => o.poc.client_id);
                const existingShabasPoc = engagement.engagement_pocs.find(o => !o.poc.client_id);
                const actions = (
                    <IconButton onClick={() => { setEngagementData(engagement); setEngagementModal(true) }}>
                        <Edit fontSize='small' />
                    </IconButton>
                )

                newData.push({
                    id: engagement.id,
                    client: `${engagement.client_id} - ${engagement.client.name}`,
                    startDate: engagement.start_date,
                    endDate: engagement.end_date,
                    clientPoc: existingClientPoc ? `${existingClientPoc.poc.first_name} ${existingClientPoc.poc.last_name}` : '',
                    shabasPoc: existingShabasPoc ? `${existingShabasPoc.poc.first_name} ${existingShabasPoc.poc.last_name}` : '',
                    status: engagement.status,
                    actions: actions,
                    child: engagement.assessments.length > 0 && <BrowseTable
                        dataList={convertAssessmentTableData(engagement.assessments) ?? []}
                        tableInfoColumns={assessmentColumns}
                    />
                })
            })
            return newData;
        }
    }

    return (
        <Layout active='assessments' session={session} requiredRoles={['ADMIN']}>
            <div className='dashboard'>
                <div className='browse-actions'>
                    {assessmentStatusCounts &&
                        <Card className='assessments-filters'>
                            <div className={'assessments-filter created ' + (createdFilter ? 'active' : '')} onClick={() => setCreatedFilter(!createdFilter)}>
                                <span className='label'>Created</span>
                                <span className='count'>{assessmentStatusCounts.created}</span>
                            </div>
                            <div className={'assessments-filter ongoing ' + (ongoingFilter ? 'active' : '')} onClick={() => setOngoingFilter(!ongoingFilter)}>
                                <span className='label'>Ongoing</span>
                                <span className='count'>{assessmentStatusCounts.ongoing}</span>
                            </div>
                            <div className={'assessments-filter ongoing-review ' + (ongoingReviewFilter ? 'active' : '')} onClick={() => setOngoingReviewFilter(!ongoingReviewFilter)}>
                                <span className='label'>Ongoing Review</span>
                                <span className='count'>{assessmentStatusCounts.ongoingReview}</span>
                            </div>
                            <div className={'assessments-filter oversight ' + (oversightFilter ? 'active' : '')} onClick={() => setOversightFilter(!oversightFilter)}>
                                <span className='label'>Oversight</span>
                                <span className='count'>{assessmentStatusCounts.oversight}</span>
                            </div>
                            <div className={'assessments-filter oversight-review ' + (oversightReviewFilter ? 'active' : '')} onClick={() => setOversightReviewFilter(!oversightReviewFilter)}>
                                <span className='label'>Oversight Review</span>
                                <span className='count'>{assessmentStatusCounts.oversightReview}</span>
                            </div>
                            <div className={'assessments-filter completed ' + (completedFilter ? 'active' : '')} onClick={() => setCompletedFilter(!completedFilter)}>
                                <span className='label'>Completed</span>
                                <span className='count'>{assessmentStatusCounts.completed}</span>
                            </div>
                        </Card>
                    }
                    <div className='browse-add'>
                        <Button
                            variant='contained'
                            endIcon={<Add />}
                            onClick={() => { setEngagementData(undefined); setEngagementModal(true) }}
                        >
                            New Engagement
                        </Button>
                        <Button
                            variant='contained'
                            endIcon={<Add />}
                            onClick={() => router.push('/engagements/assessment/new')}
                        >
                            New Assessment
                        </Button>
                    </div>
                </div>
                <BrowseTable
                    dataList={convertTableData(data) ?? []}
                    tableInfoColumns={engagementColumns}
                    expandable
                />
                {engagementModal &&
                    <EngagementModal open={engagementModal} setOpen={setEngagementModal} data={engagementData} />
                }
            </div>
        </Layout>
    );
};

export default BrowseAssessments;