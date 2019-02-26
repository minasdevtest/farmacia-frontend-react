const defaultUrl = window.location.hostname === 'localhost' ?
    'http://localhost:3000' :
    'http://farmaciasolidaria.ddns.net:3000'

export default class FarmaSdk {
    constructor({ apiURL = defaultUrl } = {}) {
        this.apiURL = apiURL
        this.rootRoute = '/api/v1'
    }

    news() {
        return this.fetch('/news?_embed')
    }

    singleNews(id){
        return this.fetch(`/news/${id}?_embed`)
    }

    location({field, value}={}){
        const filter = field? `${field}=${value}` : ''
        return this.fetch(`/location?${filter}`)
    }

    fetch(route) {
        return fetch(this.apiURL + this.rootRoute + route).then(res => res.json())
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