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
        return fn()
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