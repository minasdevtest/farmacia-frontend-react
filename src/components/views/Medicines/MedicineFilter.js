import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemSecondaryAction, Switch, Divider, ListItemIcon, TextField, Toolbar, Typography as T, IconButton, Button } from '@material-ui/core';
import { Pets as PetsIcon, Healing as HealingIcon, Category as CategoryIcon, ChevronLeft } from '@material-ui/icons';
import ListItemNested from 'lib/components/ListItemNested';
import { preventDefault } from 'lib/util';

function toggleArrayItem(item, array = []) {
    const newArray = array.filter(e => e !== item)
    if (newArray.length === array.length)
        newArray.push(item)
    return newArray
}

export default function MedicineFilter({ initialFilter = {}, onApply, status = [], types = [], ...props }) {
    const [filter, setFilter] = useState(initialFilter)
    const onChange = (field, value) => setFilter({ ...filter, [field]: value })
    const close = () => onApply(filter)
    const { lote: idFilter, usoVeterinario: vetFilter = false, status: statusFilter = [], types: typesFilter = [] } = filter
    const drawer = (<>
        <Toolbar>
            <IconButton style={{ marginLeft: -16, marginRight: 8 }} onClick={close} color="inherit" edge="start">
                <ChevronLeft />
            </IconButton>
            <T variant="h6" noWrap style={{ flex: 1 }}>Filtrar</T>
        </Toolbar>

        <List component="div" style={{ minWidth: 300 }} disablePadding>
            <Divider />
            <ListItem button component="label">
                <form style={{ flex: 1 }} onSubmit={preventDefault()}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Insira o código do lote"
                        InputLabelProps={{ shrink: true }}
                        label="Lote"
                        type="number"
                        min="0"
                        step="1"
                        value={idFilter}
                        onChange={e => onChange('lote', e.target.value)}
                    />
                </form>
            </ListItem>
            <Divider />

            <ListItem button component="label" htmlFor="filter-vet">
                <ListItemIcon>
                    <PetsIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Uso veterinário" />
                <ListItemSecondaryAction>
                    <Switch
                        checked={vetFilter}
                        onChange={e => onChange('usoVeterinario', e.target.checked)}
                        color="primary" edge="end" id="filter-vet" />
                </ListItemSecondaryAction>
            </ListItem>
            <Divider />

            <ListItemNested titleChildren={<>
                <ListItemIcon>
                    <HealingIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Status" />
            </>}>
                {status.map(({ id, descricao }) =>
                    <ListItem key={id} button component="label" htmlFor={`filter-status-${id}`}>
                        <ListItemText primary={descricao} />
                        <ListItemSecondaryAction>
                            <Switch
                                checked={-1 !== statusFilter.findIndex(v => id === v)}
                                onChange={() => onChange('status', toggleArrayItem(id, statusFilter))}
                                color="primary" edge="end" id={`filter-status-${id}`} />
                        </ListItemSecondaryAction>
                    </ListItem>
                )}
            </ListItemNested>
            <Divider />

            <ListItemNested titleChildren={<>
                <ListItemIcon>
                    <CategoryIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Tipo" />
            </>}>
                {types.map(({ id, descricao }) =>
                    <ListItem key={id} button component="label" htmlFor={`filter-type-${id}`}>
                        <ListItemText primary={descricao} />
                        <ListItemSecondaryAction>
                            <Switch
                                checked={-1 !== typesFilter.findIndex(v => id === v)}
                                onChange={() => onChange('types', toggleArrayItem(id, typesFilter))}
                                color="primary" edge="end" id={`filter-type-${id}`} />
                        </ListItemSecondaryAction>
                    </ListItem>
                )}
            </ListItemNested>
            <Divider />

            <ListItem>
                <Button onClick={close} variant="contained" color="primary" fullWidth>Aplicar filtros</Button>
            </ListItem>
        </List>
    </>)
    return (
        <Drawer onClose={close} anchor="right" variant="temporary" {...props} ModalProps={{ keepMounted: true }}>
            {drawer}
        </Drawer>
    )
}
