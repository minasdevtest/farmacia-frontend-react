import React, { useState } from 'react'
import { Tabs, Tab, Stepper, Step, StepLabel, StepContent, Typography as T, Button, Container } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { AddCircle as PlusIcon } from '@material-ui/icons';

export default function HomeInstructions() {
    const [tab, setTab] = useState(0)
    return (
        <>
            <Tabs centered value={tab} onChange={(_, i) => setTab(i)} indicatorColor="primary" textColor="primary" >
                <Tab label="Como doar medicamentos" />
                <Tab label="Como receber doações" />
            </Tabs>
            <Container maxWidth="sm">
                {tab === 0 &&
                    <Stepper orientation="vertical">
                        <Step active>
                            <StepLabel>Escolha os medicamentos</StepLabel>
                            <StepContent>
                                <T>Selecione medicamentos não violados como cartelas de remédio pela metade ou frascos lacrados.</T>
                                <T>Medicamentos líquidos já abertos não podem ser doados.</T>
                            </StepContent>
                        </Step>

                        <Step active>
                            <StepLabel>Busque um ponto de coleta</StepLabel>
                            <StepContent>
                                <T>Selecione um ponto de apoio próximo a você para levar as doações.</T>
                                <T> Verifique também o horário de funcionamento.</T>
                                <Button variant="contained" color="primary" component={Link} to="/place" >Ver pontos de apoio</Button>
                            </StepContent>
                        </Step>

                        <Step active>
                            <StepLabel>Entregue os medicamentos no local</StepLabel>
                            <StepContent>
                                <T>Os medicamentos serão avaliados e disponíveis para ajudar outras pessoas.</T>
                            </StepContent>
                        </Step>
                    </Stepper>
                }

                {tab === 1 &&
                    <Stepper orientation="vertical">
                        <Step active>
                            <StepLabel>Crie uma Conta</StepLabel>
                            <StepContent>
                                <T>Crie uma conta no sistema informando seus dados pessoais.</T>
                                <T>Caso já tenha uma, basta fazer login.</T>
                            </StepContent>
                        </Step>

                        <Step active>
                            <StepLabel>Faça um pedido de doação</StepLabel>
                            <StepContent>
                                <T>Busque na lista de medicamentos o qual necessita.</T>
                                <T> Clique no ícone de <PlusIcon color="primary" style={{verticalAlign: 'middle'}} />, selecione a quantidade e realize o pedido.</T>
                                <Button variant="contained" color="primary" component={Link} to="/medicine" >Ver medicamentos disponíveis</Button>
                            </StepContent>
                        </Step>

                        <Step active>
                            <StepLabel>Busque o medicamento no local</StepLabel>
                            <StepContent>
                                <T>Ao concluir o pedido, será informado o local e horário para coleta.</T>
                                <T>Basta buscar seu medicamento no horário disponível.</T>
                            </StepContent>
                        </Step>
                    </Stepper>
                }
            </Container>
        </>
    )
}
