import _ from 'underscore'

import {zipArrays, nextKey, setMinus, keepCloning} from '../../../utils'

import relations from './helper-functions/relations'

import {displayComponentFunctions} from '../../../custom-hooks'

export default (state, {idn, dispatch}) => {
    const {parent} = relations(state)
    const {allChildren, removeChild, sameActionChildren, copyChildren} = displayComponentFunctions({state})

    const id = idn ? idn : state.focus.id

    const copyTarget = (currentState, parent, [oldId, newId]) => {
        const minPropKey = nextKey(currentState.properties)
        const children = currentState.targets[oldId].children
        const newChildren = _.range(minPropKey, minPropKey + children.length)
        const newTarg = {...currentState.targets[oldId],
            parent,
            submitted : false,
            loading : false,
            children : [...newChildren]}

        const newState = {...currentState,
            targets : {...currentState.targets, [newId] : {...newTarg}}
        }
        const zipped = zipArrays(children, newChildren)

        return zipped.reduce((total, x) => copyProperty(total, newId, x), newState)
    }

    const copyProperty = (currentState, parent, [oldId, newId]) => {

        dispatch({type : 'COPY_OPTIONS', oldId, newId})

        const [newChildren, mapping] = copyChildren('properties', id)
        const newProp = {...currentState.properties[oldId],
            parent,
            children : keepCloning(newChildren)
        }
        const newState = {...currentState,
            properties : {...currentState.properties, [newId] : {...newProp}}
        }

        //console.log('mapping', mapping, newChildren)

        return mapping.reduce((total, x) => copyTarget(total, newId, x), newState)
    }

    const nextKeyVal = nextKey(state.targets)
    const newState = copyTarget(state, state.targets[id].parent, [id, nextKeyVal])
    /// fix thisd
    newState.properties[parent('targets', id)].children = [...newState.properties[parent('targets', id)].children, nextKeyVal]

    dispatch({type : 'ADD_NEW', requested : false, loading : false, ids : setMinus(Object.keys(state.properties), Object.keys(newState.properties)), category : 'property'})

    //console.log('newState', newState)
    
    return newState
}