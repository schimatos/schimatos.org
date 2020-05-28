import {setMinus, keyDelDict, removeDuplicates} from '../../utils'

export default ({ActiveraulContext : [{propertyList},], TargetsContext : [{propertyTypes},], endpoint}) => {
    ////console.log('inside load types')
    const properties = findUnknownTypes(propertyList, propertyTypes)
    ////console.log('properties', properties)
    if (properties.length > 0) {
        endpoint({
            query : 'LOAD_TYPES',
            context : 'targets',
            response : {type : 'PROPERTY_TYPES_LOADED', properties},
            other : {properties}
        })
    }
}

const extractAllProperties = path => {
    if (Array.isArray(path)) {
        const toReduce = Array.isArray(path[0]) ? path[1] : path
        return toReduce.reduce((t, x) => [...t, ...extractAllProperties(x)], [])
    } else {
        return [path]
    }
}

const findUnknownTypes = (propertyList, propertyTypes) => {
    const values = Object.values(keyDelDict(propertyList, -1))
    const properties = removeDuplicates(values.reduce((t, {path}) => [...t, ...extractAllProperties(path)], []))
    const knownTypes = Object.keys(propertyTypes)
    return setMinus(properties, knownTypes)
}