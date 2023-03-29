import React from "react";
import { NextPage } from "next";
import { Button, Card, Typography, IconButton } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import SiteModal from "../Modals/SiteModal";

const siteList = [{
    id: 'Site ID',
    name: 'Site Name',
    address: '123456 Main Street, City, NY 123456',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
}, {
    id: 'Site ID',
    name: 'Site Name',
    address: '123456 Main Street, City, NY 123456',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
}, {
    id: 'Site ID',
    name: 'Site Name',
    address: '123456 Main Street, City, NY 123456',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
}, {
    id: 'Site ID',
    name: 'Site Name',
    address: '123456 Main Street, City, NY 123456',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
}]

const BrowseSites: NextPage = () => {
    const [siteData, setSiteData] = React.useState<any>(null);
    const [siteModal, setSiteModal] = React.useState<boolean>(false);

    return (
        <>
            <div>
                <Button variant='contained' endIcon={<Add />} onClick={() => { setSiteData(null); setSiteModal(true) }}>
                    New Site
                </Button>
                <div className='basic-rows'>
                    <Card className='data-row row-header'>
                        <Typography>Site ID</Typography>
                        <Typography>Name</Typography>
                        <Typography>Address</Typography>
                        <Typography>Description</Typography>
                        <Typography>Edit</Typography>
                    </Card>
                    {siteList.map((data, i) => {
                        return (
                            <Card className='data-row' key={i}>
                                <Typography>{data.id}</Typography>
                                <Typography>{data.name}</Typography>
                                <Typography>{data.address}</Typography>
                                <Typography>{data.description}</Typography>
                                <IconButton onClick={() => { setSiteData(1); setSiteModal(true) }}>
                                    <Edit fontSize='small' />
                                </IconButton>
                            </Card>
                        )
                    })}
                </div>
            </div>
            <SiteModal open={siteModal} setOpen={setSiteModal} data={siteData} />
        </>
    );
};

export default BrowseSites;