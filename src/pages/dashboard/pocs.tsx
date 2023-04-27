import * as React from 'react';
import { type NextPage } from "next";
import DashboardContainer from '~/components/Browse/DashboardContainer';

const AdminDashboard: NextPage = () => {
    return (
        <DashboardContainer tab='pocs' />
    );
};

export default AdminDashboard;