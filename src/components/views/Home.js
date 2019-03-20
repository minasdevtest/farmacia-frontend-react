import React, { Component, Fragment } from 'react';
import Header from '../Header';
import { Typography, Button, List, ListItem, ListItemText, Card } from '@material-ui/core';
import { Link } from 'react-router-dom'

class Home extends Component {
    render() {
        return (
            <Fragment>
                <Header title="Farmácia solidária" />
                <main>
                    <Card style={{margin: 10}}>
                        <List component="nav">

                            <ListItem button component={Link} to="medicine">
                                <ListItemText primary="Medicamentos" secondary="Veja medicamentos disponíveis" />
                            </ListItem>

                            <ListItem button component={Link} to="place">
                                <ListItemText
                                    primary="Pontos de Apoio"
                                    secondary="Confira os pontos para doação e coleta" />
                            </ListItem>

                            <ListItem button component={Link} to="news">
                                <ListItemText primary="Notícias" secondary="Veja as últimas notícias" />
                            </ListItem>


                            <ListItem button component={Link} to="about">
                                <ListItemText primary="Sobre" secondary="Saiba mais sobre o aplicativo" />
                            </ListItem>

                        </List>
                    </Card>

                </main>
            </Fragment>
        );
    }
}

export default Home;