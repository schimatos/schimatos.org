export default (state, id, type) => {
    state[type][id] = {...state[type][id],
        submitted : false,
        loading : false
    }
   
    return {...state}
}