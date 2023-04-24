import React from "react";
import * as yup from "yup";
import { Formik, Form, Field } from "formik";
import { Button, Card, CardActions, CardContent, CardHeader, IconButton, MenuItem, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
import { api } from "~/utils/api";
import Select from "~/components/Form/Select";
import { type Site } from "@prisma/client";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

interface FormValues {
    siteId: string;
}

const validationSchema = yup.object().shape({
    name: yup.string().required("Required")
});

const SiteSpecificModal: React.FC<Props> = (props) => {

    const { open, setOpen } = props;

    // =========== Form Context ===========

    const sites = api.site.getAll.useQuery(true).data;

    // =========== Submission Management ===========

    const create = api.filter.create.useMutation();

    const handleSubmit = (
        values: FormValues,
    ) => {
        create.mutate({
            type: 'site-specific',
            site_id: Number(values.siteId),
            name: sites?.find(s => s.id == Number(values.siteId))?.name ?? '',
        }, {
            onSuccess() { setOpen(false) }
        })
    }

    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal'>
            <div>
                <Formik
                    enableReinitialize
                    initialValues={{ siteId: '' }}
                    validationSchema={validationSchema}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <Card>
                            <CardHeader
                                title={'Create New Site Specific'}
                                action={
                                    <IconButton onClick={() => setOpen(false)}>
                                        <Close />
                                    </IconButton>
                                }
                            />
                            <CardContent>
                                <Field
                                    name='siteId' label='Site' size='small'
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
                            </CardContent>
                            <CardActions>
                                <Button variant='contained' color='error' onClick={() => setOpen(false)}>Cancel</Button>
                                <Button variant='contained' type='submit'>Create</Button>
                            </CardActions>
                        </Card>
                    </Form>
                </Formik>
            </div>
        </Modal>
    )
}

export default SiteSpecificModal;