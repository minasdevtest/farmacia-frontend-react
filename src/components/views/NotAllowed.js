import React, { Component, Fragment } from 'react';
import Header from '../Header';
import { Card, CardContent, Button, CardActions } from '@material-ui/core';
import { Link } from 'react-router-dom'

class NotAllowed extends Component {
    render() {
        return (
            <Fragment>
                <Header title="Permissão Negada" />
                <main>
                    <Card style={{ margin: 10 }}>
                        <CardContent>
                            <p>
                                Você não tem permissão para acessar este conteúdo
                            </p>
                        </CardContent>
                        <CardActions>
                            <Button component={Link} to="" size="large" variant="contained" color="primary">Início</Button>
                        </CardActions>
                    </Card>

                </main>
            </Fragment>
        );
    }
}

export default NotAllowed;