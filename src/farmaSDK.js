import Axios from "axios";

const defaultUrl = 'https://farmaciasolidaria-middleware.herokuapp.com';
// window.location.hostname === 'localhost' ?
//     'http://localhost:3000' :
//     'https://farmaciasolidaria-middleware.herokuapp.comsudo'

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

    updateLocation(location){
        return this.fetch(`/location/${location.id}`, location, { method: 'put' })
    }

    deleteLocation(id) {
        return this.fetch(`/location/${id}`, null, { method: 'delete' })
    }

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