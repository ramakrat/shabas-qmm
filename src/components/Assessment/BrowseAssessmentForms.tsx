import { useRouter } from "next/router";
import type { Engagement, POC, Assessment, Client, EngagementPOC } from "@prisma/client";
import { api } from "~/utils/api";
import BrowseTable from "../Common/BrowseTable";
import ExpandableBrowseTable, { type TableColumn } from "../Common/ExpandableBrowseTable";

interface Props {
    status: 'ongoing' | 'assessor-review' | 'oversight' | 'client-review' | 'completed';
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
        POC: POC[];
        EngagementPOC: (EngagementPOC & {
            poc: POC;
        })[];
        Assessment: (Assessment & {
            poc: POC | null;
        })[];
    }
)

const BrowseAssessmentForms: React.FC<Props> = (props) => {
    const { status } = props;
    const { push } = useRouter();

    // TODO: Don't run query unless modal closed
    let data = undefined;
    if (status == 'ongoing')
        data = api.engagement.getAllInclude.useQuery({ filters: [{ status: 'ongoing' }] }).data;
    if (status == 'assessor-review')
        data = api.engagement.getAllInclude.useQuery({ filters: [{ status: 'assessor-review' }] }).data;
    if (status == 'oversight')
        data = api.engagement.getAllInclude.useQuery({ filters: [{ status: 'oversight' }] }).data;
    if (status == 'completed')
        data = api.engagement.getAllInclude.useQuery({ filters: [{ status: 'completed' }] }).data;


    const handleOnClick = async (id: number) => {
        if (status == 'ongoing')
            await push(`/ongoing-assessments/${id}`);
        if (status == 'assessor-review')
            await push(`/review-assessments/${id}`);
        if (status == 'oversight')
            await push(`/oversight-assessments/${id}`);
        if (status == 'completed')
            await push(`/completed-assessments/${id}`);
    }

    const convertTableData = (data?: EngagementAssessmentType[]) => {
        if (data) {
            const newData: EngagementTableData[] = [];
            data.forEach(obj => {

                const convertAssessmentTableData = (data?: (Assessment & { poc: POC | null; })[]) => {
                    if (data) {
                        const newAssessmentData: AssessmentTableData[] = [];
                        data.forEach(d => {
                            newAssessmentData.push({
                                id: d.id,
                                site: d.site_id.toString(),
                                startDate: d.start_date,
                                endDate: d.end_date,
                                clientPoc: d.poc ? `${d.poc.first_name} ${d.poc.last_name}` : '',
                                assessors: '',
                                status: d.status,
                                onClick: () => handleOnClick(d.id),
                            })
                        })
                        return newAssessmentData;
                    }
                }

                const existingClientPoc = obj.EngagementPOC.find(o => o.poc.client_id);
                const existingShabasPoc = obj.EngagementPOC.find(o => !o.poc.client_id);

                newData.push({
                    id: obj.id,
                    client: `${obj.client_id} - ${obj.client.name}`,
                    startDate: obj.start_date,
                    endDate: obj.end_date,
                    clientPoc: existingClientPoc ? `${existingClientPoc.poc.first_name} ${existingClientPoc.poc.last_name}` : '',
                    shabasPoc: existingShabasPoc ? `${existingShabasPoc.poc.first_name} ${existingShabasPoc.poc.last_name}` : '',
                    status: obj.status,
                    child: obj.Assessment.length > 0 && <BrowseTable
                        dataList={convertAssessmentTableData(obj.Assessment) ?? []}
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
                <ExpandableBrowseTable
                    dataList={convertTableData(data) ?? []}
                    tableInfoColumns={engagementColumns}
                />
            }
        </div>
    )
};

export default BrowseAssessmentForms;