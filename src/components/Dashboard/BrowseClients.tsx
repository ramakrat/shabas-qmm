import React from "react";
import type { Client } from "@prisma/client";

import { Button, IconButton } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";

import { api } from "~/utils/api";
import ClientModal from "./Modals/ClientModal";
import BrowseTable, { type TableColumn } from "../Common/BrowseTable";

interface Props {
    clientModal: boolean;
    setClientModal: (open: boolean) => void;
}

interface TableData {
    id: number;
    name: string;
    address: React.ReactNode;
    description: string;
    actions: React.ReactNode;
}

const columns: TableColumn[] = [{
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

const BrowseClients: React.FC<Props> = () => {

    // const { clientModal, setClientModal } = props;
    const [clientModal, setClientModal] = React.useState<boolean>(false);


    const [clientData, setClientData] = React.useState<Client | undefined>(undefined);

    // TODO: Don't run query unless modal closed
    const clients = api.client.getAll.useQuery(clientModal).data;

    const convertTableData = (data?: Client[]) => {
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
                    <IconButton onClick={() => { setClientData(obj); setClientModal(true) }}>
                        <Edit fontSize='small' />
                    </IconButton>
                )
                newData.push({
                    id: obj.id,
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
                    onClick={() => { setClientData(undefined); setClientModal(true) }}
                >
                    New Client
                </Button>
            </div>
            <BrowseTable
                dataList={convertTableData(clients) ?? []}
                tableInfoColumns={columns}
            />
            <ClientModal open={clientModal} setOpen={setClientModal} data={clientData} />
        </>
    );
};

export default BrowseClients;