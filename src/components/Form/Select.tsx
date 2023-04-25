/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { type FieldProps, getIn } from 'formik';
import { FormControl, FormHelperText, InputLabel, Select as MuiSelect, type SelectProps, type TextFieldProps } from '@mui/material';

/**
 * Material TextField Component with Formik Support including Errors.
 * Intended to be specified via the `component` prop in a Formik <Field> or <FastField> component.
 * Material-UI specific props are passed through.
 */
export const Select: React.FC<FieldProps & SelectProps & TextFieldProps> = props => {

    const { children, error, helperText, field, form, label, value, ...rest } = props;

    const isTouched = getIn(form.touched, field.name);
    const errorMessage = getIn(form.errors, field.name);
    const hasErrors = error ?? Boolean(isTouched && errorMessage);

    return (
        <FormControl>
            <InputLabel shrink size="small" error={hasErrors}>{label}</InputLabel>
            <MuiSelect
                variant="outlined" label={label} displayEmpty notched={true}
                error={hasErrors}
                {...rest}
                {...field}
            >
                {children}
            </MuiSelect>
            <FormHelperText error={Boolean(errorMessage)}>
                {(helperText ?? (Boolean(isTouched && errorMessage)) ? errorMessage : undefined)}
            </FormHelperText>
        </FormControl>
    )
}

export default Select;
