import React from "react";
import type { Client, Site } from "@prisma/client";

import * as yup from "yup";
import { Field, Form, Formik } from "formik";
import TextField from "../../Form/TextField";
import Select from "../../Form/Select";

import { Button, Card, CardActions, CardContent, CardHeader, IconButton, MenuItem, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
import { api } from "~/utils/api";
import { Countries } from "~/utils/utils";
import { useRouter } from "next/router";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    data?: Site;
}

interface FormValues {
    name: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    description: string;
    clientId: string;
}

const validationSchema = yup.object().shape({
    name: yup.string().required("Required"),
    streetAddress: yup.string().required("Required"),
    city: yup.string().required("Required"),
    state: yup.string().required("Required"),
    zipCode: yup.string().required("Required"),
    country: yup.string().required("Required"),
    description: yup.string(),
    clientId: yup.string().required("Required"),
});

const SiteModal: React.FC<Props> = (props) => {

    const { open, setOpen, data } = props;

    // =========== Retrieve Form Context ===========

    const clients = api.client.getAll.useQuery(true).data;

    // =========== Input Field States ===========

    const [site, setSite] = React.useState<FormValues>({
        name: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        description: '',
        clientId: '',
    });

    // =========== Submission Management ===========

    const create = api.site.create.useMutation();
    const update = api.site.update.useMutation();

    React.useEffect(() => {
        if (data) {
            setSite({
                name: data.name,
                streetAddress: data.street_address,
                city: data.city,
                state: data.state,
                zipCode: data.zip_code,
                country: data.country,
                description: data.description,
                clientId: data.client_id.toString(),
            })
        } else {
            setSite({
                name: '',
                streetAddress: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
                description: '',
                clientId: '',
            })
        }
    }, [data])

    const { reload } = useRouter();
    const handleSubmit = (
        values: FormValues,
    ) => {
        if (data) {
            update.mutate({
                id: data.id,
                name: values.name,
                street_address: values.streetAddress,
                city: values.city,
                state: values.state,
                country: values.country,
                zip_code: values.zipCode,
                description: values.description,
                client_id: Number(values.clientId),
            }, {
                onSuccess() {
                    setOpen(false);
                    reload();
                }
            })
        } else {
            create.mutate({
                name: values.name,
                street_address: values.streetAddress,
                city: values.city,
                state: values.state,
                country: values.country,
                zip_code: values.zipCode,
                description: values.description,
                client_id: Number(values.clientId),
            }, {
                onSuccess() {
                    setOpen(false);
                    reload();
                }
            })
        }
    }

    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal'>
            <div>
                <Formik
                    enableReinitialize
                    initialValues={site}
                    validationSchema={validationSchema}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={handleSubmit}
                >
                    <Form>
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
                                <Field
                                    name='clientId' label='Client' size='small'
                                    component={Select}
                                >
                                    <MenuItem value=''><em>Select a client...</em></MenuItem>
                                    {clients ? clients.map((client: Client) => {
                                        return (
                                            <MenuItem value={client.id} key={client.id}>
                                                {client.id} - {client.name}
                                            </MenuItem>
                                        )
                                    }) : 'No Clients'}
                                </Field>
                                <Field
                                    name='name' label='Name' size='small'
                                    component={TextField}
                                />
                                <Field
                                    name='streetAddress' label='Street Address' size='small'
                                    component={TextField}
                                />
                                <Field
                                    name='city' label='City' size='small'
                                    component={TextField}
                                />
                                <Field
                                    name='state' label='State' size='small'
                                    component={TextField}
                                />
                                <Field
                                    name='zipCode' label='Zip Code' size='small'
                                    component={TextField}
                                />
                                <Field
                                    name='country' label='Country' size='small'
                                    component={Select}
                                >
                                    <MenuItem value=''><em>Select a country...</em></MenuItem>
                                    {Countries.map((country) => {
                                        return (
                                            <MenuItem value={country.code} key={country.code}>
                                                {country.name}
                                            </MenuItem>
                                        )
                                    })}
                                </Field>
                                <Field
                                    name='description' label='Description' size='small'
                                    multiline minRows={2}
                                    component={TextField}
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
                    </Form>
                </Formik>
            </div>
        </Modal>
    )
}

export default SiteModal;