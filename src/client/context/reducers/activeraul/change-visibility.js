export default (state, {id, ttype, hidden}) => {
    state[ttype][id].hidden = hidden
    return {...state}
}