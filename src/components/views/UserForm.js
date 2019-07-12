import React, { Component } from 'react';
import Header from '../Header';
import { Typography as T, Button, TextField, Card, CardContent, CardActions, Container, IconButton } from '@material-ui/core';
import { withSdk } from '../../lib/sdkContext';
import { withLogin } from '../LoginView';
import { preventDefault } from '../../lib/util';
import { Delete, Edit } from '@material-ui/icons';

/** @typedef {import('../../lib/farmaSDK').default} FarmaSdk */


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
     * @returns {FarmaSdk}
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
            ['cellphone', 'Telefone Celular', { type: 'tel', placeholder: '(XX) XXXXX-XXXX' }],
            ['phone', 'Telefone Fixo', { type: 'tel', placeholder: '(XX) XXXX-XXXX' }],
        ]

        return (
            <>
                <Header title="Dados Pessoais" backButton />
                <main>
                    {item &&
                        <Container>
                            <form method="put" onSubmit={preventDefault(this.updateUser)}>
                                <Card style={{ margin: "16px 0" }}>
                                    <CardContent>
                                        <T gutterBottom variant="h5">Alterar informações pessoais</T>

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

                            <Card style={{ margin: "16px 0" }}>
                                <CardContent>
                                    <T gutterBottom variant="h5">Endereços</T>
                                    <T>Cadastre endereços para busca de medicamentos em casa.</T>

                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {[0, 1, 2, 3, 4, 5].map(id =>
                                            <Card key={id} style={{ margin: 10 }}>
                                                <CardContent>
                                                    <T>Casa</T>
                                                    <T variant="body2">
                                                        Rua Estrada de Bicas, 461
                                                         <br />
                                                        Bairro Retiro
                                                    </T>
                                                </CardContent>
                                                <CardActions disableSpacing>
                                                    <IconButton>
                                                         <Edit />
                                                    </IconButton>
                                                    <IconButton>
                                                         <Delete />
                                                    </IconButton>
                                                </CardActions>
                                            </Card>
                                        )}
                                    </div>
                                    {/* <T color="textSecondary" style={{ margin: '20px 0' }} align="center">Nenhum endereço cadastrado.</T> */}

                                </CardContent>
                                <CardActions>
                                    <Button disabled={sending} variant="contained" fullWidth size="large" color="primary">Cadastrar Endereço</Button>
                                </CardActions>
                            </Card>


                            <form method="put" autoComplete="off" onSubmit={preventDefault(this.changePassword)}>
                                <Card style={{ margin: "16px 0" }}>
                                    <CardContent>
                                        <T gutterBottom variant="h5">Alterar Senha</T>

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

                            <Card style={{ margin: "16px 0" }}>
                                <CardContent>
                                    <T gutterBottom variant="h5">Deletar conta</T>
                                    <T gutterBottom>Esta ação é irreversível</T>

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
                        </Container>}
                </main>
            </>
        );
    }
}

export default withSdk()(withLogin(UserForm));