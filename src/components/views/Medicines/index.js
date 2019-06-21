import React, { Component } from 'react';
import { Typography as T, Table, TableRow, TableBody, TableCell, TableHead, Paper, Fab, IconButton, TablePagination, TableFooter, Container, Button } from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, AddCircle as PlusIcon, FilterList as FilterIcon } from '@material-ui/icons';

import { dateFormated, toggleState } from 'lib/util'

import Header from 'components/Header';
import FarmaSdk from 'lib/farmaSDK'
import { withLogin } from 'components/LoginView';
import { WithRoles } from 'lib/authHOC';
import MedicineEditDialog from './MedicineEditDialog';
import MedicineDetails from './MedicineDetails';
import MedicineRequestDetails from './MedicineRequestDetails';
import MedicineDelete from './MedicineDelete';
import Loader from 'components/Loader';
import SearchBar from 'components/SearchBar';
import MedicineFilter from './MedicineFilter';

class MedicinesView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            items: [],
            itemDetails: null,
            newItem: {},
            newItemOpen: false,
            editItemId: null,
            sending: false,
            statusOptions: [],
            typesOptions: [],
            item: null,
            action: '',
            filterOpen: false,
            search: '',
            // notificações
            requestDetails: null
        }
    }

    /**
     *
     * @returns {FarmaSdk} instance
     * @readonly
     * @memberof MedicinesView
     */
    get sdk() {
        return FarmaSdk.instance()
    }

    setAction = (item = null, action = '') => this.setState({ item, action })

    resetAction = () => this.setState({ action: '' })

    load = () => {
        this.setState({ loading: true })
        Promise.all([
            this.fetchItems(),
            this.sdk.medicineStatus().then(statusOptions => this.setState({ statusOptions })),
            this.sdk.medicineTypes().then(typesOptions => this.setState({ typesOptions })),
        ])
            .catch(error => console.error(error) || this.setState({ error }))
    }

    fetchItems = async () => {
        const { search, filter } = this.state
        this.setState({ loading: true })
        const items = await this.sdk.medicines.get(search, filter)
        this.setState({ items, loading: false })
    }

    filter = async filter => {

    }


    componentDidMount = () => this.load()

    dialogToggle = () => this.setState({
        newItemOpen: !this.state.newItemOpen,
        editItemId: null,
        newItem: this.state.newItemOpen ? {} : this.state.newItem
    })

    createItem = e => {
        e && e.preventDefault()
        if (this.state.sending)
            return;
        const { editItemId } = this.state
        const item = { ...this.state.newItem }
        item.status = this.state.statusOptions
            .find(({ id }) => item.status === id)
        item.tipo = this.state.typesOptions
            .find(({ id }) => item.tipo === id)

        item.estoque = item.estoque || {}
        item.estoque.quantidade = item.valorEstoque
        delete item.valorEstoque

        item.usoVeterinario = item.usoVeterinario ? 'S' : 'N'

        if (editItemId) {
            delete item.estoque
        }

        this.setState({ sending: true })
        this.sdk.saveMedicine(item, editItemId)
            .then(() => this.setState({ newItem: {}, editItemId: null, sending: false, newItemOpen: false }))
            .then(this.load)
            .catch(error => this.setState({ error, sending: false }))
    }

    requestItem = (amount) => {
        const { itemDetails } = this.state
        this.setState({ sending: true })
        this.sdk.medicines.request(itemDetails.lote, amount)
            .then(requestDetails => this.setState({ sending: false, itemDetails: null, requestDetails }))
    }

    deleteItem = ({ id }, reason) => {
        if (this.state.sending)
            return;
        const items = [...this.state.items]
        const index = items.findIndex(({ id: itemId }) => id === itemId)
        items.splice(index, 1)
        this.setState({ sending: true })
        this.sdk.deleteMedicine(id, reason)
            .then(() => this.setState({ items }))
            .catch(error => console.error(error) || this.setState({ error }))
            .then(() => this.setState({ sending: false, action: '' }))
    }

    render() {
        const { filterOpen, item, action, requestDetails, newItemOpen, newItem, itemDetails, items, loading, sending, typesOptions, statusOptions, editItemId } = this.state

        return (
            <>
                <Header title="Medicamentos" backButton />
                <main>
                    <Container>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <IconButton color="primary" onClick={toggleState(this, 'filterOpen')}>
                                <FilterIcon />
                            </IconButton>
                            <SearchBar onSearch={search => this.setState({ search }, this.fetchItems)} />
                        </div>
                        {loading ?
                            <Loader /> :
                            !items.length ?
                                <div style={{ textAlign: 'center', margin: 'calc(50vh - 150px) 0' }}>
                                    <T gutterBottom>Nenhum Medicamento Encontrado</T>
                                    <WithRoles roles="admin" callback={() =>
                                        <Button onClick={this.dialogToggle} color="primary" variant="contained" size="large">Cadastre um novo medicamento</Button>
                                    } />
                                </div> :
                                <Paper style={{ overflow: 'auto' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding="checkbox">Lote</TableCell>
                                                <TableCell>Nome</TableCell>
                                                <TableCell style={{ width: 60 }}>Status</TableCell>
                                                <TableCell align="right" padding="none">Qtd.</TableCell>
                                                <TableCell>Lab.</TableCell>
                                                <TableCell padding="none">Detalhes</TableCell>
                                                <TableCell style={{ width: 100 }}>Ações</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {items.map(item =>
                                                <TableRow key={item.lote}>
                                                    <TableCell padding="checkbox">
                                                        <small>{item.lote}</small>
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {item.nomeComercial}<br />
                                                        <small>{item.principioAtivo}</small>
                                                    </TableCell>

                                                    <TableCell>
                                                        {item.status.descricao}
                                                    </TableCell>

                                                    <TableCell align="right" padding="none">
                                                        {(item.estoque && item.estoque.quantidade) || 'N/A'}
                                                    </TableCell>

                                                    <TableCell>
                                                        {item.laboratorio}
                                                    </TableCell>

                                                    <TableCell padding="none">
                                                        <b>Dosagem: </b>{item.dosagem}<br />
                                                        {item.tipo.descricao}<br />
                                                        <b>Vencimento: </b>
                                                        {dateFormated(item.dataVencimento)}
                                                    </TableCell>

                                                    <TableCell>
                                                        <WithRoles roles="admin">
                                                            <IconButton onClick={() => this.setState({
                                                                newItem: {
                                                                    ...item,
                                                                    valorEstoque: (item.estoque && item.estoque.quantidade) || 1,
                                                                    status: item.status && item.status.id,
                                                                    tipo: item.tipo && item.tipo.id,
                                                                }, newItemOpen: true,
                                                                editItemId: item.lote
                                                            })} color="secondary">
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton disabled={this.state.sending} onClick={() => this.setAction(item, 'delete')}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </WithRoles>

                                                        <WithRoles roles="user">
                                                            <IconButton onClick={() => this.setState({ itemDetails: item })} color="primary">
                                                                <PlusIcon />
                                                            </IconButton>
                                                        </WithRoles>
                                                    </TableCell>

                                                </TableRow>
                                            )}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TablePagination
                                                    colSpan={7}
                                                    rowsPerPage={8}
                                                    count={50}
                                                    page={0}
                                                    rowsPerPageOptions={[]}
                                                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                                                    onChangePage={console.log}
                                                />
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </Paper>
                        }
                    </Container>


                    <WithRoles roles="admin" callback={() => <>
                        <Fab color="primary" title="Adicionar" aria-label="Adicionar"
                            onClick={this.dialogToggle}
                            style={{ position: 'sticky', bottom: 16, right: 16, float: 'right', margin: 16 }}>
                            <AddIcon />
                        </Fab>

                        <MedicineEditDialog
                            open={newItemOpen}
                            onClose={this.dialogToggle}
                            onSubmit={this.createItem}
                            editing={Boolean(editItemId)}
                            item={newItem}
                            onFieldChange={(field, value) => this.setState({ newItem: { ...newItem, [field]: value } })}
                            {...{ typesOptions, statusOptions, sending }}
                        />

                        <MedicineDelete
                            item={item}
                            open={action === 'delete'}
                            loading={sending}
                            onClose={this.resetAction}
                            onDelete={this.deleteItem}
                        />

                    </>} />

                    <WithRoles roles="user" callback={() => <>
                        <MedicineDetails
                            item={itemDetails}
                            open={Boolean(itemDetails)}
                            loading={sending}
                            onClose={() => this.setState({ itemDetails: null })}
                            onRequest={this.requestItem}
                        />
                        <MedicineRequestDetails
                            open={Boolean(requestDetails)}
                            onClose={() => !sending && this.setState({ requestDetails: null })}
                            request={requestDetails}
                        />
                    </>} />

                    <MedicineFilter
                        status={statusOptions}
                        types={typesOptions}
                        open={filterOpen}
                        onApply={filter => this.setState({ filter, filterOpen: false }, this.fetchItems)} />
                </main>
            </>
        );
    }
}
export default withLogin(MedicinesView);