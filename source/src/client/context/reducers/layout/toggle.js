export default (state, panel) => {
    state[panel] = !state[panel]
    return {...state}
}