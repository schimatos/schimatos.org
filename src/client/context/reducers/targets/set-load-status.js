export default (state, {category, ids, loading}) => {

    ids.forEach(id => {
        state[category][id].loading = loading
    })

    return {...state}
}