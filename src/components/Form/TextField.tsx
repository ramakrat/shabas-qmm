import React from 'react';
import { type FieldProps, getIn } from 'formik';
import { TextField as MuiTextField, type TextFieldProps } from '@mui/material';

/**
 * Material TextField Component with Formik Support including Errors.
 * Intended to be specified via the `component` prop in a Formik <Field> or <FastField> component.
 * Material-UI specific props are passed through.
 */
const TextField: React.FC<FieldProps & TextFieldProps> = props => {
    const isTouched = getIn(props.form.touched, props.field.name)
    const errorMessage = getIn(props.form.errors, props.field.name)

    const { error, helperText, field, ...rest } = props

    return (
        <MuiTextField
            variant="outlined"
            error={error ?? Boolean(isTouched && errorMessage)}
            helperText={helperText ?? ((isTouched && errorMessage) ? errorMessage : undefined)}
            {...rest}
            {...field}
        />
    )
}

export default TextField;
