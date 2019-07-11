import Axios from "axios";
import BaseModule from "./BaseModule";
import { waitPromise } from "./util";

const defaultUrl =
    // window.location.hostname === 'localhost' ?
    //     'http://localhost:3010' :
    'https://farmaciasolidaria-middleware.herokuapp.com'

const STORAGE_SESSION_KEY = 'farma-session'

/**
 * Main SDK
 *
 * @namespace FarmaSdk
 * @export
 * @class FarmaSdk
 */
export default class FarmaSdk extends BaseModule {

    /**
     * stored session
     * @property {Object}
     * @memberof FarmaSdk
     */
    _session = null

    constructor({ apiURL = defaultUrl } = {}) {
        super()
        this.apiURL = apiURL
        this.rootRoute = '/api/v1'
        this.ajax = Axios.create({
            baseURL: this.apiURL + this.rootRoute,
            headers: this.session && { Authorization: `Bearer ${this.session.token}` }
        })
    }

    get session() {
        return this._session || (this._session = JSON.parse(localStorage.getItem(STORAGE_SESSION_KEY)))
    }

    set session(value) {
        if (value)
            return localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(value))
        else
            localStorage.removeItem(STORAGE_SESSION_KEY)
        this._session = value
    }

    doLogin = user => this.trigger('login', user)
    doLogout = () => this.trigger('logout')

    onStorageChange = ({ key, oldValue, newValue }) => {
        if (key !== STORAGE_SESSION_KEY) return
        if (newValue)
            return this.doLogin(this.session)
        this.doLogout()
    }

    register(data) {
        return this.fetch('/me', data, 'post')
            .then(() => this.login(data.email, data.password))
    }

    login(email, password) {
        return this.fetch('/login', { email, password }, 'post')
            .then(({ user, token }) => {
                this.ajax.defaults.headers['Authorization'] = `Bearer ${token}`
                this.session = { user, token }
                this.doLogin(user)
                return user
            })
    }

    logout() {
        this.session = null
        delete this.ajax.defaults.headers['Authorization']
        this.doLogout()
    }

    news = () => this.fetch('/news?_embed')

    singleNews = id => this.fetch(`/news/${id}?_embed`)

    location({ field, value } = {}) {
        const filter = field ? `${field}=${value}` : ''
        return this.fetch(`/location`, filter)
    }

    saveLocation = location => location.id ?
        this.updateLocation(location) :
        this.fetch('/location', location, 'post')

    updateLocation = location => this.fetch(`/location/${location.id}`, location, 'put')

    deleteLocation = id => this.fetch(`/location/${id}`, null, 'delete')

    // Medicamentos
    medicine = () => this.fetch('/medicine').then(({ content }) => content)

    medicineStatus = () => this.fetch('/medicine/status')

    medicineTypes = () => this.fetch('/medicine/types')

    saveMedicine = (item, edit) => edit ?
        this.updateMedicine(item, edit) :
        this.fetch('/medicine', item, 'post')

    updateMedicine = (item, id) => this.fetch(`/medicine/${id}`, item, 'put')

    deleteMedicine(id, reason) {
        // TODO: support delete
        // return this.fetch(`/medicine/${id}`, null, { method: 'delete' })
        return waitPromise()
    }

    requestMedicine() {
        return waitPromise()
    }

    medicines = {
        request: (id, amount) => waitPromise().then(() => ({
            beginDate: (new Date()).getTime(),
            endDate: (new Date()).getTime() + 1000 * 60 * 60 * 24 * 5,
            amount,
            id
        })),
        /**
         * TODO: unmock
         *
         * @param {string} [search='']
         * @param {Object} [filter='']
         */
        get: ({ search = '', filter: { usoVeterinario, lote = '', status = [], tipo = [] } = {} } = {}) =>
            this.medicine()
                .then(items => items
                    .filter(({ nomeComercial, principioAtivo }) =>
                        (nomeComercial.search(new RegExp(search, 'ig')) !== -1) ||
                        (principioAtivo.search(new RegExp(search, 'ig')) !== -1)
                    )
                    .filter(item => !usoVeterinario || item.usoVeterinario === 'S')
                    .filter(item => !lote.length || item.lote === lote)
                    .filter(item => !status.length || status.includes(item.status && item.status.id))
                    .filter(item => !tipo.length || tipo.includes(item.tipo && item.tipo.id))
                ),
        getOne: lote => this.medicines
            .get()
            .then(items => items.find(item => item.lote === lote))
    }

    sac = {

        get: () => waitPromise().then(() => [
            { id: 1, nomeDoUsuario: 'João da Silva', email: 'joao@example.com', telefone: '12345678', mensagem: 'Como uso o sistema?' },
            { id: 2, nomeDoUsuario: 'Maria Joana', email: 'maria@example.com', telefone: '12345678', mensagem: "Uma história\n\nFim" },
            { id: 3, nomeDoUsuario: 'João da Silva', email: 'joao@example.com', telefone: '12345678', mensagem: 'Como uso o sistema?' },
            { id: 4, nomeDoUsuario: 'Maria Joana', email: 'maria@example.com', telefone: '12345678', mensagem: "Uma história\n\nFim" },
        ]),

        add: data => waitPromise().then(() => true)

    }

    //Users
    getUsers = () => this.fetch('/user')


    getUser = _id => this.fetch(`/user/${_id}`)

    createUser = user => user._id ?
        this.updateUser(user) :
        this.fetch('/user', user, 'post')

    updateUser = ({ _id, ...user }) => this.fetch(`/user/${_id}`, user, 'put')

    deleteUser = _id => this.fetch(`/user/${_id}`, null, 'delete')

    // current user magement
    getAccount = () => this.fetch('/me')

    updateAccount = data => this.fetch('/me', data, 'put')

    updateAccountPassword = data => this.fetch('/me/password', data, 'put')

    deleteAccount = () => this.fetch('/me', null, 'delete').then(data => { this.logout(); return data })

    // GERAL
    fetch(route, data, args = {}) {
        if (typeof args === 'string')
            args = { method: args }

        return this
            .ajax({
                method: 'get',
                url: route,
                data,
                ...args
            })
            .then(res => res.data)
            .catch(err => {
                console.error('API ERROR: ', err)
                // delete session if not authorized
                if (err.response && err.response.status === 401 && this.session)
                    this.logout()
                return Promise.reject(err)
            })
    }
}