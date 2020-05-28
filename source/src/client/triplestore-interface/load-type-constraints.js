import requester from './requester/single-query'
import singleUpdate from './queries/single-update'
import {getTypes, getConstraint} from './queries/get-constraints'
import {removeDuplicates, keepCloning, keyDelDict, dictValuesMap} from '../utils'

export const loadTypeConstraints = async ({types, triplestore}) => {
    const typeQuery = getTypes({types})

    const postFilter = x => {
        //console.log('at post filter', x)
        const constraints = JSON.parse(x[0].r.value)

        return dictValuesMap(constraints, v => dictValuesMap(v, x => x.length === 1 ? x[0] : x))
    }

    const typeDetails = await requester(typeQuery, 'tgraph', triplestore, postFilter, {}, false)

    //console.log('type details', await typeDetails)
    return await typeDetails
}