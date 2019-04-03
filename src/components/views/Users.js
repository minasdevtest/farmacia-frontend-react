import React, { Component } from 'react';
import Header from '../Header';
import { Typography, CircularProgress, Button, TextField, Table, TableRow, TableBody, TableCell, TableHead, Paper, Fab, Dialog, DialogContent, DialogContentText, DialogActions, IconButton, Slide, MenuItem } from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Close as CloseIcon } from '@material-ui/icons';
import { withSdk } from '../../lib/sdkContext';

/**
 *
 * @class UsersView
 * @extends {Component}
 * @property {Strig} sdk
 */
class UsersView extends Component {

    constructor(props) {
        console.warn(props)
        super(props);
        this.state = {
            loading: true,
            items: [],
            newItem: {},
            newItemOpen: false,
            editItemId: null,
            sending: false,
            deleting: false,
            statusOptions: [],
            typesOptions: []
        }
    }

    get sdk() {
        console.warn(this.props.sdk)
        return this.props.sdk
    }

    load = () => {
        this.setState({ loading: true })
        this.sdk.getUsers()
            .then(items => this.setState({ items }))
            .catch(error => console.error(error) || this.setState({ error }))
            .then(() => this.setState({ loading: false }))
    }

    componentDidMount() {
        this.load()
    }

    dialogToggle = () => this.setState({
        newItemOpen: !this.state.newItemOpen,
        editItemId: null,
        newItem: this.state.newItemOpen ? {} : this.state.newItem
    })

    createItem = e => {
        e && e.preventDefault()
        if (this.state.sending)
            return;
        const { editItemId } = this.state
        const item = { ...this.state.newItem }


        this.setState({ sending: true })
        this.sdk.createUser(item, editItemId)
            .then(items => this.setState({ newItem: {}, editItemId: null, sending: false, newItemOpen: false }))
            .then(this.load)
            .catch(error => console.error(error) || this.setState({ error }))
    }

    deleteItem = id => {
        if (this.state.deleting)
            return;
        this.setState({ deleting: true })
        const items = [...this.state.items]
        const index = items.findIndex(({ _id: itemId }) => id === itemId)
        items.splice(index, 1)
        this.sdk.deleteUser(id)
            .then(() => this.setState({ items }))
            .catch(error => console.error(error) || this.setState({ error }))
            .then(() => this.setState({ deleting: false }))
    }

    render() {
        const { newItemOpen, newItem, items, loading, sending, typesOptions, statusOptions, editItemId } = this.state

        const fields = [
            ['name', 'Nome', { required: true }],
            ['email', 'Email', { required: true, type: 'email' }],
            ['password', 'Senha', { required: true, type: 'password' }],
        ]

        return (
            <>
                <Header title="Usuários" backButton />
                <main>
                    {loading ?
                        <CircularProgress /> :
                        !items.length ?
                            <Typography align="center">Lista vazia</Typography> :
                            <Paper style={{ margin: 10, overflow: 'auto' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="dense">Nome</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell padding="none">permissões</TableCell>
                                            <TableCell style={{ width: 100 }}>Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map(item =>
                                            <TableRow key={item._id}>
                                                <TableCell padding="dense">
                                                    <small>{item.name}</small>
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {item.email}<br />
                                                </TableCell>

                                                <TableCell>
                                                    {item.roles.join(', ')}
                                                </TableCell>

                                                <TableCell>
                                                    <IconButton onClick={() => this.setState({
                                                        newItem: { ...item },
                                                        newItemOpen: true,
                                                        editItemId: item._id
                                                    })} color="secondary">
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton disabled={this.state.deleting} onClick={() => this.deleteItem(item._id)}>
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
                        <Header title={editItemId ? `Editar` : 'Novo'}
                            rightAction={
                                <IconButton color="inherit" disabled={sending} onClick={this.dialogToggle}>
                                    <CloseIcon />
                                </IconButton>
                            } />
                        <form method="post" onSubmit={this.createItem}>
                            <DialogContent>
                                <DialogContentText>Preencha os dados abaixo</DialogContentText>

                                {fields.map(([field, label, args = {}, hidden], i) => !hidden &&
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
                                    id="roles"
                                    name="roles"
                                    label="Função"
                                    value={newItem.roles || ''}
                                    onChange={e => this.setState({ newItem: { ...newItem, roles: e.target.value } })}
                                    select
                                    required
                                    fullWidth>
                                    <MenuItem value="" disabled>
                                        Selecione...
                                    </MenuItem>
                                    <MenuItem value="user">
                                        Usuário
                                    </MenuItem>
                                    <MenuItem value="admin">
                                        Administrador
                                    </MenuItem>
                                </TextField>

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

export default withSdk(v => v)(UsersView);