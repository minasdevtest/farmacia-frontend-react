/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment } from 'react'
import Header from 'components/Header';
import { List, ListItemText, ListItem, Container, Divider, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, ListItemAvatar, Avatar, CircularProgress } from '@material-ui/core';
import { useSdk } from 'lib/sdkContext';
import Loader from 'components/Loader';
import { Email as EmailIcon, Phone as PhoneIcon } from '@material-ui/icons';

export default function SacView() {
    const [questions, setQuestions] = useState(null)
    const [activePerson, setActivePerson] = useState(null)
    const { sac } = useSdk()
    useEffect(() => {
        sac.get().then(q => setQuestions(q))
    }, [])
    console.log(questions)
    return (
        <>
            <Header backButton title="SAC" />
            <main>
                {!questions ? <Loader /> :
                    <Container>
                        <Paper style={{ marginTop: 10 }}>
                            <List>
                                {questions && questions.map((person, i) =>
                                    <Fragment key={person.id}>
                                        {i !== 0 && <Divider variant="inset" />}

                                        <ListItem button onClick={() => setActivePerson(person)}>
                                            <ListItemAvatar>
                                                <Avatar>{person.nomeDoUsuario[0]}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={person.nomeDoUsuario} secondary={person.email} />
                                        </ListItem>
                                    </Fragment>
                                )}
                                {questions && !questions.length &&
                                    <ListItem>
                                        <ListItemText primary="Sem perguntas." />
                                    </ListItem>}
                            </List>
                        </Paper>
                    </Container>
                }
            </main>
            <SacDialog person={activePerson} onClose={() => setActivePerson(null)} />
        </>
    )
}


function SacDialog({ person, ...props }) {
    return (
        <Dialog fullWidth open={Boolean(person)} {...props}>
            {!person ? <DialogContent><CircularProgress /></DialogContent> : <>
                <DialogTitle>Dúvida de {person.nomeDoUsuario}</DialogTitle>
                <DialogContent>
                    {person.mensagem.split("\n").map((line, i) =>
                        <DialogContentText key={i}>{line}</DialogContentText>)}
                </DialogContent>
                <Divider />
                <List disablePadding component="nav">
                    <ListItem button component="a" target="_blank" href={`mailto:${person.email}?subject=Contato - Farmácia Solidária&body=Resposta ao contato realizado por ${person.nomeDoUsuario}`}>
                        <ListItemAvatar>
                            <Avatar>
                                <EmailIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={person.email} secondary="Responder por Email" />
                    </ListItem>
                    <Divider variant="inset" />
                    <ListItem button component="a" target="_blank" href={`mailto:${person.telefone}`}>
                        <ListItemAvatar>
                            <Avatar>
                                <PhoneIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={person.telefone} secondary="Telefonar" />
                    </ListItem>
                </List>
            </>}
        </Dialog>
    )
}