import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemSecondaryAction, Switch, Divider, ListItemIcon, TextField, Toolbar, Typography as T, IconButton, Button, InputAdornment } from '@material-ui/core';
import { Pets as PetsIcon, Healing as HealingIcon, Category as CategoryIcon, ChevronLeft, Cancel as CancelIcon } from '@material-ui/icons';
import ListItemNested from 'lib/components/ListItemNested';
import { preventDefault } from 'lib/util';

function toggleArrayItem(item, array = []) {
    const newArray = array.filter(e => e !== item)
    if (newArray.length === array.length)
        newArray.push(item)
    return newArray
}

/**
 * Medicine Filter
 * TODO: fix tabindex radio
 *
 * @export
 * @param {Object} { initialFilter = {}, onApply, status = [], types = [], ...props }
 * @returns {React.Component}
 */
export default function MedicineFilter({ initialFilter = {}, onApply, status = [], types = [], ...props }) {
    const [filter, setFilter] = useState(initialFilter)
    const onChange = (field, value) => setFilter({ ...filter, [field]: value })
    const close = () => onApply(filter)
    const { lote: idFilter = '', usoVeterinario: vetFilter = false, status: statusFilter = [], tipo: typesFilter = [] } = filter
    const drawer = (<>
        <Toolbar>
            <IconButton style={{ marginLeft: -16, marginRight: 8 }} onClick={close} color="inherit" edge="start">
                <ChevronLeft />
            </IconButton>
            <T variant="h6" noWrap style={{ flex: 1 }}>Filtrar</T>
        </Toolbar>
        <form onSubmit={preventDefault(close)}>
            <List component="div" style={{ minWidth: 300 }} disablePadding>
                <Divider />
                <ListItem component="label">
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Insira o código do lote"
                        InputLabelProps={{ shrink: true }}
                        label="Lote"
                        name="lote"
                        type="number"
                        min="0"
                        step="1"
                        value={idFilter}
                        onChange={e => onChange('lote', e.target.value)}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <IconButton edge="end" onClick={() => onChange('lote', '')}>
                                    <CancelIcon />
                                </IconButton>
                            </InputAdornment>
                        }}
                    />
                </ListItem>
                <Divider />

                <ListItemSwitch
                    id="filter-vet"
                    title="Uso veterinário"
                    checked={vetFilter}
                    onChange={e => onChange('usoVeterinario', e.target.checked)}
                >
                    <ListItemIcon>
                        <PetsIcon color="primary" />
                    </ListItemIcon>
                </ListItemSwitch>

                <Divider />

                <ListItemNested titleChildren={<>
                    <ListItemIcon>
                        <HealingIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Status" />
                </>}>
                    {status.map(({ id, descricao }) =>
                        <ListItemSwitch
                            key={id} id={`filter-status-${id}`} title={descricao}
                            checked={-1 !== statusFilter.findIndex(v => id === v)}
                            onChange={() => onChange('status', toggleArrayItem(id, statusFilter))}
                        />
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
                        <ListItemSwitch
                            key={id} id={`filter-type-${id}`} title={descricao}
                            checked={-1 !== typesFilter.findIndex(v => id === v)}
                            onChange={() => onChange('tipo', toggleArrayItem(id, statusFilter))}
                        />
                    )}
                </ListItemNested>
                <Divider />

                <ListItem>
                    <Button type="submit" variant="contained" color="primary" fullWidth>Aplicar filtros</Button>
                </ListItem>
            </List>
        </form>
    </>)
    return (
        <Drawer onClose={close} anchor="right" variant="temporary" {...props} ModalProps={{ keepMounted: true }}>
            {drawer}
        </Drawer>
    )
}


function ListItemSwitch({ children, checked, id, title, ...props }) {
    return (
        <ListItem button component="label" htmlFor={id} tabIndex="-1" selected={checked}>
            {children}
            <ListItemText primary={title} />
            <ListItemSecondaryAction>
                <Switch color="primary" edge="end" id={id} checked={checked}
                    {...props}
                />
            </ListItemSecondaryAction>
        </ListItem>
    )
}