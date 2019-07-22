import React from 'react'
import { Dialog, DialogTitle, DialogContent,  DialogActions, Button, TextField } from '@material-ui/core';
import { preventDefault } from 'lib/util';

export default function MedicineTypeDialog({ onClose, ...props }) {
    return (
        <Dialog onClose={onClose} {...props}>
            <form onSubmit={preventDefault()}>
                <DialogTitle>Novo tipo de medicamento</DialogTitle>
                <DialogContent>
                    <TextField
                        name="tipo"
                        label="Nome do tipo"
                        placeholder="Ex: Pílula"
                        fullWidth
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button fullWidth color="primary" type="button" onClick={onClose}>Cancelar</Button>
                    <Button fullWidth color="primary" variant="contained" type="submit">Cadastrar</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
