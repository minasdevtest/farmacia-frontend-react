import React, { Component } from 'react';
import Header from '../Header';
import { Typography, CircularProgress, Button, TextField, Table, TableRow, TableBody, TableCell, TableHead, Paper, Fab, Dialog, DialogContent, DialogContentText, DialogActions, IconButton, Slide, MenuItem, Card, CardContent, CardActions } from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Close as CloseIcon } from '@material-ui/icons';
import { withSdk } from '../../lib/sdkContext';
import { withLogin } from '../LoginView';
import FarmaSdk from '../../lib/farmaSDK';

/**
 * Current User handler
 * TODO: ADD route for user edit and password
 * @class UsersView
 * @extends {Component}
 * @property {Strig} sdk
 */
class UserForm extends Component {

    state = {
        loading: true,
        sending: false,
        deleting: false
    }

    /**
     * SDK instance
     *
     * @readonly
     * @memberof UserForm
     * @returns {FarmaSdk}
     */
    get sdk() { return this.props.sdk }

    load = () => {
        this.setState({ loading: true })
        this.sdk.getCurrentUser()
            .then(item => this.setState({ item }))
            .catch(error => console.error(error) || this.setState({ error }))
            .then(() => this.setState({ loading: false }))
    }

    componentDidMount = () => this.load()


    updateUser = e => {
        e && e.preventDefault()
        if (this.state.sending)
            return;
        const item = { ...this.state.item }

        this.setState({ sending: true })
        this.sdk.updateUser(item)
            .then(item => this.setState({ item, sending: false }))
            .catch(error => console.error(error) || this.setState({ error }))
    }


    render() {
        const { item } = this.state

        const fields = [
            ['name', 'Nome', { required: true }],
            ['email', 'Email', { required: true, type: 'email' }],
            // ['password', 'Senha', { type: 'password', helperText: 'Deixe em branco para ser mantido', autoComplete: 'off' }],
        ]

        return (
            <>
                <Header title="Dados Pessoais" backButton />
                <main>
                    {item && <>
                        <form method="post" onSubmit={this.updateUser}>
                            <Card style={{ margin: 10 }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5">Alterar informações pessoais</Typography>

                                    {fields.map(([field, label, args = {}, hidden], i) => !hidden &&
                                        <TextField
                                            key={field}
                                            autoFocus={i === 0}
                                            margin="dense"
                                            id={field}
                                            name={field}
                                            label={label}
                                            value={item[field] || ''}
                                            onChange={e => this.setState({ item: { ...item, [field]: e.target.value } })}
                                            type="text"
                                            fullWidth
                                            {...args}
                                        />
                                    )}

                                </CardContent>
                                <CardActions>
                                    <Button variant="contained" fullWidth size="large" type="submit" color="primary" disabled={this.sending}>Salvar</Button>
                                    <Button variant="outlined" fullWidth size="large" disabled={this.sending} onClick={this.dialogToggle}>Cancelar</Button>
                                </CardActions>
                            </Card>
                        </form>

                        <form method="post" autoComplete="off">
                            <Card style={{ margin: 10 }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5">Alterar Senha</Typography>

                                    <TextField
                                        margin="dense"
                                        id="password"
                                        name="old-password"
                                        label="Senha Antiga"
                                        type="password"
                                        fullWidth
                                        required
                                    />

                                    <TextField
                                        margin="dense"
                                        id="new-password"
                                        name="new-password"
                                        label="Nova Senha"
                                        type="password"
                                        fullWidth
                                        required
                                    />

                                    <TextField
                                        margin="dense"
                                        id="new-password-confirm"
                                        name="new-password-confirm"
                                        label="Confirmar nova senha"
                                        type="password"
                                        fullWidth
                                        required
                                    />

                                </CardContent>
                                <CardActions>
                                    <Button variant="contained" fullWidth size="large" type="submit" color="primary" disabled={this.sending}>Alterar Senha</Button>
                                    <Button variant="outlined" fullWidth size="large" disabled={this.sending} onClick={this.dialogToggle}>Cancelar</Button>
                                </CardActions>
                            </Card>
                        </form>
                    </>}
                </main>
            </>
        );
    }
}

export default withSdk()(withLogin(UserForm));