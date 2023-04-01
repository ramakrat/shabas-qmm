import React from "react";
import type { Client, Site } from "@prisma/client";
import { Button, Card, CardActions, CardContent, CardHeader, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";
import { api } from "~/utils/api";
import { Countries } from "~/utils/utils";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    data?: Site;
}

const SiteModal: React.FC<Props> = (props) => {

    const { open, setOpen, data } = props;

    // =========== Retrieve Form Context ===========

    const clients = api.client.getAll.useQuery().data;

    // =========== Input Field States ===========

    const [name, setName] = React.useState<string>('');
    const [streetAddress, setStreetAddress] = React.useState<string>('');
    const [city, setCity] = React.useState<string>('');
    const [state, setState] = React.useState<string>('');
    const [zipCode, setZipCode] = React.useState<string>('');
    const [country, setCountry] = React.useState<string>('US');
    const [description, setDescription] = React.useState<string>('');
    const [clientId, setClientId] = React.useState<number>(1);

    // =========== Submission Management ===========

    const create = api.site.create.useMutation();
    const update = api.site.update.useMutation();

    React.useEffect(() => {
        if (data) {
            setName(data.name);
            setStreetAddress(data.street_address);
            setCity(data.city);
            setState(data.state);
            setZipCode(data.zip_code);
            setCountry(data.country);
            setDescription(data.description);
            setClientId(data.client_id);
        }
    }, [data])

    React.useEffect(() => {
        if (create.isSuccess || update.isSuccess == true)
            setOpen(false)
    }, [create, update, setOpen])

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (data) {
            update.mutate({
                id: data.id,
                name: name,
                street_address: streetAddress,
                city: city,
                state: state,
                country: country,
                zip_code: zipCode,
                description: description,
                client_id: clientId,
            })
        } else {
            create.mutate({
                name: name,
                street_address: streetAddress,
                city: city,
                state: state,
                country: country,
                zip_code: zipCode,
                description: description,
                client_id: clientId,
            })
        }
    }

    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal'>
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader
                        title={data ? 'Edit Site' : 'Create New Site'}
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
                                name='client' size='small' label='Client'
                                value={clientId}
                                onChange={e => setClientId(Number(e.target.value))}
                            >
                                {clients ? clients.map((client: Client) => {
                                    return (
                                        <MenuItem value={client.id} key={client.id}>
                                            {client.id} {client.first_name} {client.last_name}
                                        </MenuItem>
                                    )
                                }) : 'No Clients'}
                            </Select>
                        </FormControl>
                        <TextField
                            name='name' label='Name' size='small'
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <TextField
                            name='streetAddress' label='Street Address' size='small'
                            value={streetAddress}
                            onChange={e => setStreetAddress(e.target.value)}
                        />
                        <TextField
                            name='city' label='City' size='small'
                            value={city}
                            onChange={e => setCity(e.target.value)}
                        />
                        <TextField
                            name='state' label='State' size='small'
                            value={state}
                            onChange={e => setState(e.target.value)}
                        />
                        <TextField
                            name='zipCode' label='Zip Code' size='small'
                            value={zipCode}
                            onChange={e => setZipCode(e.target.value)}
                        />
                        <FormControl>
                            <InputLabel size="small">Country</InputLabel>
                            <Select
                                name='country' size='small' label='Country'
                                value={country}
                                onChange={e => setCountry(e.target.value)}
                            >
                                {Countries.map((country) => {
                                    return (
                                        <MenuItem value={country.code} key={country.code}>
                                            {country.name}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        <TextField
                            name='description' label='Description' size='small'
                            multiline minRows={3}
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

export default SiteModal;