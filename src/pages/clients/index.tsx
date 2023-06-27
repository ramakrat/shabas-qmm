import React from "react";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import type { Client, Site } from "@prisma/client";

import { Button, IconButton } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import ClientModal from "~/components/Modal/Objects/ClientModal";
import SiteModal from "~/components/Modal/Objects/SiteModal";
import BrowseTable, { TableColumn } from "~/components/Table/BrowseTable";

interface ClientTableData {
    id: number;
    name: string;
    address: React.ReactNode;
    description: string;
    actions: React.ReactNode;
    child: React.ReactNode;
}

const clientColumns: TableColumn[] = [{
    type: 'id',
    displayValue: 'Client ID',
    align: 'center',
}, {
    type: 'name',
    displayValue: 'Name',
    align: 'left',
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

interface SiteTableData {
    id: number;
    name: string;
    address: React.ReactNode;
    description: string;
    actions: React.ReactNode;
}

const siteColumns: TableColumn[] = [{
    type: 'id',
    displayValue: 'Site ID',
    align: 'center',
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

type ClientSiteType = (
    Client & {
        sites: Site[];
    }
)

const BrowseClients: NextPage = () => {

    const { data: session } = useSession();

    // ================== Create Management ==================

    const [clientModal, setClientModal] = React.useState<boolean>(false);
    const [clientData, setClientData] = React.useState<Client | undefined>(undefined);

    const [siteModal, setSiteModal] = React.useState<boolean>(false);
    const [siteData, setSiteData] = React.useState<Site | undefined>(undefined);


    // ================== Table Management ==================

    // TODO: Don't run query unless modal closed
    const data = api.client.getAllInclude.useQuery(clientModal).data;

    const convertTableData = (clients?: ClientSiteType[]) => {
        if (clients) {
            const newData: ClientTableData[] = [];

            clients.forEach(client => {

                const address = (address: any) => (
                    <div>
                        {address.street_address}<br />
                        {address.city} {address.state}, {address.zip_code}
                    </div>
                )

                const convertSiteTableData = (sites: Site[], parentClient: Client) => {
                    if (sites) {
                        const newData: SiteTableData[] = [];

                        sites.forEach(site => {
                            const actions = (
                                <IconButton onClick={() => { setSiteData(site); setSiteModal(true) }}>
                                    <Edit fontSize='small' />
                                </IconButton>
                            )
                            newData.push({
                                id: site.id,
                                name: site.name,
                                address: address(site),
                                description: site.description,
                                actions: actions,
                            })
                        })

                        return newData;
                    }
                }

                const actions = (
                    <IconButton onClick={() => { setClientData(client); setClientModal(true) }}>
                        <Edit fontSize='small' />
                    </IconButton>
                )

                newData.push({
                    id: client.id,
                    name: client.name,
                    address: address(client),
                    description: client.description,
                    actions: actions,
                    child: client.sites.length > 0 && <BrowseTable
                        dataList={convertSiteTableData(client.sites, client) ?? []}
                        tableInfoColumns={siteColumns}
                    />
                })
            })
            return newData;
        }
    }

    return (
        <Layout active='clients' session={session} requiredRoles={['ADMIN']}>
            <div className='dashboard'>
                <div className='browse-add'>
                    <Button
                        variant='contained'
                        endIcon={<Add />}
                        onClick={() => { setClientData(undefined); setClientModal(true) }}
                    >
                        New Client
                    </Button>
                    <Button
                        variant='contained'
                        endIcon={<Add />}
                        onClick={() => { setSiteData(undefined); setSiteModal(true) }}
                    >
                        New Site
                    </Button>
                </div>
                <BrowseTable
                    dataList={convertTableData(data) ?? []}
                    tableInfoColumns={clientColumns}
                    expandable
                />
                <ClientModal open={clientModal} setOpen={setClientModal} data={clientData} />
                <SiteModal open={siteModal} setOpen={setSiteModal} data={siteData} />
            </div>
        </Layout>
    );
};

export default BrowseClients;