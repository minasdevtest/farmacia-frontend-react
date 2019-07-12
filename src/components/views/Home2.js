import React from 'react'
import Header from 'components/Header';
import heroImage from "assets/hero-image.png";
import { makeStyles } from '@material-ui/styles';
import { Typography as T, Button, Container, useScrollTrigger, Grid } from '@material-ui/core';
import ContactForm from 'components/ContactForm';
import { Link } from 'react-router-dom'
import { NewsList } from './News';

const useStyles = makeStyles({
    hero: {
        height: '100vh',
        position: 'relative',
        zIndex: '0',
        overflow: 'hidden',
        '& > img': {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '-1',
            animation: 'heartbeat 2s infinite ease-out',
        }
    },
    heroOverlay: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.3)',
        color: '#fff',
        textAlign: 'center',
    },
    section: {
        padding: '60px 0',
    },
    transition: {
        transition: 'all 200ms ease-out'
    },

})

export default function Home() {
    const css = useStyles();
    const trigger = useScrollTrigger({ disableHysteresis: true, threshold: window.innerHeight - 100 })
    return (
        <>
            <Header position="fixed"
                className={css.transition}
                style={trigger ? undefined : { background: 'transparent', boxShadow: 'none' }}
                title={<span className={css.transition} style={{ opacity: Number(trigger) + '' }}>Farmácia Solidária</span>}
            />
            <main>
                <div className={css.hero}>
                    <img src={heroImage} alt="❤️" />
                    <div className={css.heroOverlay}>
                        <T variant="h1" gutterBottom>Farmácia Solidária</T>
                        <T variant="h5" gutterBottom>Com uma pequena ajuda você faz uma grande diferença</T>
                        <div>
                            <Button size="large" color="primary" variant="contained" component={Link} to="/medicine">Fazer Pedido</Button>
                            <Button size="large" variant="outlined" color="inherit" style={{ marginLeft: 10 }} component={Link} to="/place">Pontos de doação</Button>
                        </div>
                    </div>
                </div>
                <section className={css.section} style={{background: '#fff'}}>
                    <Container>
                        <Grid container>
                            <Grid item xs={6}>
                                <T variant="h5">Seus medicamentos podem salvar vidas</T>
                                <T>Os medicamentos que você não usou podem ajudar muitas pessoas</T>
                            </Grid>
                            <Grid item xs={6}>

                            </Grid>
                        </Grid>
                    </Container>
                </section>

                <section className={css.section}>
                    <Container>
                        <Grid container alignItems="center">
                            <Grid item xs={6}>
                                <T variant="h2">Notícias</T>
                            </Grid>
                            <Grid item xs={6}>
                                <NewsList />
                            </Grid>
                        </Grid>
                    </Container>
                </section>

                <section className={css.section} style={{ background: 'lightgray' }}>
                    <Container>
                        <T variant="h4">Entre em Contato</T>
                        <T>Tire suas dúvidas ou dê sua opinião</T>

                        <ContactForm>
                            {(fields, loading) => <>
                                {fields}
                                <Button style={{ marginTop: 10 }} disabled={loading} type="submit" fullWidth size="large" color="primary" variant="contained">Enviar</Button>
                            </>}
                        </ContactForm>
                    </Container>
                </section>
            </main>
            <footer style={{ padding: '5px 0', background: '#1f2933', color: '#FFF' }}>
                <Container>
                    <T align="center">Farmácia solidária - 2019</T>
                </Container>
            </footer>
        </>
    )
}
