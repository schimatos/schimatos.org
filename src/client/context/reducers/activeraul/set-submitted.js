import {useContext} from 'react'
import {TriplestoreContext} from '../../contexts/triplestore-context'

export default (state, type, id, prefix) => {
    const val = state[type][id].value
    state[type][id].value = val.includes(':') ? val : prefix + val
    state[type][id].submitted = true
    return {...state}
}