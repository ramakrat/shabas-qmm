import React from "react";
import type { Assessment, Client, Engagement, EngagementPoc, Poc } from "@prisma/client";

import * as yup from "yup";
import { Field, Form, Formik, FormikProps } from "formik";
import TextField from "../../Form/TextField";
import Select from "../../Form/Select";

import { Button, Card, CardActions, CardContent, CardHeader, IconButton, MenuItem, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
import { api } from "~/utils/api";
import { dateInputFormat } from "~/utils/utils";
import { useRouter } from "next/router";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    data?: Engagement & {
        client: Client;
        pocs: Poc[];
        engagement_pocs: (EngagementPoc & {
            poc: Poc;
        })[];
        assessments: (Assessment & {
            poc: Poc | null;
        })[];
    };
}

interface FormValues {
    description: string;
    startDate: string;
    endDate: string;
    clientId: string;
    clientPocId: string;
    shabasPocId: string;
}

const validationSchema = yup.object().shape({
    description: yup.string().required("Required"),
    startDate: yup.date()
        .required("Required"),
    endDate: yup.date()
        .when('startDate',
            (startDate, schema) => {
                if (startDate) {
                    const start = startDate[0] as unknown as Date;
                    const dayAfter = new Date(start.getTime() + 86400000);
                    return schema.min(dayAfter, 'End Date has to be later than Start Date');
                }
                return schema;
            })
        .required("Required"),
    clientId: yup.string().required("Required"),
    clientPocId: yup.string().required("Required"),
    shabasPocId: yup.string().required("Required"),
});

const EngagementModal: React.FC<Props> = (props) => {

    const { open, setOpen, data } = props;

    // =========== Retrieve Form Context ===========

    const clients = api.client.getAll.useQuery(true).data;
    const pocs = api.poc.getAllInclude.useQuery(true).data;

    // =========== Input Field States ===========

    const [engagement, setEngagement] = React.useState<FormValues>({
        description: '',
        startDate: dateInputFormat(new Date()),
        endDate: dateInputFormat(new Date()),
        clientId: '',
        clientPocId: '',
        shabasPocId: '',
    });

    React.useEffect(() => {
        if (data) {
            const existingClientPoc = data.engagement_pocs.find(o => o.poc.client_id);
            const existingShabasPoc = data.engagement_pocs.find(o => !o.poc.client_id);
            setEngagement({
                description: data.description,
                startDate: dateInputFormat(data.start_date, true),
                endDate: dateInputFormat(data.end_date, true),
                clientId: data.client_id.toString(),
                clientPocId: existingClientPoc ? existingClientPoc.poc_id.toString() : '',
                shabasPocId: existingShabasPoc ? existingShabasPoc.poc_id.toString() : '',
            })
        } else {
            setEngagement({
                description: '',
                startDate: dateInputFormat(new Date()),
                endDate: dateInputFormat(new Date()),
                clientId: '',
                clientPocId: '',
                shabasPocId: '',
            })
        }
    }, [data])


    // =========== Submission Management ===========

    const create = api.engagement.create.useMutation();
    const update = api.engagement.update.useMutation();

    const createPoc = api.engagementPoc.create.useMutation();
    const updatePoc = api.engagementPoc.update.useMutation();

    const { reload } = useRouter();
    const handleSubmit = (
        values: FormValues,
    ) => {
        if (data) {
            update.mutate({
                id: data.id,
                start_date: new Date(values.startDate),
                end_date: new Date(values.endDate),
                description: values.description,
                client_id: Number(values.clientId),
            }, {
                onSuccess(created) {
                    const existingClientPoc = data.engagement_pocs.find(o => o.poc.client_id);
                    if (existingClientPoc) {
                        updatePoc.mutate({
                            id: existingClientPoc.id,
                            engagement_id: created.id,
                            poc_id: Number(values.clientPocId),
                        })
                    } else {
                        createPoc.mutate({
                            engagement_id: created.id,
                            poc_id: Number(values.clientPocId),
                        })
                    }

                    const existingShabasPoc = data.engagement_pocs.find(o => !o.poc.client_id);
                    if (existingShabasPoc) {
                        existingShabasPoc && updatePoc.mutate({
                            id: existingShabasPoc.id,
                            engagement_id: created.id,
                            poc_id: Number(values.shabasPocId),
                        })
                    } else {
                        createPoc.mutate({
                            engagement_id: created.id,
                            poc_id: Number(values.shabasPocId),
                        })
                    }

                    setOpen(false);
                    reload();
                }
            })
        } else {
            create.mutate({
                start_date: new Date(values.startDate),
                end_date: new Date(values.endDate),
                description: values.description,
                client_id: Number(values.clientId),
            }, {
                onSuccess(created) {
                    createPoc.mutate({
                        engagement_id: created.id,
                        poc_id: Number(values.clientPocId),
                    })
                    createPoc.mutate({
                        engagement_id: created.id,
                        poc_id: Number(values.shabasPocId),
                    })

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
                    initialValues={engagement}
                    validationSchema={validationSchema}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={handleSubmit}
                >
                    {(formikProps: FormikProps<FormValues>) => (
                        <Form>
                            <Card>
                                <CardHeader
                                    title={data ? 'Edit Engagement ' + data.id : 'Create New Engagement'}
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
                                        name='startDate' label='Start Date' size='small' type='date'
                                        component={TextField}
                                    />
                                    <Field
                                        name='endDate' label='End Date' size='small' type='date'
                                        component={TextField}
                                    />
                                    <Field
                                        name='description' label='Description' size='small'
                                        component={TextField}
                                    />
                                    <Field
                                        name='clientPocId' label='Client POC' size='small'
                                        component={Select}
                                    >
                                        <MenuItem value=''><em>Select a client POC...</em></MenuItem>
                                        {pocs && pocs.map(o => {
                                            if (o.client_id == Number(formikProps.values.clientId))
                                                return (
                                                    <MenuItem value={o.id} key={o.id}>
                                                        {o.first_name} {o.last_name} - {o.title}
                                                    </MenuItem>
                                                )
                                            return undefined;
                                        })}
                                    </Field>
                                    <Field
                                        name='shabasPocId' label='Shabas POC' size='small'
                                        component={Select}
                                    >
                                        <MenuItem value=''><em>Select a Shabas POC...</em></MenuItem>
                                        {pocs && pocs.map(o => {
                                            if (!o.client_id && !o.site_id && !o.engagement_id)
                                                return (
                                                    <MenuItem value={o.id} key={o.id}>
                                                        {o.first_name} {o.last_name} - {o.title}
                                                    </MenuItem>
                                                )
                                            return undefined;
                                        })}
                                    </Field>
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

export default EngagementModal;