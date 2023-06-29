import React from "react";
import type { Client, Engagement, Poc, Site } from "@prisma/client";

import * as yup from "yup";
import { Field, Form, Formik, type FormikProps } from "formik";
import TextField from "../../Form/TextField";
import Select from "../../Form/Select";

import { Button, Card, CardActions, CardContent, CardHeader, IconButton, MenuItem, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    data?: Poc;
}

interface FormValues {
    firstName: string;
    lastName: string;
    title: string;
    mobilePhone: string;
    workPhone: string;
    email: string;
    type: string;
    typeId?: string;
}

const validationSchema = yup.object().shape({
    firstName: yup.string().required("Required"),
    lastName: yup.string().required("Required"),
    title: yup.string().required("Required"),
    mobilePhone: yup.string().required("Required"),
    workPhone: yup.string().required("Required"),
    email: yup.string().required("Required"),
    type: yup.string().required("Required"),
    typeId: yup.string()
        .when('type',
            (type, schema) => {
                if (type) {
                    if (type[0] != 'shabas') return schema.required('Required');
                }
                return schema;
            }),
});

const PocModal: React.FC<Props> = (props) => {

    const { open, setOpen, data } = props;

    // =========== Retrieve Form Context ===========

    const clients = api.client.getAll.useQuery(true).data;
    const engagements = api.engagement.getAll.useQuery(true).data;
    const sites = api.site.getAll.useQuery(true).data;
    // const users = api.user.getAll.useQuery(true).data;


    // =========== Input Field States ===========

    const [poc, setPoc] = React.useState<FormValues>({
        firstName: '',
        lastName: '',
        title: '',
        mobilePhone: '',
        workPhone: '',
        email: '',
        type: 'shabas',
        typeId: '',
    });

    // =========== Submission Management ===========

    const create = api.poc.create.useMutation();
    const update = api.poc.update.useMutation();

    React.useEffect(() => {
        if (data) {
            const typeRef = () => {
                if (data.client_id) return 'client';
                if (data.engagement_id) return 'engagement';
                if (data.site_id) return 'site';
                return 'shabas';
            }
            setPoc({
                firstName: data.first_name,
                lastName: data.last_name,
                title: data.title,
                mobilePhone: data.mobile_phone,
                workPhone: data.work_phone,
                email: data.email,
                type: typeRef(),
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
                type: 'shabas',
                typeId: '',
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
                first_name: values.firstName,
                last_name: values.lastName,
                title: values.title,
                mobile_phone: values.mobilePhone,
                work_phone: values.workPhone,
                email: values.email,
                client_id: values.type == 'client' ? Number(values.typeId) : undefined,
                engagement_id: values.type == 'engagement' ? Number(values.typeId) : undefined,
                site_id: values.type == 'site' ? Number(values.typeId) : undefined,
            }, {
                onSuccess() {
                    setOpen(false);
                    reload();
                }
            })
        } else {
            create.mutate({
                first_name: values.firstName,
                last_name: values.lastName,
                title: values.title,
                mobile_phone: values.mobilePhone,
                work_phone: values.workPhone,
                email: values.email,
                client_id: values.type == 'client' ? Number(values.typeId) : undefined,
                engagement_id: values.type == 'engagement' ? Number(values.typeId) : undefined,
                site_id: values.type == 'site' ? Number(values.typeId) : undefined,
            }, {
                onSuccess() {
                    setOpen(false);
                    reload();
                }
            })
        }
    }

    const renderTypeOptions = (type: string) => {
        if (type == 'client') {
            return (
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
            )
        } else if (type == 'engagement') {
            return (
                <Field
                    name='typeId' label='Engagement' size='small'
                    component={Select}
                >
                    <MenuItem value=''><em>Select an engagement...</em></MenuItem>
                    {engagements ? engagements.map((engagement: Engagement) => {
                        return (
                            <MenuItem value={engagement.id} key={engagement.id}>
                                {engagement.id}
                            </MenuItem>
                        )
                    }) : 'No Engagements'}
                </Field>
            )
        } else if (type == 'site') {
            return (
                <Field
                    name='typeId' label='Site' size='small'
                    component={Select}
                >
                    <MenuItem value=''><em>Select a site...</em></MenuItem>
                    {sites ? sites.map((site: Site) => {
                        return (
                            <MenuItem value={site.id} key={site.id}>
                                {site.id} - {site.name}
                            </MenuItem>
                        )
                    }) : 'No Sites'}
                </Field>
            )
        }
        // TODO: Add in optional user selection for shabas type
        return undefined;
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
                                    title={data ? 'Edit POC ' + data.id : 'Create New POC'}
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
                                        <MenuItem value='engagement'>
                                            Engagement
                                        </MenuItem>
                                        <MenuItem value='site'>
                                            Site
                                        </MenuItem>
                                    </Field>
                                    {renderTypeOptions(formikProps.values.type)}
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

export default PocModal;