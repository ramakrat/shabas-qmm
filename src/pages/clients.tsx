import * as React from 'react';
import { type NextPage } from "next";
import BrowseClients from '~/components/Dashboard/Clients/BrowseClients';
import Layout from '~/components/Layout/Layout';

const ClientsSites: NextPage = () => {
    const [clientModal, setClientModal] = React.useState<boolean>(false);
    const [siteModal, setSiteModal] = React.useState<boolean>(false);

    return (
        <Layout active='clients' admin>
            <div className='dashboard'>
                <BrowseClients clientModal={clientModal} setClientModal={setClientModal} siteModal={siteModal} setSiteModal={setSiteModal} />
            </div>
        </Layout>
    );
};

export default ClientsSites;