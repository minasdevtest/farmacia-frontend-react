import React, { Component } from 'react';
import { withStyles, IconButton, Typography, Toolbar, AppBar, Button, Menu, MenuItem } from '@material-ui/core'
import { ArrowBack as ArrowBackIcon, AccountCircle } from '@material-ui/icons'
import { withAuth } from '../lib/authContext';
import LoginDialog from './LoginDialog';
import { Link } from 'react-router-dom'


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

    state = { loginDialogOpen: false, userMenuOpen: null }

    goBack = () => window.history.back()

    static getDerivedStateFromProps({ user }, { userMenuOpen, loginDialogOpen }) {
        const stateUpdate = {}
        if (!user && userMenuOpen)
            stateUpdate.userMenuOpen = null
        if (user && loginDialogOpen)
            stateUpdate.loginDialogOpen = false

        return Object.keys(stateUpdate).length ? stateUpdate : null
    }

    render() {
        const { simple, children, classes, title, backButton = false, onBack, rightAction, appBarProps, user, onLogout, ...props } = this.props

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
                            {!simple && (
                                user ?
                                    <>
                                        <IconButton color="inherit" onClick={e => this.setState({ userMenuOpen: e.target })}>
                                            <AccountCircle />
                                        </IconButton>
                                        <Menu
                                            anchorEl={this.state.userMenuOpen}
                                            open={Boolean(this.state.userMenuOpen)}
                                            onClose={() => this.setState({ userMenuOpen: null })}
                                        >
                                            <MenuItem disabled>Logado como {' ' + user.name.split(' ').slice(0, 2).join(' ')}</MenuItem>
                                            <MenuItem to="/me" component={Link} >Editar Conta</MenuItem>
                                            <MenuItem onClick={onLogout}>Sair</MenuItem>
                                        </Menu>
                                    </> :
                                    <Button color="inherit" onClick={() => this.setState({ loginDialogOpen: true })}>Fazer Login</Button>
                            )}

                            {rightAction}
                        </div>
                    </Toolbar>
                    {children}
                </AppBar>

                <LoginDialog open={this.state.loginDialogOpen} onClose={() => this.setState({ loginDialogOpen: false })} />

            </>
        )
    }

}

export default withAuth(
    ({ logout: onLogout, user }) => ({ onLogout, user })
)(withStyles(styles)(Header));
