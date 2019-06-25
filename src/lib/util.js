import { useState, useEffect } from "react";

/**
 * Utilities
 */

/**
 * HOC prevent event default
 *
 * @export
 * @param {Function} fn
 * @returns
 */
export function preventDefault(fn) {
    return e => {
        if (e && e.preventDefault) e.preventDefault()
        return fn && fn()
    }
}

/**
 * Format a date
 * @param {String} date
 */
export const dateFormated = date => date
    .split('-')
    .reverse()
    .join('/')
/**
 * Resolve a primise after time
 * @param {Number} [time=1000] time to wait 
 */
export const waitPromise = (time = 1000) => new Promise(resolve => setTimeout(resolve, time))

/**
 * HOF to extract value from event
 * @param {Function} fn to be called
 */
export const getValue = fn => (e => fn(e.target.value))

/**
 * Resetable useState
 * 
 * Automatically resets to initial value when some prop change
 *
 * @export
 * @param {any} initialState
 * @param {Array} input Inputs to check
 * @returns {Array} state methods
 */
export function useStateReset(initialState, input) {
    const [state, setState] = useState(initialState)
    const resetState = () => setState(initialState)
    useEffect(resetState, input)
    return [state, setState]
}

/**
 * Generate a function to toggle an state
 * TODO: refatorate
 * @export
 * @param {React.Component} instance
 * @param {String} prop
 * @returns {Function}
 */
export function toggleState(instance, prop) {
    return () => instance.setState({ [prop]: !instance.state[prop] })
}