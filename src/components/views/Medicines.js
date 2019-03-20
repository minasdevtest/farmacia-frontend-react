import React, { Component } from 'react';
import Header from '../Header';
import { Typography, CircularProgress, Button, TextField, Table, TableRow, TableBody, TableCell, TableHead, Paper, Fab, Dialog, DialogContent, DialogContentText, DialogActions, IconButton, Slide, MenuItem, FormControlLabel, Checkbox } from '@material-ui/core';
import { Link } from 'react-router-dom';
import FarmaSdk from '../../farmaSDK'
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Close as CloseIcon } from '@material-ui/icons';

const fields = [
    ['lote', 'Lote', { required: true }],
    ['principioAtivo', 'Principio Ativo', { required: true }],
    ['dosagem', 'Dosagem', { required: true }],
    ['dataVencimento', 'Data de Vencimento', { required: true, type: 'date', InputLabelProps: { shrink: true } }],
    ['nomeComercial', 'Nome Comercial', { required: true }],
    ['outrasEspecificacoes', 'Outras especificações', { multiline: true, rowsMax: 4 }],
    ['laboratorio', 'Laboratório', { required: true }],
    ['valorEstoque', 'Estoque', { required: true, type: 'number', min: 0, step: 1 }],
]

class MedicinesView extends Component {
    constructor(props) {
        super(props);
        this.sdk = FarmaSdk.instance()
        this.state = {
            loading: true,
            items: [],
            newItem: {},
            newItemOpen: false,
            sending: false,
            deleting: false,
            statusOptions: [],
            typesOptions: []
        }
    }

    load = () => {
        this.setState({ loading: true })
        Promise.all([
            this.sdk.medicine().then(items => this.setState({ items, loading: false })),
            this.sdk.medicineStatus().then(statusOptions => this.setState({ statusOptions })),
            this.sdk.medicineTypes().then(typesOptions => this.setState({ typesOptions })),
        ])
            .catch(error => console.error(error) || this.setState({ error }))
            .then(() => this.setState({ loading: false }))
    }

    componentDidMount() {
        this.load()
    }

    dialogToggle = () => this.setState({
        newItemOpen: !this.state.newItemOpen,
        newItem: this.state.newItemOpen ? {} : this.state.newItem
    })

    createItem = e => {
        e && e.preventDefault()
        if (this.state.sending)
            return;
        const item = { ...this.state.newItem }
        item.status = this.state.statusOptions
            .find(({ id }) => item.status === id)
        item.tipo = this.state.typesOptions
            .find(({ id }) => item.tipo === id)

        item.estoque = item.estoque || {}
        item.estoque.quantidade = item.valorEstoque
        delete item.valorEstoque

        item.usoVeterinario = item.usoVeterinario ? 'S' : 'N'


        this.setState({ sending: true })
        this.sdk.saveMedicine(item)
            .then(items => this.setState({ newItem: {}, sending: false, newItemOpen: false }))
            .then(this.load)
            .catch(error => console.error(error) || this.setState({ error }))
    }

    deleteItem = id => {
        if (this.state.deleting)
            return;
        this.setState({ deleting: true })
        const items = [...this.state.items]
        const index = items.findIndex(({ id: itemId }) => id === itemId)
        items.splice(index, 1)
        this.sdk.deleteMedicine(id)
            .then(() => this.setState({ items }))
            .catch(error => console.error(error) || this.setState({ error }))
            .then(() => this.setState({ deleting: false }))
    }

    render() {
        const { newItemOpen, newItem, items, loading, sending, typesOptions, statusOptions } = this.state
        return (
            <>
                <Header title="Pontos de Apoio" backButton />
                <main>
                    {loading ?
                        <CircularProgress /> :
                        !items.length ?
                            <Typography align="center">Lista vazia</Typography> :
                            <Paper style={{ margin: 10, overflow: 'auto' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="dense">Lote</TableCell>
                                            <TableCell>Nome</TableCell>
                                            <TableCell style={{ width: 60 }}>Status</TableCell>
                                            <TableCell align="right" padding="none">Qtd.</TableCell>
                                            <TableCell>Lab.</TableCell>
                                            <TableCell padding="none">Detalhes</TableCell>
                                            <TableCell style={{ width: 100 }}>Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map(item =>
                                            <TableRow key={item.lote}>
                                                <TableCell padding="dense">
                                                    <small>{item.lote}</small>
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {item.nomeComercial}<br />
                                                    <small>{item.principioAtivo}</small>
                                                </TableCell>

                                                <TableCell>
                                                    {item.status.descricao}
                                                </TableCell>

                                                <TableCell align="right" padding="none">
                                                    {(item.estoque && item.estoque.quantidade) || 'N/A'}
                                                </TableCell>

                                                <TableCell>
                                                    {item.laboratorio}
                                                </TableCell>

                                                <TableCell padding="none">
                                                    <b>Dosagem: </b>{item.dosagem}<br />
                                                    {item.tipo.descricao}<br />
                                                    <b>Vencimento: </b>
                                                    {item.dataVencimento
                                                        .split('-')
                                                        .reverse()
                                                        .join('/')}
                                                </TableCell>

                                                <TableCell>
                                                    <IconButton onClick={() => this.setState({
                                                        newItem: {
                                                            ...item,
                                                            valorEstoque: item.estoque.quantidade,
                                                            status: item.status && item.status.id,
                                                            tipo: item.tipo && item.tipo.id,
                                                        }, newItemOpen: true
                                                    })} color="secondary">
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton disabled={this.state.deleting} onClick={() => this.deleteItem(item.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>

                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Paper>
                    }
                    <Fab color="primary" title="Adicionar" aria-label="Adicionar"
                        onClick={this.dialogToggle}
                        style={{ position: 'sticky', bottom: 16, right: 16, float: 'right', margin: 16 }}>
                        <AddIcon />
                    </Fab>
                    <Dialog
                        fullScreen
                        open={newItemOpen}
                        onClose={this.dialogToggle}
                        TransitionComponent={Transition}
                    >
                        <Header title={newItem.id ? `Editar '${newItem.nome}'` : 'Novo Local'}
                            rightAction={
                                <IconButton color="inherit" disabled={sending} onClick={this.dialogToggle}>
                                    <CloseIcon />
                                </IconButton>
                            } />
                        <form method="post" onSubmit={this.createItem}>
                            <DialogContent>
                                <DialogContentText>Preencha os dados abaixo</DialogContentText>
                                {fields.map(([field, label, args = {}], i) =>
                                    <TextField
                                        key={field}
                                        autoFocus={i === 0}
                                        margin="dense"
                                        id={field}
                                        name={field}
                                        label={label}
                                        value={newItem[field] || ''}
                                        onChange={e => this.setState({ newItem: { ...newItem, [field]: e.target.value } })}
                                        type="text"
                                        fullWidth
                                        {...args
                                        // { ...args, required: false }
                                        }
                                    />
                                )}

                                <TextField
                                    margin="dense"
                                    id="tipo"
                                    name="tipo"
                                    label="Tipo de medicamento"
                                    value={newItem.tipo || 'none'}
                                    onChange={e => this.setState({ newItem: { ...newItem, tipo: e.target.value } })}
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

                                <TextField
                                    margin="dense"
                                    id="status"
                                    name="status"
                                    label="Status"
                                    value={newItem.status || 'none'}
                                    onChange={e => this.setState({ newItem: { ...newItem, status: e.target.value } })}
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

                                <FormControlLabel
                                    label="Uso Veterinário"
                                    style={{ width: '100%' }}
                                    control={
                                        <Checkbox
                                            id="usoVeterinario"
                                            name="usoVeterinario"
                                            checked={newItem.usoVeterinario || false}
                                            color="primary" value="true"
                                            onChange={e => this.setState({ newItem: { ...newItem, usoVeterinario: e.target.checked } })}
                                        />
                                    }
                                />

                            </DialogContent>
                            <DialogActions>
                                <Button variant="contained" fullWidth size="large" type="submit" color="primary" disabled={this.sending}>Enviar</Button>
                                <Button variant="outlined" fullWidth size="large" disabled={this.sending} onClick={this.dialogToggle}>Cancelar</Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                </main>
            </>
        );
    }
}

function Transition(props) {
    return <Slide direction="up" {...props} />
}

export default MedicinesView;