import React from 'react';
import Header from 'components/Header';
import { Button, TextField, Dialog, DialogContent, DialogContentText, DialogActions, IconButton, Slide, MenuItem, FormControlLabel, Checkbox } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

export default function MedicineEditDialog({ onSubmit, item, typesOptions, statusOptions, sending, editing, onFieldChange, onClose, ...props }) {

    const fields = [
        ['lote', 'Lote', { required: true, disabled: editing }],
        ['principioAtivo', 'Principio Ativo', { required: true, }],
        ['dosagem', 'Dosagem', { required: true }],
        ['dataVencimento', 'Data de Vencimento', { required: true, type: 'date', InputLabelProps: { shrink: true } }],
        ['nomeComercial', 'Nome Comercial', { required: true }],
        ['outrasEspecificacoes', 'Outras especificações', { multiline: true, rowsMax: 4 }],
        ['laboratorio', 'Laboratório', { required: true }],
        ['valorEstoque', 'Estoque', { required: true, type: 'number', min: 0, step: 1, }, editing],
    ]

    return (
        <Dialog
            fullScreen
            TransitionComponent={Transition}
            {...props}
        >
            <Header simple title={editing ? `Editar` : 'Novo'}
                rightAction={
                    <IconButton color="inherit" disabled={sending} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                } />
            <form method="post" onSubmit={onSubmit}>
                <DialogContent>
                    <DialogContentText>Preencha os dados abaixo</DialogContentText>

                    <TextField
                        margin="dense"
                        id="status"
                        name="status"
                        label="Status"
                        variant="outlined"
                        value={item.status || 'none'}
                        onChange={e => onFieldChange('status', e.target.value)}
                        select
                        fullWidth>
                        <MenuItem value="none" disabled>
                            {statusOptions.length ? 'Selecione...' : 'Carregando...'}
                        </MenuItem>
                        {statusOptions.map(option => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.descricao}
                            </MenuItem>
                        ))}
                    </TextField>

                    {fields.map(([field, label, args = {}, hidden], i) => !hidden &&
                        <TextField
                            key={field}
                            autoFocus={i === 0}
                            margin="dense"
                            id={field}
                            name={field}
                            label={label}
                            value={item[field] || ''}
                            onChange={e => onFieldChange(field, e.target.value)}
                            type="text"
                            fullWidth
                            {...args}
                        />
                    )}

                    <TextField
                        margin="dense"
                        id="tipo"
                        name="tipo"
                        label="Tipo de medicamento"
                        value={item.tipo || 'none'}
                        onChange={e => onFieldChange('tipo', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        select
                        fullWidth>

                        <MenuItem value="none" disabled>
                            {typesOptions.length ? 'Selecione...' : 'Carregando...'}
                        </MenuItem>
                        {typesOptions.map(option => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.descricao}
                            </MenuItem>
                        ))}
                    </TextField>

                    <FormControlLabel
                        label="Uso Veterinário"
                        style={{ width: '100%' }}
                        control={
                            <Checkbox
                                id="usoVeterinario"
                                name="usoVeterinario"
                                checked={item.usoVeterinario || false}
                                color="primary" value="true"
                                onChange={e => onFieldChange('usoVeterinario', e.target.checked)}
                            />
                        }
                    />

                </DialogContent>
                <DialogActions>
                    <Button variant="contained" fullWidth size="large" type="submit" color="primary" disabled={sending}>Enviar</Button>
                    <Button variant="outlined" fullWidth size="large" disabled={sending} onClick={onClose}>Cancelar</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

function Transition(props) {
    return <Slide direction="up" {...props} />
}
