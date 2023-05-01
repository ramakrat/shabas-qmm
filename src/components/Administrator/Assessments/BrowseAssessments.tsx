import React from "react";
import type { Assessment, Client, Engagement, EngagementPoc, Poc } from "@prisma/client";

import { Button, Card, IconButton } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";

import { api } from "~/utils/api";
import ExpandableBrowseTable, { type TableColumn } from "../../Common/ExpandableBrowseTable";
import BrowseTable from "../../Common/BrowseTable";
import EngagementModal from "./EngagementModal";
import AssessmentModal from "./AssessmentModal";

interface Props {
    engagementModal: boolean;
    setEngagementModal: (open: boolean) => void;
    assessmentModal: boolean;
    setAssessmentModal: (open: boolean) => void;
}

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
        assessments: (Assessment & {
            poc: Poc | null;
        })[];
    }
)

const BrowseAssessments: React.FC<Props> = () => {

    // ================== Create Management ==================

    const [engagementModal, setEngagementModal] = React.useState<boolean>(false);
    const [assessmentModal, setAssessmentModal] = React.useState<boolean>(false);

    const [engagementData, setEngagementData] = React.useState<EngagementAssessmentType | undefined>(undefined);
    const [assessmentData, setAssessmentData] = React.useState<Assessment | undefined>(undefined);


    // ================== Filter Management ==================

    const [createdFilter, setCreatedFilter] = React.useState<boolean>(true);
    const [ongoingFilter, setOngoingFilter] = React.useState<boolean>(true);
    const [assessorReviewFilter, setAssessorReviewFilter] = React.useState<boolean>(true);
    const [oversightFilter, setOversightFilter] = React.useState<boolean>(true);
    const [clientReviewFilter, setClientReviewFilter] = React.useState<boolean>(true);
    const [completedFilter, setCompletedFilter] = React.useState<boolean>(true);

    const filterObject = () => {
        const filters = [];
        if (createdFilter) filters.push({ status: 'created' })
        if (ongoingFilter) filters.push({ status: 'ongoing' })
        if (assessorReviewFilter) filters.push({ status: 'assessor-review' })
        if (oversightFilter) filters.push({ status: 'oversight' })
        if (clientReviewFilter) filters.push({ status: 'client-review' })
        if (completedFilter) filters.push({ status: 'completed' })
        return filters;
    }


    // ================== Table Management ==================

    // TODO: Don't run query unless modal closed
    const { data } = api.engagement.getAllInclude.useQuery({
        filters: filterObject(),
        states: [engagementModal, assessmentModal],
        includeEmptyEngagements: true,
    });
    const assessmentStatusCounts = api.assessment.getStatusCounts.useQuery(assessmentModal).data;

    const convertTableData = (engagements?: EngagementAssessmentType[]) => {
        if (engagements) {
            const newData: EngagementTableData[] = [];

            engagements.forEach(engagement => {

                const convertAssessmentTableData = (assessments?: (Assessment & { poc: Poc | null; })[]) => {
                    if (assessments) {
                        const newAssessmentData: AssessmentTableData[] = [];

                        assessments.forEach(assessment => {
                            const actions = (
                                <IconButton onClick={() => { setAssessmentData(assessment); setAssessmentModal(true) }}>
                                    <Edit fontSize='small' />
                                </IconButton>
                            )
                            newAssessmentData.push({
                                id: assessment.id,
                                site: assessment.site_id.toString(),
                                startDate: assessment.start_date,
                                endDate: assessment.end_date,
                                clientPoc: assessment.poc ? `${assessment.poc.first_name} ${assessment.poc.last_name}` : '',
                                assessors: '',
                                status: assessment.status,
                                actions: assessment.status == 'created' ? actions : '',
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
        <>
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
                        <div className={'assessments-filter assessor-review ' + (assessorReviewFilter ? 'active' : '')} onClick={() => setAssessorReviewFilter(!assessorReviewFilter)}>
                            <span className='label'>Assessor Review</span>
                            <span className='count'>{assessmentStatusCounts.assessorReview}</span>
                        </div>
                        <div className={'assessments-filter oversight ' + (oversightFilter ? 'active' : '')} onClick={() => setOversightFilter(!oversightFilter)}>
                            <span className='label'>Oversight</span>
                            <span className='count'>{assessmentStatusCounts.oversight}</span>
                        </div>
                        <div className={'assessments-filter client-review ' + (clientReviewFilter ? 'active' : '')} onClick={() => setClientReviewFilter(!clientReviewFilter)}>
                            <span className='label'>Client Review</span>
                            <span className='count'>{assessmentStatusCounts.clientReview}</span>
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
                        onClick={() => { setAssessmentData(undefined); setAssessmentModal(true) }}
                    >
                        New Assessment
                    </Button>
                </div>
            </div>
            <ExpandableBrowseTable
                dataList={convertTableData(data) ?? []}
                tableInfoColumns={engagementColumns}
            />
            <EngagementModal open={engagementModal} setOpen={setEngagementModal} data={engagementData} />
            <AssessmentModal open={assessmentModal} setOpen={setAssessmentModal} data={assessmentData} />
        </>
    );
};

export default BrowseAssessments;