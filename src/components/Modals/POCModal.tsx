import React from "react";
import type { POC } from "@prisma/client";
import { Button, Card, CardActions, CardContent, CardHeader, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";
import { api } from "~/utils/api";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    data?: POC;
}

const POCModal: React.FC<Props> = (props) => {

    const { open, setOpen, data } = props;

    // =========== Retrieve Form Context ===========

    const clients = api.client.getAll.useQuery(true).data;
    // const clients = api.client.getAll.useQuery(true).data;

    // =========== Input Field States ===========

    const [type, setType] = React.useState<string>('shabas');
    const [typeId, setTypeId] = React.useState<number>(1);

    const [firstName, setFirstName] = React.useState<string>('');
    const [lastName, setLastName] = React.useState<string>('');
    const [title, setTitle] = React.useState<string>('');
    const [mobilePhone, setMobilePhone] = React.useState<string>('');
    const [workPhone, setWorkPhone] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [staff, setStaff] = React.useState<string>('');


    // =========== Submission Management ===========

    const create = api.poc.create.useMutation();
    const update = api.poc.update.useMutation();

    React.useEffect(() => {
        if (data) {
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setTitle(data.title);
            setMobilePhone(data.mobile_phone);
            setWorkPhone(data.work_phone);
            setEmail(data.email);
            setStaff(data.staff);
        } else {
            setFirstName('');
            setLastName('');
            setTitle('');
            setMobilePhone('');
            setWorkPhone('');
            setEmail('');
            setStaff('US');
        }
    }, [data])

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (data) {
            update.mutate({
                id: data.id,
                first_name: firstName,
                last_name: lastName,
                title: title,
                mobile_phone: mobilePhone,
                work_phone: workPhone,
                email: email,
                staff: staff,
                client_id: type == 'client' ? typeId : undefined,
            }, {
                onSuccess() { setOpen(false) }
            })
        } else {
            create.mutate({
                first_name: firstName,
                last_name: lastName,
                title: title,
                mobile_phone: mobilePhone,
                work_phone: workPhone,
                email: email,
                staff: staff,
                client_id: type == 'client' ? typeId : undefined,
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
                        title={data ? 'Edit POC' : 'Create New POC'}
                        action={
                            <IconButton onClick={() => setOpen(false)}>
                                <Close />
                            </IconButton>
                        }
                    />
                    <CardContent>
                        <FormControl>
                            <InputLabel size="small">Type</InputLabel>
                            <Select
                                name='clientType' label='Type' size='small'
                                value={type}
                                onChange={e => setType(e.target.value)}
                            >
                                <MenuItem value='shabas'>
                                    Shabas
                                </MenuItem>
                                <MenuItem value='client'>
                                    Client
                                </MenuItem>
                            </Select>
                        </FormControl>
                        {type == 'client' &&
                            <FormControl>
                                <InputLabel size="small">Client</InputLabel>
                                <Select
                                    name='clientId' label='Client' size='small'
                                    value={typeId}
                                    onChange={e => setTypeId(Number(e.target.value))}
                                >
                                    {clients && clients.map(o => {
                                        return (
                                            <MenuItem value={o.id} key={o.id}>
                                                {o.id} - {o.name}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>}
                        <TextField
                            name='firstName' label='First Name' size='small'
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                        />
                        <TextField
                            name='lastName' label='Last Name' size='small'
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                        />
                        <TextField
                            name='title' label='Title' size='small'
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        <TextField
                            name='mobilePhone' label='Mobile Phone' size='small'
                            value={mobilePhone}
                            onChange={e => setMobilePhone(e.target.value)}
                        />
                        <TextField
                            name='workPhone' label='Work Phone' size='small'
                            value={workPhone}
                            onChange={e => setWorkPhone(e.target.value)}
                        />
                        <TextField
                            name='email' label='Email' size='small'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <TextField
                            name='staff' label='Staff' size='small'
                            value={staff}
                            onChange={e => setStaff(e.target.value)}
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

export default POCModal;