import React from 'react'
import Header from 'components/Header';
import heroImage from "assets/hero-image.png";
import { makeStyles } from '@material-ui/styles';
import { Typography as T, Button, Container } from '@material-ui/core';
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
    }
})

export default function Home() {
    const css = useStyles();
    return (
        <>
            <Header position="fixed" style={{ background: 'transparent', boxShadow: 'none' }} title="Farmácia solidária" />
            <main>
                <div className={css.hero}>
                    <img src={heroImage} alt="❤️" />
                    <div className={css.heroOverlay}>
                        <T variant="h1" gutterBottom>Farmácia Solidária</T>
                        <T variant="h5" gutterBottom>Com uma pequena ajuda você faz uma grande diferença</T>
                        <div>
                            <Button size="large" color="primary" variant="contained">Fazer Pedido</Button>
                            <Button size="large" variant="outlined" color="inherit" style={{marginLeft: 10}}>Pontos de doação</Button>
                        </div>
                    </div>
                </div>
                <div className={''}>
                    <Container>
                        <T variant="h2">Seus medicamentos podem salvar vidas</T>
                        <T>Os medicamentos que você não usou podem ajudar muitas pessoas</T>
                    </Container>
                </div>

                <div>
                    <Container>
                        <T variant="h2">Seus medicamentos podem salvar vidas</T>
                        <T>Os medicamentos que você não usou podem ajudar muitas pessoas</T>
                    </Container>
                </div>
            </main>
        </>
    )
}
