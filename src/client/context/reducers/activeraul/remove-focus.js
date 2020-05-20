import relations from './helper-functions/relations'

import {keyDelDict, arrayDelElt} from '../../../utils'

export default state => {
    const {parent, otherType} = relations(state)
    const {type, id} = state.focus
    const parentNo = parent(type, id)
    const oType = otherType(type)
    const childRemoved = arrayDelElt(
        state[oType][parentNo].children,
        id
    )

    state[type] = keyDelDict(state[type], id)
    state[oType][parentNo].children = childRemoved

    return {...state}
}