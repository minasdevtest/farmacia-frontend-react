import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from '@material-ui/core';
import { dateFormated, preventDefault, useStateReset } from 'lib/util';

export default function MedicineDetails({ item, loading, onClose, onRequest, ...props }) {
    const [amount, setAmount] = useStateReset('1', [item])
    return (
        <Dialog onClose={onClose} {...props}>
            <form style={{ textAlign: 'center' }}
                onSubmit={preventDefault(() => onRequest(Number(amount)))}>
                <DialogTitle>Informações do Medicamento</DialogTitle>
                <DialogContent>
                    {(!item || loading) ? <CircularProgress /> : <>
                        <h4>{item.nomeComercial}</h4>
                        <p><small>{item.principioAtivo}</small></p>
                        <p><b>Dosagem: </b>{item.dosagem}<br /></p>
                        <p><b>Vencimento: </b> {dateFormated(item.dataVencimento)}</p>
                        <p>{item.status && item.status.descricao} </p>
                        <TextField
                            fullWidth
                            type="number"
                            inputProps={{
                                step: 1,
                                min: 1,
                                max: (item.estoque && item.estoque.quantidade) || 1,
                            }}
                            label="Quantidade"
                            value={amount}
                            disabled={loading}
                            onChange={e => setAmount(e.target.value)}
                        />
                    </>}
                </DialogContent>
                <DialogActions>
                    <Button disabled={loading} type="button" onClick={onClose}>Cancelar</Button>
                    <Button disabled={loading} type="submit" color="primary">Solicitar</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
