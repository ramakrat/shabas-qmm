import React from "react";
import type { Client } from "@prisma/client";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { api } from "~/utils/api";
import ClientModal from "./Modals/ClientModal";

interface Props {
    clientModal: boolean;
    setClientModal: (open: boolean) => void;
}

const BrowseClients: React.FC<Props> = () => {

    // const { clientModal, setClientModal } = props;
    const [clientModal, setClientModal] = React.useState<boolean>(false);


    const [clientData, setClientData] = React.useState<Client | undefined>(undefined);

    // TODO: Don't run query unless modal closed
    const clients = api.client.getAll.useQuery(clientModal).data;

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
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Client ID</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Address</TableCell>
                            <TableCell align="left">Description</TableCell>
                            <TableCell align="center">Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients && clients.map((data, i) => {
                            return (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center">
                                        {data.id}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.name}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.street_address}<br />
                                        {data.city} {data.state}, {data.zip_code}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.description}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => { setClientData(data); setClientModal(true) }}>
                                            <Edit fontSize='small' />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <ClientModal open={clientModal} setOpen={setClientModal} data={clientData} />
        </>
    );
};

export default BrowseClients;