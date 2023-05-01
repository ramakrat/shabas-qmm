import React from "react";
import type { Client, Engagement, Poc, Site, User } from "@prisma/client";

import { Button, IconButton } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";

import { api } from "~/utils/api";
import { NextPage } from "next";
import PocModal from "~/components/Administrator/Pocs/PocModal";
import BrowseTable, { TableColumn } from "~/components/Common/BrowseTable";
import Layout from "~/components/Layout/Layout";

type PocType = (
    Poc & {
        site: Site | null;
        engagement: Engagement | null;
        client: Client | null;
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


const BrowsePocs: NextPage = () => {

    // ================== Create Management ==================

    const [pocModal, setPOCModal] = React.useState<boolean>(false);
    const [pocData, setPOCData] = React.useState<Poc | undefined>(undefined);

    // ================== Table Management ==================

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
        if (object.client) {
            return object.client.name;
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
        <Layout active='pocs' admin>
            <div className='dashboard'>
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
                <PocModal open={pocModal} setOpen={setPOCModal} data={pocData} />
            </div>
        </Layout>
    );
};

export default BrowsePocs;