export default (state, type, id, noHold, startPoint) => {
    const hold = !noHold && (type !== startPoint.type || id !== startPoint.id) && state[type][id]
    state.focus = state.focus.hold || !state[type][id] ? {...state.focus, hold} : {type, id, hold}

    return {...state}
}