import React from "react";
import { NextPage } from "next";
import { Button, Card, Typography, IconButton } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import ClientModal from "../Modals/ClientModal";

const clientList = [{
    id: 'Client ID',
    name: 'Client Name',
    address: '123456 Main Street, City, NY 123456',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
}]

const BrowseClients: NextPage = () => {
    const [clientData, setClientData] = React.useState<any>(null);
    const [clientModal, setClientModal] = React.useState<boolean>(false);

    return (
        <>
            <div>
                <Button variant='contained' endIcon={<Add />} onClick={() => { setClientData(null); setClientModal(true) }}>
                    New Client
                </Button>
                <div className='basic-rows'>
                    <Card className='data-row row-header'>
                        <Typography>Client ID</Typography>
                        <Typography>Name</Typography>
                        <Typography>Address</Typography>
                        <Typography>Description</Typography>
                        <Typography>Edit</Typography>
                    </Card>
                    {clientList.map((data, i) => {
                        return (
                            <Card className='data-row' key={i}>
                                <Typography>{data.id}</Typography>
                                <Typography>{data.name}</Typography>
                                <Typography>{data.address}</Typography>
                                <Typography>{data.description}</Typography>
                                <IconButton onClick={() => { setClientData(1); setClientModal(true) }}>
                                    <Edit fontSize='small' />
                                </IconButton>
                            </Card>
                        )
                    })}
                </div>
            </div>
            <ClientModal open={clientModal} setOpen={setClientModal} data={clientData} />
        </>
    );
};

export default BrowseClients;