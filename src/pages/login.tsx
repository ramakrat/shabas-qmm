import type { NextPage } from "next";

import * as yup from "yup";
import { Field, Form, Formik, type FormikHelpers, type FormikProps } from "formik";

import { Button, Card, Typography } from "@mui/material";
import TextField from "~/components/Form/TextField";

interface FormValues {
    username: string;
    password: string;
}

const validationSchema = yup.object().shape({
    username: yup.string().required("Required"),
    password: yup.string().required("Required"),
});

const Login: NextPage = () => {

    const handleSubmit = () => {
        return;
    }

    return (
        <div className='login'>
            <Card>
                <Formik
                    enableReinitialize
                    initialValues={{
                        username: '',
                        password: '',
                    }}
                    validationSchema={validationSchema}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <Typography variant='h2'>Shabas Logo</Typography>
                        <Typography variant='h2'>Login</Typography>
                        <Field
                            name='username' label='Username' size='small'
                            component={TextField}
                        />
                        <Field
                            name='password' label='Password' size='small'
                            component={TextField}
                        />
                        <Button variant='contained'>Login</Button>
                    </Form>
                </Formik>
            </Card>
        </div>
    );
};

export default Login;