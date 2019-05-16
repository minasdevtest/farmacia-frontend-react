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