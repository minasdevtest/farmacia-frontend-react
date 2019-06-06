import React, { Component, Fragment } from 'react';
import Header from '../Header';
import { Typography as T, Card, CardContent, CardActions, Button, Container } from '@material-ui/core';
import FormFields from 'components/FormFields';
import { preventDefault } from 'lib/util';

const fields = [
    ['name', 'Nome', { required: true }],
    ['email', 'Email', { required: true, type: 'email' }],
    ['phone', 'Telefone', { type: 'tel', placeholder: '(XX) XXXX-XXXX' }],
    ['message', 'Mensagem', { multiline: true, placeholder: '(XX) XXXX-XXXX' }],
]

class ContactView extends Component {

    state = {
        contact: {}
    }

    render() {
        const { contact } = this.state
        return (
            <Fragment>
                <Header title="Contato" backButton />
                <main>
                    <form method="post" onSubmit={preventDefault()}>
                        <Container >
                            <Card style={{ margin: "10px 0", overflow: 'auto' }}>
                                <CardContent>
                                    <T gutterBottom variant="h5">Entre em contato</T>
                                    <T variant="body2" color="textSecondary">Disponibilizamos o formulário abaixo para que você envie suas dúvidas, sugestões ou críticas para nós.</T>
                                    <FormFields fields={fields} values={contact}
                                        onChange={(field, value) => this.setState({ contact: { ...contact, [field]: value } })} />
                                </CardContent>
                                <CardActions>
                                    <Button type="submit" variant="contained" color="primary" fullWidth>Enviar</Button>
                                </CardActions>
                            </Card>
                        </Container>
                    </form>
                </main>
            </Fragment>
        );
    }
}

export default ContactView;