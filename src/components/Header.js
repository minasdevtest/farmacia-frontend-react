import React, { Component } from 'react';
import { withStyles, IconButton, Typography, Toolbar, AppBar } from '@material-ui/core'
import {
    ArrowBack as ArrowBackIcon,
} from '@material-ui/icons'


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

    goBack = () => window.history.back()

    render() {
        const { children, classes, title, backButton = false, onBack, rightAction, appBarProps, ...props } = this.props

        return (
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

                    {rightAction && <div>{rightAction}</div>}
                </Toolbar>
                {children}
            </AppBar>
        )
    }

}

export default withStyles(styles)(Header);
