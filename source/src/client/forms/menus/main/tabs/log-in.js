import {useContext} from 'react'
import {AuthContext} from '../../../../context'
import {input, checkbox} from '../../../fields/functional-react'

export default () => {
    const [{logged_in, username}, authDispatch] = useContext(AuthContext)
    
    const modal = () => {
        const initialState = {logged_in, username, password : ''}
        const content = () => [
            ['User Details', [input, 'username',,'Username',{condition : state => !state.logged_in}], [input, 'password',,'Password',{condition : state => !state.logged_in}]],
            ['User Details', [checkbox, 'logged_in','Logged In',{label : 'Logged In'},{condition : state => state.logged_in}]]]
        return {initialState, content, header : 'Log In', confirmation : logged_in}
    }

    return {
        modal : logged_in ? false : modal(),
        icon : logged_in ? 'log out' : 'user circle',
        text : logged_in ? username : 'Log In',
        popup : logged_in ? 'Log Out' : 'Log In',
        warning : logged_in ? 'Log Out' : false,
        onClick : logged_in ? () => authDispatch({type : 'LOG_OUT'}) : ({username}) => authDispatch({username, type : 'LOG_IN'})
    }
}