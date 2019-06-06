import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Typography } from '@material-ui/core';
import { dateFormated, preventDefault, getValue } from 'lib/util';

export default function MedicineDelete({ item, loading, onClose, onDelete, ...props }) {
    const [reason, setReason] = useState('')
    return (
        <Dialog onClose={onClose} {...props}>
            <form style={{ textAlign: 'center', minWidth: 300 }}
                onSubmit={preventDefault(() => onDelete(item, reason))}>
                <DialogTitle>Remover do estoque?</DialogTitle>
                <DialogContent>
                    {item && <>
                        <Typography variant="subtitle1">{item.nomeComercial}</Typography>
                        <p><small>{item.principioAtivo}</small></p>
                        <p><b>Dosagem: </b>{item.dosagem}<br /></p>
                        <p><b>Vencimento: </b> {dateFormated(item.dataVencimento)}</p>
                        <p>{item.status && item.status.descricao} </p>
                        <TextField
                            fullWidth
                            multiline
                            required
                            label="Motivo"
                            placeholder="Descreva o motivo da remoção..."
                            value={reason}
                            disabled={loading}
                            onChange={getValue(setReason)}
                        />
                    </>}
                </DialogContent>
                <DialogActions>
                    {loading && <CircularProgress size={24} />}
                    <Button disabled={loading} type="button" onClick={onClose}>Cancelar</Button>
                    <Button disabled={loading} type="submit" color="primary">Remover</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
