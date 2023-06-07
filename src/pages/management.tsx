import React from "react";
import type { Client, Engagement, Poc, Site, User } from "@prisma/client";

import { Button, IconButton } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";

import { api } from "~/utils/api";
import { NextPage } from "next";
import PocModal from "~/components/Administrator/MainModals/PocModal";
import BrowseTable, { TableColumn } from "~/components/Common/BrowseTable";
import Layout from "~/components/Layout/Layout";
import { useSession } from "next-auth/react";
import AccessDenied from "~/components/Common/AccessDenied";


interface TableData {
    id: number;
    name: string;
    email: string;
    role: string;
    actions: React.ReactNode;
}

const columns: TableColumn[] = [{
    type: 'id',
    displayValue: 'User ID',
    align: 'center',
}, {
    type: 'name',
    displayValue: 'Name',
    align: 'left',
}, {
    type: 'email',
    displayValue: 'Email',
    align: 'left',
}, {
    type: 'role',
    displayValue: 'Role',
    align: 'left',
}, {
    type: 'actions',
    displayValue: 'Actions',
    align: 'center',
    format: 'jsx-element',
}];


const Management: NextPage = () => {

    const { data: session } = useSession();

    // ================== Create Management ==================

    const [userModal, setUserModal] = React.useState<boolean>(false);
    const [userData, setUserData] = React.useState<User | undefined>(undefined);

    if (session?.user && session.user.role == 'ADMIN') {

        // ================== Table Management ==================

        // TODO: Don't run query unless modal closed
        const users = api.user.getAll.useQuery(userModal).data;

        const convertTableData = (data?: User[]) => {
            if (data) {
                const newData: TableData[] = [];
                data.forEach(obj => {
                    const actions = (
                        <IconButton onClick={() => { setUserData(obj); setUserModal(true) }}>
                            <Edit fontSize='small' />
                        </IconButton>
                    )
                    newData.push({
                        id: obj.id,
                        name: `${obj.first_name} ${obj.last_name}`,
                        email: obj.email,
                        role: obj.email,
                        actions: actions,
                    })
                })
                return newData;
            }
        }

        return (
            <Layout admin>
                <div className='dashboard'>
                    <div className='browse-add'>
                        <Button
                            variant='contained'
                            endIcon={<Add />}
                            onClick={() => { setUserData(undefined); setUserModal(true) }}
                        >
                            New User
                        </Button>
                    </div>
                    <BrowseTable
                        dataList={convertTableData(users) ?? []}
                        tableInfoColumns={columns}
                    />
                    {/* <PocModal open={userModal} setOpen={setUserModal} data={userData} /> */}
                </div>
            </Layout>
        );
    } else {
        return (
            <AccessDenied />
        )
    }
};

export default Management;