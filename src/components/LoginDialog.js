
import React, { Component } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, DialogContentText, CircularProgress } from '@material-ui/core';
import { withAuth } from '../lib/authContext';

class LoginDialog extends Component {
    state = {
        tab: 'login',
        email: '',
        password: '',
        name: '',
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
        const { onLogin, onRegister, error, user, loading, ...props } = this.props
        const isLogin = this.state.tab === 'login'
        return (
            <div>
                <Dialog open={Boolean(user)} {...props}>
                    <form onSubmit={isLogin ? this.onLogin : this.onRegister}>
                        <DialogTitle>{isLogin ? 'Identifique-se' : 'Registrar'}</DialogTitle>
                        <DialogContent>
                            <TextField
                                required
                                autoFocus
                                disabled={loading}
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
                                required
                                autoFocus
                                disabled={loading}
                                margin="dense"
                                id="password"
                                label="Senha"
                                type="password"
                                name="password"
                                fullWidth
                                value={this.state.password}
                                onChange={e => this.setState({ password: e.target.value })}
                            />

                            {!isLogin &&
                                <TextField
                                    required
                                    autoFocus
                                    disabled={loading}
                                    margin="dense"
                                    id="name"
                                    label="Nome"
                                    type="text"
                                    name="name"
                                    fullWidth
                                    value={this.state.name}
                                    onChange={e => this.setState({ name: e.target.value })}
                                />
                            }

                            {error &&
                                <DialogContentText style={{ color: 'red' }}>{error.data}</DialogContentText>}
                        </DialogContent>
                        <DialogActions>
                            {loading && <CircularProgress size={28} />}
                            <Button disabled={loading} type="submit" color="primary">
                                {isLogin ? 'Entrar' : 'Cadastrar'}
                            </Button>
                            <Button disabled={loading} onClick={this.toggleTab}>
                                {isLogin ? 'Fazer Registro' : 'Fazer Login'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        )
    }
}


export default withAuth(
    ({ login, userError: error, user, loading = false }) => ({
        onLogin: ({ email, password }) => login(email, password),
        onRegister: console.info,
        error, user, loading,
    })
)(LoginDialog)