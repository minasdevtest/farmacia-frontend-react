import React, { Component } from 'react'
import FarmaSdk from './farmaSDK';

export const AuthContext = React.createContext({
    user: null, error: null, login: () => { }, logout: () => { }
})

export class AuthContextProvider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: this.client.session && this.client.session.user,
            error: null
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
        this.client.on('logout', this.handleUserLogin)
    }

    componentWillUnmount() {
        this.client.off('login', this.handleUserLogin)
        this.client.off('logout', this.handleUserLogin)
    }

    handleLogin = (...args) => {
        this.setState({ error: null })
        this.client
            .login(...args)
            .catch(err => this.setState({ error: err.response }))
    }

    render() {
        const { client } = this
        return (
            <AuthContext.Provider value={{
                user: this.state.user,
                userError: this.state.error,
                login: this.handleLogin,
                logout: () => this.client.logout(),
            }}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

export const withAuth =
    (mapProps = props => props) =>
        Component =>
            props => (
                <AuthContext.Consumer>
                    {context => <Component {...props} {...mapProps(context)} />}
                </AuthContext.Consumer>
            )