import React, { Component } from 'react';
import Header from '../Header';
import { Typography, CircularProgress, Card, CardContent, CardMedia, CardActionArea, CardActions, Button, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import FarmaSdk from '../../farmaSDK'

class PontosApoio extends Component {
    constructor(props) {
        super(props);
        this.sdk = FarmaSdk.instance()
        this.state = {
            loading: true
        }
    }

    load() {
        this.setState({ loading: true })
        this.sdk.location()
            .then(items => this.setState({ items }))
            .catch(error => console.error(error) || this.setState({ error }))
            .then(() => this.setState({ loading: false }))
    }

    componentDidMount() {
        this.load()
    }

    render() {
        return (
            <>
                <Header title="Pontos de Apoio" backButton />
                <main>
                    <form onSubmit={e => e.preventDefault()} style={{ padding: 20 }}>
                        <TextField type="search" name="pesquisa"
                            fullWidth style={{ marginBottom: 10 }}
                            placeholder="Digite um texto de pesquisa..." />
                        <Button fullWidth component="button" type="submit" variant="raised"
                        style={{ marginBottom: 10 }}
                            color="primary">Ver no Google Maps</Button>
                             <Button fullWidth component="button" type="submit" variant="raised"
                            color="secondary">Cadastrar novo endereço</Button>
                    </form>

                    {this.state.loading ? <CircularProgress /> :
                        this.state.items.map(item =>
                            <Card component="article" key={item.id}
                                style={{ maxWidth: 480, margin: '10px auto' }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {item.nome}
                                    </Typography>

                                    <Typography component="address">
                                        <p>{item.rua}, {item.numero} {item.complemento}</p>
                                        <p>{item.pnt_referencia}</p>
                                        <p>{item.cidade}, {item.estado}</p>

                                        <dl>
                                            <dt>CEP</dt>
                                            <dd>{item.cep}</dd>

                                            <dt>Funcionamento</dt>
                                            <dd>{item.hora_Abertura} - {item.hora_Fechamento}</dd>

                                            <dt>CEP</dt>
                                            <dd>{item.cep}</dd>
                                        </dl>
                                    </Typography>
                                    <CardActions>
                                        <Button variant="raised" color="primary">Ver no Google Maps</Button>
                                    </CardActions>
                                </CardContent>
                            </Card>
                        )}
                </main>
            </>
        );
    }
}

export default PontosApoio;