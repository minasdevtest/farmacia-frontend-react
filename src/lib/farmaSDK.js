import Axios from "axios";
import BaseModule from "./BaseModule";

const defaultUrl =
    // window.location.hostname === 'localhost' ?
    // 'http://localhost:3010' :
    'https://farmaciasolidaria-middleware.herokuapp.com'

const STORAGE_SESSION_KEY = 'farma-session'

/**
 * Main SDK
 *
 * @namespace
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

    login(email, password) {
        return this.fetch('/login', { email, password }, { method: 'post' })
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


    news() {
        return this.fetch('/news?_embed')
    }

    singleNews(id) {
        return this.fetch(`/news/${id}?_embed`)
    }

    location({ field, value } = {}) {
        const filter = field ? `${field}=${value}` : ''
        return this.fetch(`/location`, filter)
    }

    saveLocation(location) {
        return location.id ? this.updateLocation(location) : this.fetch('/location', location, { method: 'post' })
    }

    updateLocation(location) {
        return this.fetch(`/location/${location.id}`, location, { method: 'put' })
    }

    deleteLocation(id) {
        return this.fetch(`/location/${id}`, null, { method: 'delete' })
    }

    // Medicamentos
    medicine() {
        return this.fetch('/medicine').then(({ content }) => content)
    }

    medicineStatus() {
        return this.fetch('/medicine/status')
    }

    medicineTypes() {
        return this.fetch('/medicine/types')
    }

    saveMedicine(item, edit) {
        alert(edit)
        return edit ? this.updateMedicine(item, edit) : this.fetch('/medicine', item, { method: 'post' })
    }

    updateMedicine(item, id) {
        return this.fetch(`/medicine/${id}`, item, { method: 'put' })
    }

    deleteMedicine(id) {
        // TODO: support delete
        // return this.fetch(`/medicine/${id}`, null, { method: 'delete' })
        return Promise.resolve()
    }

    //Users
    getUsers() {
        return this.fetch('/user')
    }

    getUser(_id) {
        return this.fetch(`/user/${_id}`)
    }

    getCurrentUser() {
        return this.session ? this.fetch(`/user/${this.session.user._id}`) : Promise.reject(new Error('No user'))
    }

    createUser(user) {
        return user._id ?
            this.updateUser(user) :
            this.fetch('/user', user, { method: 'post' })
    }

    updateUser({ _id, ...user }) {
        return this.fetch(`/user/${_id}`, user, { method: 'put' })
    }


    deleteUser(_id) {
        return this.fetch(`/user/${_id}`, null, { method: 'delete' })
    }

    // GERAL
    fetch(route, data, args = {}) {
        return this.ajax({
            method: 'get',
            url: route,
            data,
            ...args
        }).then(res => res.data)
    }
}