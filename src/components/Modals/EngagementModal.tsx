import React from "react";
import type { Assessment, Client, Engagement, EngagementPOC, POC } from "@prisma/client";
import { Button, Card, CardActions, CardContent, CardHeader, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";
import { api } from "~/utils/api";
import { dateInputFormat } from "~/utils/utils";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    data?: Engagement & {
        client: Client;
        POC: POC[];
        EngagementPOC: (EngagementPOC & {
            poc: POC;
        })[];
        Assessment: (Assessment & {
            poc: POC | null;
        })[];
    };
}

const EngagementModal: React.FC<Props> = (props) => {

    const { open, setOpen, data } = props;

    // =========== Retrieve Form Context ===========

    const clients = api.client.getAll.useQuery(true).data;
    const pocs = api.poc.getAll.useQuery(true).data;

    // =========== Input Field States ===========

    const [description, setDescription] = React.useState<string>('');
    const [startDate, setStartDate] = React.useState<Date>(new Date());
    const [endDate, setEndDate] = React.useState<Date>(new Date());
    const [clientId, setClientId] = React.useState<number>(1);
    const [clientPOCId, setClientPOCId] = React.useState<number>(-1);
    const [shabasPOCId, setShabasPOCId] = React.useState<number>(-1);

    // =========== Submission Management ===========

    const create = api.engagement.create.useMutation();
    const update = api.engagement.update.useMutation();

    const createPoc = api.engagementPoc.create.useMutation();
    const updatePoc = api.engagementPoc.update.useMutation();

    React.useEffect(() => {
        if (data) {
            setStartDate(data.start_date);
            setEndDate(data.end_date);
            setDescription(data.description);
            setClientId(data.client_id);

            const existingClientPoc = data.EngagementPOC.find(o => o.poc.client_id);
            if (existingClientPoc) setClientPOCId(existingClientPoc.id);
            const existingShabasPoc = data.EngagementPOC.find(o => !o.poc.client_id);
            if (existingShabasPoc) setShabasPOCId(existingShabasPoc.id);
        } else {
            setStartDate(new Date());
            setEndDate(new Date());
            setDescription('');
            setClientId(1);
            setClientPOCId(-1);
            setShabasPOCId(-1);
        }
    }, [data])

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (data) {
            update.mutate({
                id: data.id,
                start_date: startDate,
                end_date: endDate,
                description: description,
                client_id: clientId,
            }, {
                onSuccess(created) {
                    const existingClientPoc = data.EngagementPOC.find(o => o.poc.client_id);
                    if (existingClientPoc) {
                        updatePoc.mutate({
                            id: existingClientPoc.id,
                            engagement_id: created.id,
                            poc_id: clientPOCId
                        })
                    } else {
                        createPoc.mutate({
                            engagement_id: created.id,
                            poc_id: clientPOCId
                        })
                    }

                    const existingShabasPoc = data.EngagementPOC.find(o => !o.poc.client_id);
                    if (existingShabasPoc) {
                        existingShabasPoc && updatePoc.mutate({
                            id: existingShabasPoc.id,
                            engagement_id: created.id,
                            poc_id: shabasPOCId
                        })
                    } else {
                        createPoc.mutate({
                            engagement_id: created.id,
                            poc_id: shabasPOCId
                        })
                    }

                    setOpen(false)
                }
            })
        } else {
            create.mutate({
                start_date: startDate,
                end_date: endDate,
                description: description,
                client_id: clientId,
            }, {
                onSuccess(created) {
                    createPoc.mutate({
                        engagement_id: created.id,
                        poc_id: clientPOCId
                    })
                    createPoc.mutate({
                        engagement_id: created.id,
                        poc_id: shabasPOCId
                    })
                    setOpen(false)
                }
            })
        }
    }

    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal'>
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader
                        title={data ? 'Edit Engagement' : 'Create New Engagement'}
                        action={
                            <IconButton onClick={() => setOpen(false)}>
                                <Close />
                            </IconButton>
                        }
                    />
                    <CardContent>
                        <FormControl>
                            <InputLabel size="small">Client</InputLabel>
                            <Select
                                name='clientId' label='Client' size='small'
                                value={clientId}
                                onChange={e => setClientId(Number(e.target.value))}
                            >
                                {clients && clients.map(o => {
                                    return (
                                        <MenuItem value={o.id} key={o.id}>
                                            {o.id} - {o.first_name} {o.last_name}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        <TextField
                            name='startDate' label='Start Date' size='small' type='date'
                            value={dateInputFormat(startDate)}
                            onChange={e => setStartDate(new Date(e.target.value))}
                        />
                        <TextField
                            name='endDate' label='End Date' size='small' type='date'
                            value={dateInputFormat(endDate)}
                            onChange={e => setEndDate(new Date(e.target.value))}
                        />
                        <TextField
                            name='description' label='Description' size='small'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                        <FormControl>
                            <InputLabel size="small">Client POC</InputLabel>
                            <Select
                                name='clientPOC' label='Client POC' size='small'
                                value={clientPOCId}
                                onChange={e => setClientPOCId(Number(e.target.value))}
                            >
                                {pocs && pocs.map(o => {
                                    if (o.client_id)
                                        return (
                                            <MenuItem value={o.id} key={o.id}>
                                                {o.first_name} {o.last_name} - {o.title}
                                            </MenuItem>
                                        )
                                    return undefined;
                                })}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel size="small">Shabas POC</InputLabel>
                            <Select
                                name='shabasPOC' label='Shabas POC' size='small'
                                value={shabasPOCId}
                                onChange={e => setShabasPOCId(Number(e.target.value))}
                            >
                                {pocs && pocs.map(o => {
                                    if (!o.client_id)
                                        return (
                                            <MenuItem value={o.id} key={o.id}>
                                                {o.first_name} {o.last_name} - {o.title}
                                            </MenuItem>
                                        )
                                    return undefined;
                                })}
                            </Select>
                        </FormControl>
                    </CardContent>
                    <CardActions>
                        <Button variant='contained' color='error' onClick={() => setOpen(false)}>Cancel</Button>
                        {data ?
                            <Button variant='contained' type='submit'>Save</Button> :
                            <Button variant='contained' type='submit'>Create</Button>
                        }
                    </CardActions>
                </Card>
            </form>
        </Modal>
    )
}

export default EngagementModal;