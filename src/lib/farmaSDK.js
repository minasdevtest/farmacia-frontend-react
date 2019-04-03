import Axios from "axios";

const defaultUrl =
    window.location.hostname === 'localhost' ?
        'http://localhost:3010' :
        'https://farmaciasolidaria-middleware.herokuapp.com'

const STORAGE_SESSION_KEY = 'farma-session'

/**
 * Main SDK
 *
 * @namespace
 * @export
 * @class FarmaSdk
 */
export default class FarmaSdk {

    /**
     * Event Listeners
     * @var {Array[]}
     * @memberof FarmaSdk
     */
    eventListeners = {
        login: [],
        logout: [],
    }

    /**
     * stored session
     * @property {Object}
     * @memberof FarmaSdk
     */
    _session = null

    constructor({ apiURL = defaultUrl } = {}) {
        console.log(FarmaSdk)
        this.apiURL = apiURL
        this.rootRoute = '/api/v1'
        this.ajax = Axios.create({
            baseURL: this.apiURL + this.rootRoute,
            headers: this.session && { Authorization: `Bearer ${this.session.token}` }
        })
    }

    get session() {
        return this._session = this._session = JSON.parse(localStorage.getItem(STORAGE_SESSION_KEY))
    }

    set session(value) {
        if (value)
            return localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(value))
        else
            localStorage.removeItem(STORAGE_SESSION_KEY)
        this._session = value
    }

    on(event, listener) {
        if (!this.eventListeners[event]) this.eventListeners[event] = []
        this.eventListeners[event].push(listener)
    }

    off(event, listener) {
        const listeners = this.eventListeners[event] || []
        const index = listeners.findIndex(l => l === listener)
        if (index > -1)
            listeners.splice(index, 1)
    }

    trigger(event, ...args) {
        const listeners = this.eventListeners[event] || []
        listeners.forEach(listener => listener(...args))
    }

    onStorageChange = ({ key, oldValue, newValue }) => {
        if (key !== STORAGE_SESSION_KEY) return
        if (newValue)
            return this.trigger('login', this.session)
        this.trigger('logout')
    }

    login(email, password) {
        return this.fetch('/login', { email, password }, { method: 'post' })
            .then(({ user, token }) => {
                this.ajax.defaults.headers['Authorization'] = `Bearer ${token}`
                this.session = { user, token }
                this.trigger('login', user)
                return user
            })
    }

    logout() {
        this.session = null
        delete this.ajax.defaults.headers['Authorization']
        this.trigger('logout')
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

    /**
     * Instance
     * @var {FarmaSdk}
     * @static
     * @memberof FarmaSdk
     */
    static i = null

    /**
     * Get instance
     *
     * @static
     * @param {Object} props
     * @returns {FarmaSdk} 
     * @memberof FarmaSdk
     */
    static instance(...props) {
        return this.i = this.i || new this(...props)
    }
}