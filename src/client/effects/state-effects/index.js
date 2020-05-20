import renderValidators from './render-validators'

export default ({ActiveraulContext : [state,], TargetsContext : [{validatorsMakeNo,},]}) => {
    //console.log('at state effects')
    return [[renderValidators], [{...state, validatorsMakeNo}, 'focus']]
}