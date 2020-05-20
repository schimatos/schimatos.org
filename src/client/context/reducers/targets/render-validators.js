export default (state, {targets}) => {
    const {validators, property} = state
    //console.log('render validatros reducer called')
    return {...state, renderedValidators : validators({options : property, targets})}
}