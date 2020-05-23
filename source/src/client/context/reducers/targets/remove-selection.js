export default (state, id, value) => {
    //console.log('remove selectioncalled', state)
    state.property[id].selected = state.property[id].selected
    .filter(x => x!==value)
    //console.log('update targets', state)
    return {...state}
}