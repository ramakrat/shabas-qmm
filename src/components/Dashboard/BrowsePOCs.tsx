import React from "react";
import type { Client, Engagement, POC, Site, User } from "@prisma/client";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { api } from "~/utils/api";
import POCModal from "./Modals/POCModal";

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
            return object.engagement.id;
        } else if (object.site) {
            return object.site.name;
        } else if (object.user) {
            return object.user.first_name + ' ' + object.user.last_name;
        }
        return undefined;
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
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">POC ID</TableCell>
                            <TableCell align="left">Type</TableCell>
                            <TableCell align="left">Type Reference</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Title</TableCell>
                            <TableCell align="left">Work Phone</TableCell>
                            <TableCell align="left">Mobile Phone</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="center">Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pocs && pocs.map((data, i) => {
                            return (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center">
                                        {data.id}
                                    </TableCell>
                                    <TableCell align="left">
                                        {renderType(data)}
                                    </TableCell>
                                    <TableCell align="left">
                                        {renderTypeReference(data)}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.first_name} {data.last_name}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.title}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.work_phone}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.mobile_phone}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.email}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => { setPOCData(data); setPOCModal(true) }}>
                                            <Edit fontSize='small' />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <POCModal open={pocModal} setOpen={setPOCModal} data={pocData} />
        </>
    );
};

export default BrowsePOCs;