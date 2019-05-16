import React, { Component } from 'react';
import Header from '../Header';
import { Typography, Button, TextField, Card, CardContent, CardActions } from '@material-ui/core';
import { withSdk } from '../../lib/sdkContext';
import { withLogin } from '../LoginView';
import { preventDefault } from '../../lib/util';

/** @typedef {import('../../lib/farmaSDK').default} FarmaSDK */


/**
 * Current User handler
 * TODO: ADD route for user edit and password
 * @class UsersView
 * @extends {Component}
 * @property {Strig} sdk
 */
class UserForm extends Component {

    state = {
        sending: false,
        item: null,
        passwordChange: {
            password: '',
            confirmation: ''
        }
    }

    /**
     * SDK instance
     *
     * @readonly
     * @memberof UserForm
     * @returns {FarmaSDK}
     */
    get sdk() { return this.props.sdk }

    load = () => {
        this.setState({ sending: true })
        this.sdk.getAccount()
            .then(item => this.setState({ item }))
            .catch(error => console.error(error) || this.setState({ error }))
            .then(() => this.setState({ sending: false }))
    }

    componentDidMount = () => this.load()

    updateUser = () => {
        if (this.state.sending) return;
        const item = { ...this.state.item }

        this.setState({ sending: true })
        this.sdk.updateUser(item)
            .then(item => this.setState({ item, sending: false }))
            .catch(error => console.error(error) || this.setState({ error }))
    }

    changePassword = () => {
        if (this.state.sending) return;

        const { password, confirmation } = this.state.passwordChange

        if (password !== confirmation)
            return this.setState({ error: { confirmation: true } })

        this.setState({ sending: true, error: null })

        this.sdk.updateAccountPassword({ password })
            .then(() => this.setState({
                sending: false,
                passwordChange: {
                    password: '',
                    confirmation: ''
                }
            }))
            .catch(error => console.error(error) || this.setState({ error }))
    }

    deleteUser = () => {
        this.setState({ sending: true })
        this.sdk.deleteAccount()
            .then(() => this.setState({ sending: false }))
            .catch(error => console.error(error) || this.setState({ error }))
    }

    render() {
        const { passwordChange, item, error, sending } = this.state

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
                        <form method="put" onSubmit={preventDefault(this.updateUser)}>
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
                                            disabled={sending}
                                            {...args}
                                        />
                                    )}

                                </CardContent>
                                <CardActions>
                                    <Button disabled={sending} variant="contained" fullWidth size="large" type="submit" color="primary">Salvar</Button>
                                </CardActions>
                            </Card>
                        </form>

                        <form method="put" autoComplete="off" onSubmit={preventDefault(this.changePassword)}>
                            <Card style={{ margin: 10 }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5">Alterar Senha</Typography>

                                    <TextField
                                        margin="dense"
                                        id="new-password"
                                        name="new-password"
                                        label="Nova Senha"
                                        type="password"
                                        fullWidth
                                        required
                                        disabled={sending}
                                        value={passwordChange.password}
                                        onChange={e => this.setState({ passwordChange: { ...passwordChange, password: e.target.value } })}
                                    />

                                    <TextField
                                        margin="dense"
                                        id="new-password-confirm"
                                        name="new-password-confirm"
                                        label="Confirmar nova senha"
                                        type="password"
                                        fullWidth required
                                        disabled={sending}
                                        value={passwordChange.confirmation}
                                        onChange={e => this.setState({ passwordChange: { ...passwordChange, confirmation: e.target.value } })}
                                        error={error && error.confirmation}
                                        helperText={error && error.confirmation && 'Senha diferente!'}
                                    />

                                </CardContent>
                                <CardActions>
                                    <Button disabled={sending} variant="contained" fullWidth size="large" type="submit" color="primary">Alterar Senha</Button>
                                </CardActions>
                            </Card>
                        </form>

                        <Card style={{ margin: 10 }}>
                            <CardContent>
                                <Typography gutterBottom variant="h5">Deletar conta</Typography>
                                <Typography gutterBottom>Esta ação é irreversível</Typography>

                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    color="primary"
                                    disabled={sending}
                                    onClick={this.deleteUser}>Deletar minha conta</Button>
                            </CardActions>
                        </Card>
                    </>}
                </main>
            </>
        );
    }
}

export default withSdk()(withLogin(UserForm));