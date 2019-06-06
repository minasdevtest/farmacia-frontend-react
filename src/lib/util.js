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