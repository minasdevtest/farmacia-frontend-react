import React, { Component } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import 'typeface-roboto'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import { theme } from './settings'
import UpdateHandler from 'components/UpdateHandler'
import Home from 'components/views/Home';
// import Home from 'components/views/Home2';
import About from 'components/views/About';
import News from 'components/views/News';
import NewsSingle from 'components/views/NewsSingle';
import PontosApoio from 'components/views/PontosApoio';
import MedicinesView from 'components/views/Medicines';
import { AuthContextProvider } from 'lib/authContext';
import { SdkContextProvider } from 'lib/sdkContext';
import UsersView from 'components/views/Users';
import NotFound from 'components/views/NotFound';
import UserForm from 'components/views/UserForm';
import ContactView from 'components/views/ContactView';
import SacView from 'components/views/SacView';

class App extends Component {
    render() {
        return (
            <SdkContextProvider>
                <AuthContextProvider>
                    <Router>
                        <MuiThemeProvider theme={theme}>
                            <UpdateHandler appServiceWorker={this.props.appServiceWorker}>
                                <Switch>
                                    <Route exact path="/" component={Home} />
                                    <Route exact path="/about" component={About} />
                                    <Route exact path="/news" component={News} />
                                    <Route exact path="/news/:id" component={NewsSingle} />
                                    <Route exact path="/news/:id" component={NewsSingle} />
                                    <Route exact path="/place" component={PontosApoio} />
                                    <Route exact path="/medicine" component={MedicinesView} />
                                    <Route exact path="/contact" component={ContactView} />
                                    <Route exact path="/user" component={UsersView} />
                                    <Route exact path="/sac" component={SacView} />
                                    <Route exact path="/me" component={UserForm} />
                                    <Route path="/" component={NotFound} />
                                </Switch>
                            </UpdateHandler>
                        </MuiThemeProvider>
                    </Router>
                </AuthContextProvider>
            </SdkContextProvider>
        );
    }
}

export default App;
