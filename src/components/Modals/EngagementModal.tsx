import React from "react";
import type { Engagement } from "@prisma/client";
import { Button, Card, CardActions, CardContent, CardHeader, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";
import { api } from "~/utils/api";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    data?: Engagement;
}

const EngagementModal: React.FC<Props> = (props) => {

    const { open, setOpen, data } = props;

    // =========== Retrieve Form Context ===========

    const clients = api.client.getAll.useQuery(true).data;

    // =========== Input Field States ===========

    const [description, setDescription] = React.useState<string>('');
    const [status, setStatus] = React.useState<string>('');
    const [startDate, setStartDate] = React.useState<Date>(new Date());
    const [endDate, setEndDate] = React.useState<Date>(new Date());
    const [clientId, setClientId] = React.useState<number>(1);

    // =========== Submission Management ===========

    const create = api.engagement.create.useMutation();
    const update = api.engagement.update.useMutation();

    React.useEffect(() => {
        if (data) {
            setStatus(data.status);
            setStartDate(data.start_date);
            setEndDate(data.end_date);
            setDescription(data.description);
            setClientId(data.client_id);
        }
    }, [data])

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (data) {
            update.mutate({
                id: data.id,
                status: status,
                start_date: startDate,
                end_date: endDate,
                description: description,
                client_id: clientId,
            }, {
                onSuccess() { setOpen(false) }
            })
        } else {
            create.mutate({
                status: status,
                start_date: startDate,
                end_date: endDate,
                description: description,
                client_id: clientId,
            }, {
                onSuccess() { setOpen(false) }
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
                            <InputLabel size="small">Engagement</InputLabel>
                            <Select
                                name='engagementId' label='Engagement' size='small'
                                value={clientId}
                                onChange={e => setClientId(Number(e.target.value))}
                            >
                                {clients && clients.map(o => {
                                    return (
                                        <MenuItem value={o.id} key={o.id}>
                                            {o.id} {o.first_name} {o.last_name}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        <TextField
                            name='status' label='Status' size='small'
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        />
                        <TextField
                            name='startDate' label='Start Date' size='small'
                            value={startDate}
                            onChange={e => setStartDate(new Date(e.target.value))}
                        />
                        <TextField
                            name='endDate' label='End Date' size='small'
                            value={endDate}
                            onChange={e => setEndDate(new Date(e.target.value))}
                        />
                        <TextField
                            name='description' label='Description' size='small'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
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