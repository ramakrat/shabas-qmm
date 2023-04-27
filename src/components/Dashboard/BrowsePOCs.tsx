import React from "react";
import type { Client, Engagement, POC, Site, User } from "@prisma/client";

import { Button, IconButton } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";

import { api } from "~/utils/api";
import POCModal from "./Modals/POCModal";
import BrowseTable, { type TableColumn } from "../Common/BrowseTable";

interface Props {
    pocModal: boolean;
    setPOCModal: (open: boolean) => void;
}

type PocType = (
    POC & {
        site: Site | null;
        engagement: Engagement | null;
        Client: Client | null;
        user: User | null;
    }
)

interface TableData {
    id: number;
    type: string;
    typeReference: string;
    name: string;
    title: React.ReactNode;
    workPhone: string;
    mobilePhone: string;
    email: string;
    actions: React.ReactNode;
}

const columns: TableColumn[] = [{
    type: 'id',
    displayValue: 'POC ID',
    align: 'center',
}, {
    type: 'type',
    displayValue: 'Type',
    align: 'center',
}, {
    type: 'typeReference',
    displayValue: 'Type Reference',
    align: 'center',
}, {
    type: 'name',
    displayValue: 'Name',
    align: 'center',
}, {
    type: 'title',
    displayValue: 'Title',
    align: 'center',
}, {
    type: 'workPhone',
    displayValue: 'Work Phone',
    align: 'center',
}, {
    type: 'mobilePhone',
    displayValue: 'Mobile Phone',
    align: 'center',
}, {
    type: 'email',
    displayValue: 'Email',
    align: 'center',
}, {
    type: 'actions',
    displayValue: 'Actions',
    align: 'center',
    format: 'jsx-element',
}];


const BrowsePOCs: React.FC<Props> = () => {

    // const { pocModal, setPOCModal } = props;
    const [pocModal, setPOCModal] = React.useState<boolean>(false);

    const [pocData, setPOCData] = React.useState<POC | undefined>(undefined);

    // TODO: Don't run query unless modal closed
    const pocs = api.poc.getAllInclude.useQuery(pocModal).data;

    const renderType = (object: PocType) => {
        if (object.client_id) {
            return 'Client';
        } else if (object.engagement_id) {
            return 'Engagement';
        } else if (object.site_id) {
            return 'Site';
        }
        return 'Shabas';
    }

    const renderTypeReference = (object: PocType) => {
        if (object.Client) {
            return object.Client.name;
        } else if (object.engagement) {
            return object.engagement.id.toString();
        } else if (object.site) {
            return object.site.name;
        } else if (object.user) {
            return object.user.first_name + ' ' + object.user.last_name;
        }
        return undefined;
    }

    const convertTableData = (data?: PocType[]) => {
        if (data) {
            const newData: TableData[] = [];
            data.forEach(obj => {
                const actions = (
                    <IconButton onClick={() => { setPOCData(obj); setPOCModal(true) }}>
                        <Edit fontSize='small' />
                    </IconButton>
                )
                newData.push({
                    id: obj.id,
                    type: renderType(obj),
                    typeReference: renderTypeReference(obj) ?? '',
                    name: `${obj.first_name} ${obj.last_name}`,
                    title: obj.title,
                    workPhone: obj.work_phone,
                    mobilePhone: obj.mobile_phone,
                    email: obj.email,
                    actions: actions,
                })
            })
            return newData;
        }
    }

    return (
        <>
            <div className='browse-add'>
                <Button
                    variant='contained'
                    endIcon={<Add />}
                    onClick={() => { setPOCData(undefined); setPOCModal(true) }}
                >
                    New POC
                </Button>
            </div>
            <BrowseTable
                dataList={convertTableData(pocs) ?? []}
                tableInfoColumns={columns}
            />
            <POCModal open={pocModal} setOpen={setPOCModal} data={pocData} />
        </>
    );
};

export default BrowsePOCs;