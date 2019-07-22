import React, { forwardRef, useEffect, useState } from 'react';
import Header from 'components/Header';
import { Button, TextField, Dialog, DialogContent, DialogContentText, DialogActions, IconButton, Slide, MenuItem, FormControlLabel, Checkbox, makeStyles, InputAdornment, ListItemIcon, Typography as T, DialogTitle, Container } from '@material-ui/core';
import { Close as CloseIcon, Add as AddIcon } from '@material-ui/icons';
import { preventDefault, cancellablePromise, waitPromise } from 'lib/util';
import { useSdk } from 'lib/sdkContext';
import MedicineTypeDialog from './MedicineTypeDialog';

const useStyles = makeStyles({
    fieldsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap'
    },
    field: {
        width: 'calc(50% - 5px)',
    }
})

export default function MedicineEditDialog({ onSubmit, onItemFound, item, typesOptions, statusOptions, sending, editing, onFieldChange, onClose, ...props }) {
    const classes = useStyles()
    const [foundItem, resetFoundItem] = useSearchItem(item.lote)
    const [newTypeOpen, setNewTypeOpen] = useState(false)

    const fields = [
        ['lote', 'Lote', { required: true, disabled: editing, variant: 'outlined' }],
        ['nomeComercial', 'Nome Comercial', { required: true }],
        ['principioAtivo', 'Principio Ativo', { required: true, }],
        ['dosagem', 'Dosagem', { required: true }],
        ['dataVencimento', 'Data de Vencimento', { required: true, type: 'date', InputLabelProps: { shrink: true } }],
        ['outrasEspecificacoes', 'Outras especificações', { multiline: true, rowsMax: 4 }],
        ['laboratorio', 'Laboratório', { required: true }],
        ['valorEstoque', 'Estoque', { required: true, type: 'number', min: 0, step: 1, }, editing],
    ]

    return (<>
        <Dialog
            fullScreen
            TransitionComponent={Transition}
            onClose={onClose}
            {...props}
        >
            <Header simple title={editing ? `Editar` : 'Novo'}
                rightAction={
                    <IconButton color="inherit" disabled={sending} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                } />
            <Container>
                <form method="post" onSubmit={onSubmit}>
                    <DialogContent>
                        <DialogContentText>Preencha os dados abaixo</DialogContentText>

                        <div className={classes.fieldsContainer}>
                            <TextField
                                margin="dense"
                                id="status"
                                name="status"
                                label="Status"
                                variant="outlined"
                                className={classes.field}
                                value={item.status || 'none'}
                                onChange={e => onFieldChange('status', e.target.value)}
                                select>
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
                                    className={classes.field}
                                    onChange={e => onFieldChange(field, e.target.value)}
                                    type="text"
                                    {...args}
                                />
                            )}

                            <TextField
                                margin="dense"
                                id="tipo"
                                name="tipo"
                                label="Tipo de medicamento"
                                className={classes.field}
                                value={item.tipo || 'none'}
                                onChange={e => e.target.value && onFieldChange('tipo', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                select
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment>
                                            <IconButton edge="end" onClick={() => setNewTypeOpen(true)}>
                                                <AddIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}>

                                <MenuItem value="none" disabled>
                                    {typesOptions.length ? 'Selecione...' : 'Carregando...'}
                                </MenuItem>
                                {typesOptions.map(option => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.descricao}
                                    </MenuItem>
                                ))}
                                <MenuItem onClick={preventDefault(() => setNewTypeOpen(true))}>
                                    <ListItemIcon>
                                        <AddIcon />
                                    </ListItemIcon>
                                    <T>Adicionar novo</T>
                                </MenuItem>
                            </TextField>
                        </div>

                        <FormControlLabel
                            label="Uso Veterinário"
                            style={{ width: '100%' }}
                            control={
                                <Checkbox
                                    id="usoVeterinario"
                                    name="usoVeterinario"
                                    checked={item.usoVeterinario === 'S'}
                                    color="primary" value="true"
                                    onChange={e => onFieldChange('usoVeterinario', item.usoVeterinario === 'S' ? 'N' : 'S')}
                                />
                            }
                        />


                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" fullWidth size="large" type="submit" color="primary" disabled={sending}>Enviar</Button>
                        <Button variant="outlined" fullWidth size="large" disabled={sending} onClick={onClose}>Cancelar</Button>
                    </DialogActions>
                </form>
            </Container>
        </Dialog>

        <MedicineTypeDialog
            open={newTypeOpen}
            onClose={() => setNewTypeOpen(false)}
        />

        <Dialog open={Boolean(foundItem)} onClose={resetFoundItem}>
            <DialogTitle>Item Encontrado</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Um Item com este lote foi encontrado. Deseja editá-lo?
                </DialogContentText>
                {foundItem &&
                    <DialogContentText>
                        <strong>{foundItem.nomeComercial}</strong> - <small>{foundItem.principioAtivo}</small>
                    </DialogContentText>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={resetFoundItem} color="primary">
                    Não, inserir novo
                </Button>
                <Button onClick={() => resetFoundItem() || onItemFound(foundItem)} color="primary" autoFocus>
                    Editar
                </Button>
            </DialogActions>
        </Dialog>
    </>)
}

function useSearchItem(id) {
    const sdk = useSdk()
    const [foundItem, setFoundItem] = useState(null)
    const resetItem = () => setFoundItem(null)
    useEffect(() => {
        if (!id) return
        const [debounce, c1] = cancellablePromise(waitPromise(500))
        const [request, c2] = cancellablePromise(debounce.then(() => sdk.medicines.getOne(id)))
        request.then(found => setFoundItem(found)).catch(() => { })
        return () => { c1(); c2(); resetItem() }
    }, [id, sdk])

    return [foundItem, resetItem]
}

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})
