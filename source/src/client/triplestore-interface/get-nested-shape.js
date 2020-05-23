import {orderedShapeLoad} from './queries/generic-nodeshape-load'

const getUnknowns = (unknowns, initQuery) => {
    return (initQuery || orderedShapeLoad)(unknowns)
    const res = (initQuery || orderedShapeLoad)(unknowns)
    const filteredRes = dictValuesMap(res, v => v.map(fillIn))
}

export const fillIn = ([property, set, ordered]) => {
    if (ordered === "0") {
        const reordered = reorder(set)
        const unknowns = reordered.filter(x => x.split(9) === "nodeID://b")
        const fills = getUnknowns(unknowns)
        return [property, set.map(x => x.split(9) === "nodeID://b" ? fills[x] : x)]
    } else {
        const unknowns = Object.values(set).filter(x => x.split(9) === "nodeID://b")
        const fills = getUnknowns(unknowns)
        return [property, dictValuesMap(set, v => v.split(9) === "nodeID://b" ? fills[v] : v)]
    }


    // const unknowns = Object.values(set).filter(x => (Array.isArray(x) ? x[0] : x).split(9) === "nodeID://b")
    // const fills = getUnknowns(unknowns)
    // return dictValuesMap(set, v => {
    //     if (x.split(9) === "nodeID://b") {
    //         return fills[v]
    //     } else {
    //         return v
    //     }
    // })
    // if (ordered === "1") {
    //     return [property, set]
    // } else {
    //     return [property, reorder(set)]
    // }
}

const reorder = set => {
    const keys = Object.keys(set)
    //const start = setMinus(Object.keys(set), Object.values(set))
    const array = keys.reduce(([list, x],) => [[...list, set[x][0]], set[x][1]], [[], 'start'])
    return array
}

