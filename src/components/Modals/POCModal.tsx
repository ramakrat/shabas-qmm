import React from "react";
import type { Client, POC } from "@prisma/client";

import * as yup from "yup";
import { Field, Form, Formik, FormikProps, type FormikHelpers } from "formik";
import TextField from "../Form/TextField";
import Select from "../Form/Select";

import { Button, Card, CardActions, CardContent, CardHeader, FormControl, IconButton, InputLabel, MenuItem, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
import { api } from "~/utils/api";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    data?: POC;
}

interface FormValues {
    firstName: string;
    lastName: string;
    title: string;
    mobilePhone: string;
    workPhone: string;
    email: string;
    staff: string;
    type?: string;
    typeId?: string;
}

const validationSchema = yup.object().shape({
    firstName: yup.string().required("Required"),
    lastName: yup.string().required("Required"),
    title: yup.string().required("Required"),
    mobilePhone: yup.string().required("Required"),
    workPhone: yup.string().required("Required"),
    email: yup.string().required("Required"),
    staff: yup.string().required("Required"),
    type: yup.string().required("Required"),
    typeId: yup.string(),
});

const POCModal: React.FC<Props> = (props) => {

    const { open, setOpen, data } = props;

    // =========== Retrieve Form Context ===========

    const clients = api.client.getAll.useQuery(true).data;

    // =========== Input Field States ===========

    const [poc, setPoc] = React.useState<FormValues>({
        firstName: '',
        lastName: '',
        title: '',
        mobilePhone: '',
        workPhone: '',
        email: '',
        staff: '',
        type: 'shabas',
        typeId: '',
    });

    // =========== Submission Management ===========

    const create = api.poc.create.useMutation();
    const update = api.poc.update.useMutation();

    React.useEffect(() => {
        if (data) {
            setPoc({
                firstName: data.first_name,
                lastName: data.last_name,
                title: data.title,
                mobilePhone: data.mobile_phone,
                workPhone: data.work_phone,
                email: data.email,
                staff: data.staff,
                type: data.client_id ? 'client' : 'shabas',
                typeId: data.client_id ? data.client_id.toString() : '',
            })
        } else {
            setPoc({
                firstName: '',
                lastName: '',
                title: '',
                mobilePhone: '',
                workPhone: '',
                email: '',
                staff: '',
                type: 'shabas',
                typeId: '',
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
                first_name: values.firstName,
                last_name: values.lastName,
                title: values.title,
                mobile_phone: values.mobilePhone,
                work_phone: values.workPhone,
                email: values.email,
                staff: values.staff,
                client_id: values.type == 'client' ? Number(values.typeId) : undefined,
            }, {
                onSuccess() { setOpen(false) }
            })
        } else {
            create.mutate({
                first_name: values.firstName,
                last_name: values.lastName,
                title: values.title,
                mobile_phone: values.mobilePhone,
                work_phone: values.workPhone,
                email: values.email,
                staff: values.staff,
                client_id: values.type == 'client' ? Number(values.typeId) : undefined,
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
                    initialValues={poc}
                    validationSchema={validationSchema}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={handleSubmit}
                >
                    {(formikProps: FormikProps<FormValues>) => (
                        <Form>
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
                                    <Field
                                        name='type' label='Type' size='small'
                                        component={Select}
                                    >
                                        <MenuItem value='shabas'>
                                            Shabas
                                        </MenuItem>
                                        <MenuItem value='client'>
                                            Client
                                        </MenuItem>
                                    </Field>
                                    {formikProps.values.type == 'client' &&
                                        <Field
                                            name='typeId' label='Client' size='small'
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
                                    }
                                    <Field
                                        name='firstName' label='First Name' size='small'
                                        component={TextField}
                                    />
                                    <Field
                                        name='lastName' label='Last Name' size='small'
                                        component={TextField}
                                    />
                                    <Field
                                        name='title' label='Title' size='small'
                                        component={TextField}
                                    />
                                    <Field
                                        name='mobilePhone' label='Mobile Phone' size='small'
                                        component={TextField}
                                    />
                                    <Field
                                        name='workPhone' label='Work Phone' size='small'
                                        component={TextField}
                                    />
                                    <Field
                                        name='email' label='Email' size='small'
                                        component={TextField}
                                    />
                                    <Field
                                        name='staff' label='Staff' size='small'
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

export default POCModal;