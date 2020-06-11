export default (state, id, type, loading) => {
    state[type][id] = {...state[type][id],
        submitted : state[type][id].value !== '',//true,
        loading : loading === true
    }

    return {...state}
}