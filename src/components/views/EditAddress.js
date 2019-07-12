import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField } from '@material-ui/core';
import FormFields from 'components/FormFields';

const fields = [
    ['name', 'Nome'],
    ['cep', 'CEP'],
    ['address', 'Endereço'],
    ['number', 'Número'],
    ['bairro', 'Bairro'],
]

export default function EditAddress() {
    return (
        <Dialog open>
            <DialogTitle>Editar endereço</DialogTitle>
            <DialogContent>
                <DialogContentText>Informe os dados do endereço</DialogContentText>
            </DialogContent>

            <FormFields fields={fields} />
        </Dialog>
    )
}
