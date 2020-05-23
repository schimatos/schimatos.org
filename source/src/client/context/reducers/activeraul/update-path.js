export default (state, id, value) => {
    return {...state, propertyList : {...state.propertyList, [id] : value}}
}