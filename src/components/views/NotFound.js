import React, { Component, Fragment } from 'react';
import Header from '../Header';
import { Card, CardContent } from '@material-ui/core';
import { Link } from 'react-router-dom'

class NotFound extends Component {
    render() {
        return (
            <Fragment>
                <Header title="Página não encontrada" />
                <main>
                    <Card style={{ margin: 10 }}>
                        <CardContent>
                            <p>
                                não há nada aqui
                            </p>
                            <Link to="">Voltar</Link>
                        </CardContent>
                    </Card>

                </main>
            </Fragment>
        );
    }
}

export default NotFound;