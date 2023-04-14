import React from "react";
import type { Client } from "@prisma/client";
import * as yup from "yup";
import { Field, Form, Formik, type FormikHelpers, type FormikProps } from "formik";
import { Button, Card, CardActions, CardContent, CardHeader, IconButton, MenuItem, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Countries } from "~/utils/utils";
import { api } from "~/utils/api";
import TextField from "../Form/TextField";
import Select from "../Form/Select";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    data?: Client;
}

interface FormValues {
    name: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    description: string;
}

const validationSchema = yup.object().shape({
    name: yup.string().required("Required"),
    streetAddress: yup.string().required("Required"),
    city: yup.string().required("Required"),
    state: yup.string().required("Required"),
    zipCode: yup.string().required("Required"),
    country: yup.string().required("Required"),
    description: yup.string(),
});

const ClientModal: React.FC<Props> = (props) => {

    const { open, setOpen, data } = props;

    // =========== Input Field States ===========

    const [client, setClient] = React.useState<FormValues>({
        name: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
        description: '',
    });

    // =========== Submission Management ===========

    const create = api.client.create.useMutation();
    const update = api.client.update.useMutation();

    React.useEffect(() => {
        if (data) {
            setClient({
                name: data.name,
                streetAddress: data.street_address,
                city: data.city,
                state: data.state,
                zipCode: data.zip_code,
                country: data.country,
                description: data.description,
            })
        } else {
            setClient({
                name: '',
                streetAddress: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'US',
                description: '',
            })
        }
    }, [data])

    const handleSubmit = (
        values: FormValues,
        formikHelpers: FormikHelpers<FormValues>
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
            }, {
                onSuccess() { setOpen(false) }
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
            }, {
                onSuccess() { setOpen(false) }
            })
        }
    }


    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal'>
            <div>
                <Formik
                    enableReinitialize
                    initialValues={client}
                    validationSchema={validationSchema}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={handleSubmit}
                >
                    {(formikProps: FormikProps<FormValues>) => (
                        <Form>
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
                    )}
                </Formik>
            </div>
        </Modal>
    )
}

export default ClientModal;