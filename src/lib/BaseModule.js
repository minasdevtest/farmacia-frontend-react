/**
 * Base Module
 * 
 * Add singleton and events support
 *
 * @namespace
 * @export
 * @class BaseModule
 */
export default class BaseModule {

    /**
     * Event Listeners
     * @var {Array[]}
     * @memberof BaseModule
     */
    eventListeners = {
        login: [],
        logout: [],
    }

    /**
     * ADD an event listener
     *
     * @param {String} event
     * @param {Function} listener
     * @memberof BaseModule
     */
    on(event, listener) {
        if (!this.eventListeners[event]) this.eventListeners[event] = []
        this.eventListeners[event].push(listener)
    }

    /**
     * Removes an event listener
     *
     * @param {String} event
     * @param {Function} listener
     * @memberof BaseModule
     */
    off(event, listener) {
        const listeners = this.eventListeners[event] || []
        const index = listeners.findIndex(l => l === listener)
        if (index > -1)
            listeners.splice(index, 1)
    }

    /**
     * Trigger an event
     *
     * @param {String} event
     * @param {...Array} args
     * @memberof BaseModule
     */
    trigger(event, ...args) {
        const listeners = this.eventListeners[event] || []
        listeners.forEach(listener => listener(...args))
    }

    
    /**
     * Singleton Instance
     * @var {BaseModule}
     * @static
     * @memberof BaseModule
     */
    static __instance__ = null

    /**
     * Get instance
     *
     * @static
     * @param {Object} props
     * @returns {BaseModule} 
     * @memberof BaseModule
     */
    static instance(...props) {
        return this.__instance__ = this.__instance__ || new this(...props)
    }
}