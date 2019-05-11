import React, { Component } from 'react'
import FarmaSdk from './farmaSDK';

export const AuthContext = React.createContext({
    user: null, userError: null, login: () => { }, logout: () => { }
})

export class AuthContextProvider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: this.client.session && this.client.session.user,
            error: null,
            loading: false,
        }
    }
    get client() {
        return FarmaSdk.instance()
    }

    handleUserLogin = (user = null) => {
        console.log('Change login', user)
        this.setState({ user })
    }

    componentDidMount() {
        this.client.on('login', this.handleUserLogin)
        this.client.on('updateUser', this.handleLogin)
        this.client.on('logout', this.handleUserLogin)
    }

    componentWillUnmount() {
        this.client.off('login', this.handleUserLogin)
        this.client.off('updateUser', this.handleLogin)
        this.client.off('logout', this.handleUserLogin)
    }

    handleLogin = (...args) => {
        this.setState({ error: null, loading: true })
        this.client
            .login(...args)
            .catch(err => this.setState({ error: err.response }))
            .then(() => this.setState({ loading: false }))
    }

    handleLogout = () => this.client.logout()

    render() {
        const { user, loading, error: userError } = this.state
        return (
            <AuthContext.Provider value={{
                user, userError, loading,
                login: this.handleLogin,
                logout: this.handleLogout,
            }}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}
/**
 * HOC for using auth
 * 
 * @param {Function} mapProps 
 * @param {React.Component} fallback 
 */
export const withAuth =
    (mapProps = context => context, fallback = null) =>
        Component =>
            props =>
                <AuthContext.Consumer>
                    {context => <Component {...props} {...mapProps(context)} />}
                </AuthContext.Consumer>