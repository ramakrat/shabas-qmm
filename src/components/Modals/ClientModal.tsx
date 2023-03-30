import React from "react";
import { Button, Card, CardActions, CardContent, CardHeader, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Countries } from "~/utils/utils";
import { api } from "~/utils/api";
import { Client } from "@prisma/client";

interface Props {
    open: boolean;
    setOpen: any;
    data?: Client;
}

const ClientModal: React.FC<Props> = (props) => {

    const { open, setOpen, data } = props;

    // =========== Input Field States ===========

    const [firstName, setFirstName] = React.useState<string>('');
    const [lastName, setLastName] = React.useState<string>('');
    const [streetAddress, setStreetAddress] = React.useState<string>('');
    const [city, setCity] = React.useState<string>('');
    const [state, setState] = React.useState<string>('');
    const [zipCode, setZipCode] = React.useState<string>('');
    const [country, setCountry] = React.useState<string>('US');
    const [description, setDescription] = React.useState<string>('');


    // =========== Submission Management ===========

    const create = api.client.create.useMutation();
    const update = api.client.update.useMutation();

    React.useEffect(() => {
        if (data) {
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setStreetAddress(data.street_address);
            setCity(data.city);
            setState(data.state);
            setZipCode(data.zip_code);
            setCountry(data.country);
            setDescription(data.description);
        }
    }, [data])

    // React.useEffect(() => {
    //     if (create.isSuccess == true || update.isSuccess == true)
    //         setOpen(false)
    // }, [create, update])

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (data) {
            update.mutate({
                id: data.id,
                first_name: firstName,
                last_name: lastName,
                street_address: streetAddress,
                city: city,
                state: state,
                country: country,
                zip_code: zipCode,
                description: description,
            })
        } else {
            create.mutate({
                first_name: firstName,
                last_name: lastName,
                street_address: streetAddress,
                city: city,
                state: state,
                country: country,
                zip_code: zipCode,
                description: description,
            })
        }
        if (create.isSuccess || update.isSuccess)
            setOpen(false)
    }


    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal'>
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader
                        title={data ? 'Edit Client' : 'Create New Client'}
                        action={
                            <IconButton onClick={() => setOpen(false)}>
                                <Close />
                            </IconButton>
                        }
                    />
                    <CardContent>
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

export default ClientModal;