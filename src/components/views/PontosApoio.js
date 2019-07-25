import React, { Component } from 'react';
import Header from '../Header';
import { Typography as T, Button, TextField, Table, TableRow, TableBody, TableCell, TableHead, Paper, Fab, Dialog, DialogContent, DialogContentText, DialogActions, IconButton, Slide, Container } from '@material-ui/core';
import FarmaSdk from '../../lib/farmaSDK'
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Close as CloseIcon } from '@material-ui/icons';
import { withLogin } from '../LoginView';
import { WithRoles } from '../../lib/authHOC';
import Loader from 'components/Loader';

class PontosApoio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            items: [],
            newItem: {},
            newItemOpen: false,
            sending: false,
            deleting: false,
            loadingCep: false,
        }
    }

    /**
     * SDK instance
     *
     * @readonly
     * @memberof PontosApoio
     * @returns {FarmaSdk}
     */
    get sdk() {
        return FarmaSdk.instance()
    }

    load = () => {
        this.setState({ loading: true })
        this.sdk.location()
            .then(items => this.setState({ items }))
            .catch(error => console.error(error) || this.setState({ error }))
            .then(() => this.setState({ loading: false }))
    }

    componentDidMount() {
        this.load()
    }

    dialogToggle = () => this.setState({
        newItemOpen: !this.state.newItemOpen,
        newItem: this.state.newItemOpen ? {} : this.state.newItem
    })

    createItem = e => {
        e && e.preventDefault()
        if (this.state.sending)
            return;
        this.setState({ sending: true })
        this.sdk.saveLocation(this.state.newItem)
            .then(items => this.setState({ newItem: {}, sending: false, newItemOpen: false }))
            .then(this.load)
            .catch(error => console.error(error) || this.setState({ error }))
    }

    deleteItem = id => {
        if (this.state.deleting)
            return;
        this.setState({ deleting: true })
        const items = [...this.state.items]
        const index = items.findIndex(({ id: itemId }) => id === itemId)
        items.splice(index, 1)
        this.sdk.deleteLocation(id)
            .then(() => this.setState({ items }))
            .catch(error => console.error(error) || this.setState({ error }))
            .then(() => this.setState({ deleting: false }))
    }

    checkCep = () => {
        const { newItem, cep = '' } = this.state.newItem
        if (cep.replace(/\D/g, '').length !== 8) return
        this.setState({ loadingCep: true })
        this.sdk.locations.getCep(cep)
            .then(location => this.setState({ newItem: { ...newItem, ...location } }))
            .catch(() => alert('CEP inválido'))
            .then(() => this.setState({ loadingCep: false }))
    }

    render() {
        const { loadingCep, newItemOpen, newItem, items, loading, sending, } = this.state
        const fields = [
            ['cep', 'CEP',
                {
                    required: true, variant: 'outlined', type: 'number', step: '1', onChange:
                        e => this.setState({ newItem: { ...newItem, cep: e.target.value } }, this.checkCep)
                }],
            ['nome', 'Nome do Local', { required: true }],
            ['rua', 'Rua', { required: true }],
            ['numero', 'Número', { required: true }],
            ['complemento', 'Complemento'],
            ['bairro', 'Bairro', { required: true }],
            ['cidade', 'Cidade', { required: true }],
            ['estado', 'Estado', { required: true }],
            ['pnt_referencia', 'Ponto Referencia'],
            ['hora_Abertura', 'Hora Abertura', { required: true }],
            ['hora_Fechamento', 'Hora Fechamento', { required: true }],
            ['latitude', 'Latitude'],
            ['longitude', 'Longitude'],
        ]

        return (
            <>
                <Header title="Pontos de Apoio" backButton />
                <Container component="main">
                    <WithRoles roles="user">
                        <T gutterBottom>Encontre um ponto de coleta perto de você.</T>
                    </WithRoles>
                    {loading ?
                        <Loader /> :
                        !items.length ?
                            <T align="center">Lista vazia</T> :
                            <Paper style={{ margin: 10, overflow: 'auto' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nome</TableCell>
                                            <TableCell align="right">Endereço</TableCell>
                                            <TableCell align="right">Cidade / UF</TableCell>
                                            <TableCell align="right">CEP</TableCell>
                                            <TableCell align="right">Horário</TableCell>
                                            <TableCell align="right">Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map(item =>
                                            <TableRow key={item.id}>
                                                <TableCell component="th" scope="row">
                                                    {item.nome}
                                                </TableCell>

                                                <TableCell align="right">
                                                    <p>{item.rua}, {item.numero} {item.complemento}</p>
                                                    <p>{item.pnt_referencia}</p>
                                                </TableCell>

                                                <TableCell align="right">
                                                    {item.cidade}/{item.estado}
                                                </TableCell>

                                                <TableCell align="right">
                                                    {item.cep}
                                                </TableCell>

                                                <TableCell align="right">
                                                    {item.hora_Abertura} - {item.hora_Fechamento}
                                                </TableCell>

                                                <TableCell align="right">
                                                    <WithRoles roles="admin">
                                                        <IconButton onClick={() => this.setState({ newItem: { ...item }, newItemOpen: true })} color="secondary">
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton disabled={this.state.deleting} onClick={() => this.deleteItem(item.id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </WithRoles>
                                                </TableCell>

                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Paper>
                    }
                    <WithRoles roles="admin">
                        <Fab color="primary" title="Adicionar" aria-label="Adicionar"
                            onClick={this.dialogToggle}
                            style={{ position: 'sticky', bottom: 16, right: 16, float: 'right', margin: 16 }}>
                            <AddIcon />
                        </Fab>
                    </WithRoles>
                    <Dialog
                        fullScreen
                        open={newItemOpen}
                        onClose={this.dialogToggle}
                        TransitionComponent={Transition}
                    >
                        <Header simple title={newItem.id ? `Editar '${newItem.nome}'` : 'Novo Local'}
                            rightAction={
                                <IconButton color="inherit" disabled={sending} onClick={this.dialogToggle}>
                                    <CloseIcon />
                                </IconButton>
                            } />
                        <form method="post" onSubmit={this.createItem}>
                            <DialogContent>
                                <DialogContentText>Preencha os dados abaixo</DialogContentText>
                                {loadingCep && <Loader />}
                                <Container>
                                    {fields.map(([field, label, args = {}], i) =>
                                        <TextField
                                            key={field}
                                            autoFocus={i === 0}
                                            margin="dense"
                                            id={field}
                                            name={field}
                                            label={label}
                                            value={newItem[field] || ''}
                                            onChange={e => this.setState({ newItem: { ...newItem, [field]: e.target.value } })}
                                            type="text"
                                            fullWidth
                                            {...args
                                            // { ...args, required: false }
                                            }
                                        />
                                    )}
                                </Container>
                            </DialogContent>
                            <DialogActions>
                                <Button variant="contained" fullWidth size="large" type="submit" color="primary" disabled={this.sending}>Enviar</Button>
                                <Button variant="outlined" fullWidth size="large" disabled={this.sending} onClick={this.dialogToggle}>Cancelar</Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                </Container>
            </>
        );
    }
}

function Transition(props) {
    return <Slide direction="up" {...props} />
}

export default withLogin(PontosApoio);