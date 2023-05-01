import * as React from 'react';
import { type NextPage } from "next";
import BrowsePocs from '~/components/Dashboard/Pocs/BrowsePocs';
import Layout from '~/components/Layout/Layout';

const Pocs: NextPage = () => {
    const [pocModal, setPOCModal] = React.useState<boolean>(false);

    return (
        <Layout active='pocs' admin>
            <div className='dashboard'>
                <BrowsePocs pocModal={pocModal} setPOCModal={setPOCModal} />
            </div>
        </Layout>
    );
};

export default Pocs;