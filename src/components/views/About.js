import React, { Component, Fragment } from 'react';
import Header from '../Header';
import { Typography } from '@material-ui/core';

class About extends Component {
    render() {
        return (
            <Fragment>
                <Header title="Sobre" backButton />
                <main>
                    <Typography gutterBottom>
                        APP em desenvolvimento.
                    <a href="http://github.com/minas-dev-test/farmacia-frontend-react">
                    Visitar repositório
                    </a>
                    </Typography>
                </main>
            </Fragment>
        );
    }
}

export default About;