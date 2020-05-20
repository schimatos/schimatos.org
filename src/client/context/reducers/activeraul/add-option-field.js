import {nextKey} from '../../../utils'

export default (state, parent, value) => {
    const minKey = nextKey(state.targets)

    state.targets = {...state.targets,
        [minKey] : {parent,
            value : value ? value : '',
            submitted : false,
            loading : false,
            shacled : false,
            children : [],
            hidden : false
        }
    }

    if (state.propertyList[state.properties[parent].property].pathType === 'alternativePath') {
        state.properties[parent].children[0] = [minKey, ...state.properties[parent].children[0]]
    } else {
        state.properties[parent].children = [minKey, ...state.properties[parent].children]
    }

    return {...state}
}