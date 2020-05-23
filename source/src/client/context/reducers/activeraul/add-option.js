import {deepNotIn, strip, keepCloning} from '../../../utils'
import relations from './helper-functions/relations'

export default (state, targets, i, value, prefix, hide) => {
    //console.log('add option', i)
    const {siblingValues} = relations(state)
    // FIx strip
    const entry = {key : value, text : hide ? strip(value, prefix) : value, value : value}
    const key = state.targets[i].parent
    const pathType = state.propertyList[state.properties[key].property].pathType
    const prop = targets.property[key]
    // Redundant after merge with main form (currently reducnat at leat)
    //const noSelected = deepNotIn(prop.selected, entry)

    if (pathType !== 'alternativePath') {
        const noSiblings = deepNotIn(siblingValues(i), value)

        if (noSiblings) {
            //console.log('adding value')
            state.targets[i].value = value
        }
    } else {
        const pathOpen = state.properties[key].pathOpen
        const noSiblings = !state.properties[key].children[pathOpen].map(x => state.targets[x].value).includes(value)
        if (noSiblings) {
            if (value !== '' && state.properties[key].children[0].includes(i)) {
                state.properties[key].children[pathOpen] = [...state.properties[key].children[pathOpen], i]
                state.properties[key].children[0] = state.properties[key].children[0].filter(x => x!=i)
            } else if (value === '' && state.properties[key].children[pathOpen].includes(i)) {
                state.properties[key].children[0] = [...state.properties[key].children[0], i]
                state.properties[key].children[pathOpen] = state.properties[key].children[pathOpen].filter(x => x!=i)
            
            }
            state.targets[i].value = value
    }
}




    return {...state}
}