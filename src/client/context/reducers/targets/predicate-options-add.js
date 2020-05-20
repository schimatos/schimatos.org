import {extendUnduplicatedArray} from '../../../utils'

export default (state, {predicate, options}) => {
    return {...state, predicates : {[predicate] : extendUnduplicatedArray(state.predicates, options)}}
}