import { withAuth } from "./authContext";


function WithRolesView({ user, roles, children = null, fallback = null }) {
    if (typeof roles === 'string')
        roles = roles.split(',')
    return (user && user.roles.find(userRole => roles.find(r => r === userRole))) ?
        children : fallback
}

export const WithRoles = withAuth()(WithRolesView)

export function withAuthentication() {

}