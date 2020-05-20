import {extendUnduplicatedArray} from '../../../utils'

export default (state, {res}) => {
    const propertyTypes = Object.entries(res).reduce((t, [iri, types]) => {
        const {fromOptions, fromRange} = state[iri] ? state[iri] : {}
        return {...t , [iri] : {fromOptions : extendUnduplicatedArray(fromOptions, types.fromOptions), fromRange : extendUnduplicatedArray(fromRange, types.fromRange)}}
    }, state.propertyTypes)

    return {...state, propertyTypes}

}