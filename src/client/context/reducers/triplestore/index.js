export default (state, action) => {
    //console.log('triplestore reducer', state, action)
    const {type, triplestore} = action
    switch (type) {
        case 'COMPLETE_UPDATE' :
            return {...triplestore}
        case 'ADD_PREFIXES':
            return {...state, schema_prefixes : {...schema_prefixes, ...action.prefixes}}
        default: return state
    }
}