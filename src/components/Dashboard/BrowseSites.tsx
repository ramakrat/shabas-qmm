import React from "react";
import type { Client, Site } from "@prisma/client";

import { Button, IconButton } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";

import { api } from "~/utils/api";
import SiteModal from "./Modals/SiteModal";
import BrowseTable, { type TableColumn } from "../Common/BrowseTable";

interface Props {
    siteModal: boolean;
    setSiteModal: (open: boolean) => void;
}

interface TableData {
    id: number;
    client: string;
    name: string;
    address: React.ReactNode;
    description: string;
    actions: React.ReactNode;
}

const columns: TableColumn[] = [{
    type: 'id',
    displayValue: 'Site ID',
    align: 'center',
}, {
    type: 'client',
    displayValue: 'Client',
    align: 'left',
}, {
    type: 'name',
    displayValue: 'Name',
    align: 'center',
}, {
    type: 'address',
    displayValue: 'Address',
    align: 'left',
    format: 'jsx-element',
}, {
    type: 'description',
    displayValue: 'Description',
    align: 'left',
}, {
    type: 'actions',
    displayValue: 'Actions',
    align: 'center',
    format: 'jsx-element',
}];

const BrowseSites: React.FC<Props> = () => {

    // const { siteModal, setSiteModal } = props;
    const [siteModal, setSiteModal] = React.useState<boolean>(false);

    const [siteData, setSiteData] = React.useState<Site | undefined>(undefined);

    // TODO: Don't run query unless modal closed
    const sites = api.site.getAll.useQuery(siteModal).data;

    const convertTableData = (data?: (Site & { client: Client })[]) => {
        if (data) {
            const newData: TableData[] = [];
            data.forEach(obj => {
                const address = (
                    <div>
                        {obj.street_address}<br />
                        {obj.city} {obj.state}, {obj.zip_code}
                    </div>
                )
                const actions = (
                    <IconButton onClick={() => { setSiteData(obj); setSiteModal(true) }}>
                        <Edit fontSize='small' />
                    </IconButton>
                )
                newData.push({
                    id: obj.id,
                    client: `${obj.client_id} - ${obj.client.name}`,
                    name: obj.name,
                    address: address,
                    description: obj.description,
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
                    onClick={() => { setSiteData(undefined); setSiteModal(true) }}
                >
                    New Site
                </Button>
            </div>
            <BrowseTable
                dataList={convertTableData(sites) ?? []}
                tableInfoColumns={columns}
            />
            <SiteModal open={siteModal} setOpen={setSiteModal} data={siteData} />
        </>
    );
};

export default BrowseSites;