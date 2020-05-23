import {deepNotIn, strip} from '../../../utils'

export default (state, id, value, prefix, hide) => {
    const entry = {key : value, text : hide ? strip(value, prefix) : value, value}
    if (deepNotIn(state.property[id].options, entry)) {
        state.property[id].options.push(entry)
        return {...state}
    } else {
        return {...state}
    }
}