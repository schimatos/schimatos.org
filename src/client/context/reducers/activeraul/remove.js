import {useContext} from 'react'
import {LayoutContext} from '../../contexts/layout-context'
import {displayComponentFunctions} from '../../../custom-hooks'


export default (state, {t, id}) => {
    const type = t
    const {allChildren, removeChild} = displayComponentFunctions({state})

    state = {...state}

    if (state[type][id]) {
        
        const t = type === 'targets' ? 'properties' : 'targets'




        const p = state[type][id].parent
        state[t][p].children = removeChild(t, p, id)
        
        const removal = (s, t, i) => {
            const otherType = t === 'targets' ? 'properties' : 'targets'
            const newstate = allChildren(t, i).reduce((ns, x) => removal(ns, otherType, x), s)
            delete newstate[t][i]

            return newstate
        }

        const nstate = {...removal(state, type, id), focus : reduceCheck(state, type, id) ? {type : t, id : p, hold : false} : state.focus}
       //const newState = {...nstate, focus : {type : t, id : p, hold : false}}

        //console.log('state after removal', nstate, t, p, nstate.focus.id, nstate.focus.type)

        return nstate
    } else {
        return state
    }
}
// Checks if focus is child or grandchild
const reduceCheck = (state, type, id) => {
    return (type===state.focus.type && id === state.focus.id) || allChildren(t, i).reduce((t, x) => t || reduceCheck(state, type === 'targets' ? 'properties' : 'targets', x), false)
}