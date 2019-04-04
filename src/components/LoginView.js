import React from "react";
import { withAuth } from "../lib/authContext";
import LoginDialog from "./LoginDialog";

function LoginViewRender({ component: Component, authProps, mapAuthProps = p => p, ...props }) {
    return (
        <>
            <LoginDialog
                open={!authProps.user}
            />
            {authProps.user && <Component {...props} {...mapAuthProps(authProps)} />}
        </>
    )
}

const LoginView = withAuth(authProps => ({ authProps }))(LoginViewRender)

export const withLogin = (component, mapAuthProps) =>
    props => (
        <LoginView {...props} mapAuthProps={mapAuthProps} component={component} />
    )

export default LoginView