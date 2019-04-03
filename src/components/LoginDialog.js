
import React, { Component } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, DialogContentText } from '@material-ui/core';

export default class LoginDialog extends Component {
    state = {
        tab: 'login',
        email: '',
        password: '',
        name: ''
    }


    toggleTab = e => {
        this.stopEvent(e)
        this.setState({
            tab: this.state.tab === 'login' ? 'register' : 'login',
            password: '',
        })
    }

    onRegister = e => {
        this.stopEvent(e)
        const { email, password, name } = this.state
        this.props.onRegister({ email, password, name })
    }

    onLogin = e => {
        this.stopEvent(e)
        const { email, password } = this.state
        this.props.onLogin({ email, password })
    }

    stopEvent(event) {
        event && event.preventDefault()
    }

    render() {
        const { onLogin, onRegister, ...props } = this.props
        return (
            <div>
                <Dialog {...props}>
                    {this.state.tab === 'login' ?
                        <form onSubmit={this.onLogin}>
                            <DialogTitle>Identifique-se</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="email"
                                    label="Email"
                                    type="email"
                                    name="email"
                                    fullWidth
                                    value={this.state.email}
                                    onChange={e => this.setState({ email: e.target.value })}
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="password"
                                    label="Senha"
                                    type="password"
                                    name="password"
                                    fullWidth
                                    value={this.state.password}
                                    onChange={e => this.setState({ password: e.target.value })}
                                />
                                {this.props.userError &&
                                    <DialogContentText style={{ color: 'red' }}>{this.props.userError.data}</DialogContentText>}
                            </DialogContent>
                            <DialogActions>
                                <Button type="submit" color="primary">Entrar</Button>
                                <Button onClick={this.toggleTab}>Fazer Registro</Button>
                            </DialogActions>
                        </form>
                        :
                        <form onSubmit={this.onRegister}>
                            <DialogTitle>Registrar</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Nome"
                                    type="text"
                                    name="name"
                                    fullWidth
                                    value={this.state.name}
                                    onChange={e => this.setState({ name: e.target.value })}
                                />

                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="email"
                                    label="Email"
                                    type="email"
                                    name="email"
                                    fullWidth
                                    value={this.state.email}
                                    onChange={e => this.setState({ email: e.target.value })}
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="password"
                                    label="Senha"
                                    type="password"
                                    name="password"
                                    fullWidth
                                    value={this.state.password}
                                    onChange={e => this.setState({ password: e.target.value })}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button type="submit" color="primary">Cadastrar</Button>
                                <Button onClick={this.toggleTab}>Fazer Login</Button>
                            </DialogActions>
                        </form>}
                </Dialog>
            </div>
        )
    }
}
