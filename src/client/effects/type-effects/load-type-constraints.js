import {setMinus, removeDuplicates} from '../../utils'

export default ({TargetsContext : [{typeConstraints, propertyTypes},], endpoint}) => {
    const types = typesWithoutDetails(propertyTypes, typeConstraints)
    //console.log('load type constraints called', types)
    if (types.length > 0) {
        endpoint({
            query : 'LOAD_TYPE_CONSTRAINTS',
            context : 'targets',
            response : {type : 'TYPES_LOADED', types},
            other : {types}
        })
    }
}

const extractAllTypes = typesMapping => {
    //console.log('types mapping', typesMapping)
    const allTypes = Object.values(typesMapping).reduce((t, {fromOptions, fromRange}) => {
        //console.log(t, fromOptions, fromRange)
        return [...t, ...fromOptions, ...fromRange]
    }, [])
    return removeDuplicates(allTypes)
}

const typesWithoutDetails = (typesMapping, typesDetails) => {
    return setMinus(extractAllTypes(typesMapping), Object.keys(typesDetails))
}