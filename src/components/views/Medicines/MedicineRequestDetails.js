import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

export default function MedicineRequestDetails({ request, onClose, ...props }) {
    return (
        <Dialog onClose={onClose} {...props}>
            <DialogTitle>Pedido finalizado!</DialogTitle>
            <DialogContent>
                <p>
                    {'O medicamento está disponível para retirada na farmácia universitária do dia '}
                    <time>{request && new Date(request.beginDate).toLocaleDateString()}</time>
                    {' ao dia '}
                    <time>{request && new Date(request.endDate).toLocaleDateString()}</time>.
                    </p>
                <p>Não se esqueca de levar a receita.</p>
            </DialogContent>
            <DialogActions>
                <Button fullWidth variant="contained" color="primary" onClick={onClose}>Entendi</Button>
                <Button fullWidth variant="outlined" color="secondary" component="a"
                    href="https://goo.gl/maps/JPUxSEo2YEpoRCHt8" target="_blank">Ver no mapa</Button>
            </DialogActions>
        </Dialog>
    )
}
