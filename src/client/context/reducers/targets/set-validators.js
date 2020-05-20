export default (state, {validators}) => {
    return {...state, validators, validatorsMakeNo : state.validatorsMakeNo + 1}
}