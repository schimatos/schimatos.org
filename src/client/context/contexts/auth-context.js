import customProvider from '../custom-provider'
import reducer from '../reducers/auth'

const [AuthContext, AuthProvider] = customProvider(reducer, {
    logged_in : false, username : ''
}, 'AuthContext')

export {AuthContext, AuthProvider}