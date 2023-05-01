import React from "react";

import * as yup from "yup";
import { Field, Form, Formik } from "formik";
import TextField from "../../Form/TextField";

import { Button, Card, CardActions, CardContent, CardHeader, IconButton, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

interface FormValues {
    number: string;
    question: string;
    pillar: string;
    practiceArea: string;
    topicArea: string;
    hint: string;
    priority: string;
}

const validationSchema = yup.object().shape({
    number: yup.string().required("Required"),
    question: yup.string().required("Required"),
    pillar: yup.string().required("Required"),
    practiceArea: yup.string().required("Required"),
    topicArea: yup.string().required("Required"),
    hint: yup.string().required("Required"),
    priority: yup.string().required("Required"),
});

const QuestionModal: React.FC<Props> = (props) => {

    const { open, setOpen } = props;

    // =========== Input Field States ===========

    const [question, setQuestion] = React.useState<FormValues>({
        number: '',
        question: '',
        pillar: '',
        practiceArea: '',
        topicArea: '',
        hint: '',
        priority: '',
    });

    // =========== Submission Management ===========

    const create = api.question.create.useMutation();

    React.useEffect(() => {
        setQuestion({
            number: '',
            question: '',
            pillar: '',
            practiceArea: '',
            topicArea: '',
            hint: '',
            priority: '',
        })
    }, [open])

    const { reload } = useRouter();
    const handleSubmit = (
        values: FormValues,
    ) => {
        create.mutate({
            active: true,
            number: values.number,
            question: values.question,
            pillar: values.pillar,
            practice_area: values.practiceArea,
            topic_area: values.topicArea,
            hint: values.hint,
            priority: values.priority,
        }, {
            onSuccess() {
                setOpen(false);
                reload();
            }
        })
    }

    return (
        <Modal open={open} onClose={() => setOpen(false)} className='create-modal'>
            <div>
                <Formik
                    enableReinitialize
                    initialValues={question}
                    validationSchema={validationSchema}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <Card>
                            <CardHeader
                                title={'Create New Question'}
                                action={
                                    <IconButton onClick={() => setOpen(false)}>
                                        <Close />
                                    </IconButton>
                                }
                            />
                            <CardContent>
                                <Field
                                    name='number' label='Question #' size='small'
                                    component={TextField}
                                />
                                <Field
                                    name='question' label='Question' size='small'
                                    component={TextField}
                                />
                                <Field
                                    name='pillar' label='Pillar' size='small'
                                    component={TextField}
                                />
                                <Field
                                    name='practiceArea' label='Practice Area' size='small'
                                    component={TextField}
                                />
                                <Field
                                    name='topicArea' label='Topic Area' size='small'
                                    component={TextField}
                                />
                                <Field
                                    name='hint' label='Hint' size='small'
                                    component={TextField}
                                />
                                <Field
                                    name='priority' label='Priority' size='small'
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

export default QuestionModal;