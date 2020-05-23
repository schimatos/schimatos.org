export default (state, id, type, loading) => {
    state[type][id] = {...state[type][id],
        submitted : true,
        loading : loading === true
    }

    return {...state}
}