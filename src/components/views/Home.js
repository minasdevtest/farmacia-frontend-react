import React, { Component, Fragment } from 'react';
import Header from '../Header';
import { Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom'

class Home extends Component {
    render() {
        return (
            <Fragment>
                <Header title="Farmácia solidária" />
                <main>
                    <Typography gutterBottom>
                        Demonstração
                    </Typography>
                    <p>
                        <Button component={Link} to="news" variant="contained" color="secondary" >Notícias</Button>
                    </p>

                    <p>
                        <Button component={Link} to="place" variant="contained" color="secondary" >Pontos de Apoio</Button><br />
                    </p>
                    <p>
                        <Button component={Link} to="about" variant="contained" color="secondary" >Sobre</Button><br />

                    </p>
                </main>
            </Fragment>
        );
    }
}

export default Home;