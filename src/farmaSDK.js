import Axios from "axios";

const defaultUrl =
    // window.location.hostname === 'localhost' ?
    //     'http://localhost:3000' :
    'https://farmaciasolidaria-middleware.herokuapp.com'


export default class FarmaSdk {
    constructor({ apiURL = defaultUrl } = {}) {
        this.apiURL = apiURL
        this.rootRoute = '/api/v1'
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

    // GERAL
    fetch(route, data, args = {}) {
        return Axios({
            method: 'get',
            url: this.apiURL + this.rootRoute + route,
            data,
            ...args
        }).then(res => res.data)
    }

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