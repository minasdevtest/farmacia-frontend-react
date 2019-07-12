import React, { Fragment } from 'react';
import Header from '../Header';
import { Typography as T, Card, CardContent, CardActions, Button, Container } from '@material-ui/core';
import Loader from 'components/Loader';
import ContactForm from 'components/ContactForm';

function ContactView() {
    return (
        <Fragment>
            <Header title="Contato" backButton />
            <main>
                <ContactForm>
                    {(fields, loading) => <>
                        {loading && <Loader />}

                        <Container>
                            <Card style={{ margin: "10px 0", overflow: 'auto' }}>
                                <CardContent>
                                    <T gutterBottom variant="h5">Entre em contato</T>
                                    <T variant="body2" color="textSecondary">Disponibilizamos o formulário abaixo para que você envie suas dúvidas, sugestões ou críticas para nós.</T>
                                    {fields}
                                </CardContent>
                                <CardActions>
                                    <Button disabled={loading} type="submit" variant="contained" color="primary" fullWidth>Enviar</Button>
                                </CardActions>
                            </Card>
                        </Container>
                    </>}
                </ContactForm>
            </main>
        </Fragment>
    );
}

export default ContactView;