import {nextKey} from '../../../utils'

export default (state, {value, dispatch}) => {
    const plistKey = nextKey(state.propertyList)
    const pKey = nextKey(state.properties)
    const tKey = nextKey(state.targets)
    value.minCount = parseInt(value.minCount)
    const tKeys = _.range(tKey, tKey + value.minCount)

    const emptyTarg = (index, parent) => {
        return ([index, {
            parent,
            submitted : false,
            shacled : false,
            loading : false,
            children : [],
            value : '',  
            hidden : false
        }])
    }

    const {id} = state.focus

    state.targets[id].children = [...state.targets[id].children, pKey]
    state.targets = {...state.targets, ...Object.fromEntries(tKeys.map(x => emptyTarg(x, pKey)))}



    state.properties[pKey] = {parent : id, property : plistKey, children : value.pathType === 'alternativePath' ? Object.fromEntries([...value.path.map(x=>[x, []]), [0, tKeys]]) : tKeys, ...(value.pathType === 'alternativePath' ? {pathOpen : value.path[0]} : {}) }
    state.propertyList[plistKey] = value

    
    
    dispatch({type : 'ADD_NEW', requested : false, loading : false, ids : [pKey], category : 'property'})

    return {...state}
}