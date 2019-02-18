
export default class FarmaSdk {
    constructor({ apiURL = 'http://localhost:3000' } = {}) {
        this.apiURL = apiURL
        this.rootRoute = '/api/v1'
    }

    news(){
        return this.fetch('/news?_embed')
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