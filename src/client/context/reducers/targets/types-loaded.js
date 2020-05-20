import {setMinus, dictsMerge} from '../../../utils'
export default (state, {res, types}) => {

    const noType = setMinus(types, Object.keys(res))

    const extra = Object.fromEntries(noType.map(x => [x, {}]))

    //console.log('types loaded before dict merge', res)

    return {...state, typeConstraints : dictsMerge([extra, res])}
}