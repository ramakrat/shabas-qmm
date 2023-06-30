import { useRouter } from "next/router";
import type { Engagement, Poc, Assessment, Client, EngagementPoc, AssessmentUser, User } from "@prisma/client";
import { api } from "~/utils/api";
import BrowseTable, { type TableColumn } from "../Table/BrowseTable";
import { AssessmentStatus } from "../Table/StatusChip";

interface Props {
    status: AssessmentStatus;
    userId?: number;
}

interface EngagementTableData {
    id: number;
    client: string;
    startDate: Date;
    endDate: Date;
    clientPoc: string;
    shabasPoc: string;
    status: string;
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
}];

interface AssessmentTableData {
    id: number;
    site: string;
    startDate: Date;
    endDate: Date;
    clientPoc: string;
    assessors: string;
    status: string;
    onClick: any;
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
    type: 'onClick',
    displayValue: '',
}];

type EngagementAssessmentType = (
    Engagement & {
        client: Client;
        pocs: Poc[];
        assessments: AssessmentType[];
        engagement_pocs: (EngagementPoc & {
            poc: Poc | null;
        })[];
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

const BrowseAssessmentForms: React.FC<Props> = (props) => {
    const { status, userId } = props;
    const { push } = useRouter();

    // TODO: Don't run query unless modal closed
    let data = api.engagement.getUserAssessments.useQuery({ userId: userId, status: status }).data;

    const handleOnClick = async (id: number) => {
        if (status == 'ongoing')
            await push(`/assessments/ongoing/${id}`);
        if (status == 'ongoing-review')
            await push(`/assessments/ongoing-review/${id}`);
        if (status == 'oversight')
            await push(`/assessments/oversight/${id}`);
        if (status == 'oversight-review')
            await push(`/assessments/oversight-review/${id}`);
        if (status == 'completed')
            await push(`/assessments/completed/${id}`);
    }

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
                            newAssessmentData.push({
                                id: assessment.id,
                                site: assessment.site_id.toString(),
                                startDate: assessment.start_date,
                                endDate: assessment.end_date,
                                clientPoc: assessment.poc ? `${assessment.poc.first_name} ${assessment.poc.last_name}` : '',
                                assessors: assessorList,
                                status: assessment.status,
                                onClick: () => handleOnClick(assessment.id),
                            })
                        })
                        return newAssessmentData;
                    }
                }

                const existingClientPoc = engagement.engagement_pocs.find(o => o.poc?.client_id);
                const existingShabasPoc = engagement.engagement_pocs.find(o => !o.poc?.client_id);

                newData.push({
                    id: engagement.id,
                    client: `${engagement.client_id} - ${engagement.client.name}`,
                    startDate: engagement.start_date,
                    endDate: engagement.end_date,
                    clientPoc: existingClientPoc ? `${existingClientPoc.poc?.first_name} ${existingClientPoc.poc?.last_name}` : '',
                    shabasPoc: existingShabasPoc ? `${existingShabasPoc.poc?.first_name} ${existingShabasPoc.poc?.last_name}` : '',
                    status: engagement.status,
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
        <div className='dashboard'>
            {data &&
                <BrowseTable
                    dataList={convertTableData(data) ?? []}
                    tableInfoColumns={engagementColumns}
                    expandable
                />
            }
        </div>
    )
};

export default BrowseAssessmentForms;