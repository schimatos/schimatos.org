import requester from './requester/single-query'
import {fromOptions, fromRange} from './queries/types-load'
import {setMinus, dictValuesMap} from '../utils'

export const loadTypes = async ({properties, triplestore}) => {

    const rangeQuery = fromRange({properties})


    const knownRangeTypes = await requester(rangeQuery, 'kgraph', triplestore, x => JSON.parse(x[0].r.value), {}, false)
    const knownRangePredicates = Object.keys(knownRangeTypes)
    const stillUnknownTypes = setMinus(properties, knownRangePredicates)

    const optionsQuery = fromOptions({properties : stillUnknownTypes})

    const typesFromOptions = await requester(optionsQuery, 'kgraph', triplestore, x => JSON.parse(x[0].r.value), {}, false)

    const noTypeInfo = setMinus(stillUnknownTypes, Object.keys(typesFromOptions))
    const noTypeDict = Object.fromEntries(noTypeInfo.map(p => [p,[]]))
    //console.log('types loaded in trip', typesFromOptions, knownRangeTypes)

    const retrievedTypeInfo = await {...dictValuesMap(await knownRangeTypes, v => ({fromRange : v})), ...dictValuesMap((await {...typesFromOptions, ...noTypeDict}), v => ({fromOptions : v}))}

    //console.log('types loaded in trip', await retrievedTypeInfo)

    return await retrievedTypeInfo
}