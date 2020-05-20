import {deepNotIn} from '../../../utils'

export default (state, {oldId, newId}) => {
    state.property[newId] = {options : [...state.property[oldId].options], selected : []}
    return {...state}
}