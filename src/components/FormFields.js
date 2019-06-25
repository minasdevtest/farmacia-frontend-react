import React from 'react'
import { TextField } from '@material-ui/core';

/**
 * Generate an list of form fields
 *
 * @export
 * @param {*} { fields = [], values = {}, fieldProps = {}, onChange }
 * @returns
 */
export default function FormFields({ disabled, fields = [], values = {}, fieldProps = {}, onChange }) {
    return fields.map(([field, label, args = {}, hidden], i) => !hidden &&
        <TextField
            key={field}
            autoFocus={i === 0}
            margin="dense"
            id={field}
            name={field}
            label={label}
            value={values[field] || ''}
            onChange={e => onChange(field, e.target.value)}
            type="text"
            fullWidth
            disabled={disabled}
            {...fieldProps}
            {...args}
        />
    )
}
