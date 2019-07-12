import React, { Component } from 'react';
import Header from '../Header';
import { List, ListItem, ListItemText, Card, Container } from '@material-ui/core';
import { Link } from 'react-router-dom'
import { WithRoles } from '../../lib/authHOC';

class Home extends Component {
    render() {
        return (
            <>
                <Header
                    title={<>Farmácia solidária<WithRoles roles="admin"><small>{' - Admin'}</small></WithRoles></>}
                />
                <main>
                    <Container>
                        <Card style={{ margin: "10px 0" }}>
                            <List component="nav">

                                <ListItem button component={Link} to="medicine">
                                    <ListItemText primary="Medicamentos" secondary="Veja medicamentos disponíveis" />
                                </ListItem>

                                <ListItem button component={Link} to="place">
                                    <ListItemText
                                        primary="Pontos de Apoio"
                                        secondary="Confira os pontos para realizar sua doação." />
                                </ListItem>

                                <ListItem button component={Link} to="news">
                                    <ListItemText primary="Notícias" secondary="Veja as últimas notícias" />
                                </ListItem>

                                <WithRoles roles="admin">
                                    <ListItem button component={Link} to="user">
                                        <ListItemText primary="Usuários" secondary="Cadastre e gerencie usuários" />
                                    </ListItem>
                                    <ListItem button component={Link} to="sac">
                                        <ListItemText primary="SAC" secondary="Responda dúdivas de usuários" />
                                    </ListItem>
                                </WithRoles>

                                <ListItem button component={Link} to="about">
                                    <ListItemText primary="Sobre" secondary="Saiba mais sobre o aplicativo" />
                                </ListItem>

                                <ListItem button component={Link} to="contact">
                                    <ListItemText primary="Contato" secondary="Entre em contato e tire suas Dúvidas" />
                                </ListItem>

                            </List>
                        </Card>
                    </Container>
                </main>
            </>
        );
    }
}

export default Home;