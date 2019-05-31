import { withAuth } from "./authContext";


function WithRolesView({ user, roles, children = null, callback = () => children, fallback = null }) {
    if (typeof roles === 'string')
        roles = roles.split(',')
    return (user && user.roles.find(userRole => roles.find(r => r === userRole))) ?
        callback() : fallback
}

export const WithRoles = withAuth()(WithRolesView)

export function withAuthentication() {

}