import React, { Component, Fragment } from 'react';
import Header from '../Header';
import { Typography as T, Card, CardContent, CardActions, Button, Container, Snackbar } from '@material-ui/core';
import FormFields from 'components/FormFields';
import { preventDefault, toggleState } from 'lib/util';
import { withSdk } from 'lib/sdkContext';

/** @typedef {import('lib/farmaSDK').default} FarmaSdk */


const fields = [
    ['name', 'Nome', { required: true }],
    ['email', 'Email', { required: true, type: 'email' }],
    ['phone', 'Telefone', { type: 'tel', placeholder: '(XX) XXXX-XXXX' }],
    ['message', 'Mensagem', { multiline: true, placeholder: 'Insira sua dúvida ou opinião...' }],
]

class ContactView extends Component {

    state = {
        contact: {},
        loading: false,
        sent: false
    }

    /**
     * @readonly
     * @returns {FarmaSdk} Instance
     * @memberof ContactView
     */
    get sdk() {
        return this.props.sdk
    }

    toggleLoading = toggleState(this, 'loading')

    handleSubmit = () => {
        this.toggleLoading()
        this.sdk.sac.add(this.state.contact)
            .then(() => this.setState({ contact: {}, sent: true }))
            .catch(console.error)
            .then(this.toggleLoading)
    }

    render() {
        const { contact, loading, sent } = this.state
        console.warn(this.state)
        return (
            <Fragment>
                <Header title="Contato" backButton />
                <main>
                    <form method="post" onSubmit={preventDefault(this.handleSubmit)}>
                        <Container >
                            <Card style={{ margin: "10px 0", overflow: 'auto' }}>
                                <CardContent>
                                    <T gutterBottom variant="h5">Entre em contato</T>
                                    <T variant="body2" color="textSecondary">Disponibilizamos o formulário abaixo para que você envie suas dúvidas, sugestões ou críticas para nós.</T>
                                    <FormFields disabled={loading} fields={fields} values={contact}
                                        onChange={(field, value) => this.setState({ contact: { ...contact, [field]: value } })} />
                                </CardContent>
                                <CardActions>
                                    <Button disabled={loading} type="submit" variant="contained" color="primary" fullWidth>Enviar</Button>
                                </CardActions>
                            </Card>
                        </Container>
                    </form>
                    <Snackbar
                        message="Mensagem enviada!"
                        autoHideDuration={6000}
                        open={sent}
                        onClose={() => this.setState({ sent: false })} />
                </main>
            </Fragment>
        );
    }
}

export default withSdk()(ContactView);