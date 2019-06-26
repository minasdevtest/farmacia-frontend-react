import React, { useContext } from 'react'
import FarmaSdk from './farmaSDK';

export const SdkContext = React.createContext({})

export function SdkContextProvider({ children }) {
    return (
        <SdkContext.Provider value={{ sdk: FarmaSdk.instance() }}>
            {children}
        </SdkContext.Provider>
    )
}

export const withSdk =
    (mapProps = props => props) =>
        Component =>
            props => (
                <SdkContext.Consumer>
                    {context => <Component {...props} {...mapProps(context)} />}
                </SdkContext.Consumer>
            )

/**
 * SDK hook
 *
 * @export
 * @returns {FarmaSdk}
 */
export function useSdk() {
    const { sdk } = useContext(SdkContext)
    return sdk
}