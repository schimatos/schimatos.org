export default (state, type, id) => {
    if (type === 'targets') {
        return {...setTargetSubmitted(state, id)}
    } else {
        return {...state.properties[id].children.reduce(setTargetSubmitted, state)}
    }
}

const setTargetSubmitted = (state, id) => {
    state.targets[id].submitted = true
}