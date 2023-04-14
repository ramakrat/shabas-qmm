import React from "react";
import * as yup from "yup";
import { type FormikHelpers, Formik, Form, Field } from "formik";
import { Button, Card, CardActions, CardContent, CardHeader, IconButton, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
import { api } from "~/utils/api";
import TextField from "~/components/Form/TextField";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

interface FormValues {
    name: string;
}

const validationSchema = yup.object().shape({
    name: yup.string().required("Required")
});

const IndustryModal: React.FC<Props> = (props) => {
    
    const { open, setOpen } = props;

    // =========== Input Field States ===========

    const [filter, setFilter] = React.useState<FormValues>({
        name: '',
    });

    // =========== Submission Management ===========

    const create = api.filter.create.useMutation();

    const handleSubmit = (
        values: FormValues,
        formikHelpers: FormikHelpers<FormValues>
    ) => {
        create.mutate({
            type: 'industry',
            name: values.name,
        }, {
            onSuccess() { setOpen(false) }
        })
    }

    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal'>
            <div>
                <Formik
                    enableReinitialize
                    initialValues={filter}
                    validationSchema={validationSchema}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <Card>
                            <CardHeader
                                title={'Create New Industry'}
                                action={
                                    <IconButton onClick={() => setOpen(false)}>
                                        <Close />
                                    </IconButton>
                                }
                            />
                            <CardContent>
                                <Field
                                    id='name' name='name' label='Name' size='small'
                                    component={TextField}
                                />
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

export default IndustryModal;