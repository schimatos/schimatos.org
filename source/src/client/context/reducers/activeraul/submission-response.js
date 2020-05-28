import _ from 'underscore'

import updateProperties from './helper-functions/update-properties'

import {keepCloning} from '../../../utils'

export default (state, {res, dispatch, id}) => {
    const newProperties = keepCloning(res[state.targets[id].value] ? res[state.targets[id].value] : [])
    state.targets[id].loading = false
    //console.log('submission response before update properties', keepCloning(res), keepCloning(newProperties))
    const {ids, newState} = keepCloning(updateProperties({state, id, newProperties}))
    //const {ids : ids2, newState : newState2} = newProperties.property ? updateProperties({state : newState, id : newState.properties[ids[0]].children[0], newProperties : newProperties.property}) : {ids : [], newState}
    //console.log('res at submssion response', res, ids, keepCloning(newState), newState)
    dispatch({type : 'ADD_NEW', requested : false, loading : false, ids, category : 'property', newState})

    ////console.log(newProperties, newState, newState2)

    return keepCloning(newState)
}