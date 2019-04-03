import React, { Component } from 'react';
import { withStyles, IconButton, Typography, Toolbar, AppBar, Button } from '@material-ui/core'
import {
    ArrowBack as ArrowBackIcon,
} from '@material-ui/icons'
import { withAuth } from '../lib/authContext';
import LoginDialog from './LoginDialog';


const styles = {
    root: {
        // paddingTop: 64
    },
    flex: {
        flex: 1,
    },
    menuButtonWrapper: {
        marginLeft: -12,
        marginRight: 20,
    },
}

class Header extends Component {

    state = { loginDialogOpen: false }

    goBack = () => window.history.back()

    render() {
        const { children, classes, title, backButton = false, onBack, rightAction, appBarProps, user, userError, onLogin, onLogout, ...props } = this.props

        return (
            <>
                <AppBar position="sticky" {...appBarProps} {...props}>
                    <Toolbar>
                        <div className={classes.menuButtonWrapper}>
                            {(onBack || backButton) &&
                                <IconButton color="inherit" aria-label="Menu" onClick={onBack || this.goBack}>
                                    <ArrowBackIcon />
                                </IconButton>}
                        </div>

                        {title &&
                            <Typography variant="title" color="inherit" className={classes.flex}>
                                {title}
                            </Typography>
                        }

                        <div>
                            {user ?
                                <Button color="inherit" onClick={onLogout}>Desconectar de {user.name}</Button> :
                                <Button color="inherit" onClick={() => this.setState({ loginDialogOpen: true })}>Fazer Login</Button>}
                            {rightAction}
                        </div>
                    </Toolbar>
                    {children}
                </AppBar>

                <LoginDialog
                    open={user === null && this.state.loginDialogOpen}
                    userError={userError}
                    onClose={() => this.setState({ loginDialogOpen: false })}
                    onLogin={onLogin}
                    onRegister={console.info}
                />

            </>
        )
    }

}

export default withAuth(
    ({ login, logout, ...props }) => ({
        onLogin: ({ email, password }) => login(email, password),
        onLogout: logout,
        ...props
    })
)(withStyles(styles)(Header));
