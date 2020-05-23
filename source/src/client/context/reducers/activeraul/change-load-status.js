export default (state, {loading, t, id}) => {
    state[t][id].loading = loading
    return {...state}
}