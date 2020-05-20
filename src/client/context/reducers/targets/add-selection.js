import {deepNotIn} from '../../../utils'

export default (state, id, value) => {
    if (deepNotIn(state.selections, value)) {
        state.property[id].selections.push(value)
        return newState
    } else {
        return {...state}
    }
}