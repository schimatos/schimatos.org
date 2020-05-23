import toggle from './toggle'

export default (state, action) => {
    //console.log('layout reducer', state, action)
    const {type, panel, layout, startPoint} = action
    switch (type) {
        case 'COMPLETE_UPDATE' :
            return {...layout}
        case 'TOGGLE':
            return toggle(state, panel)
        case 'CHANGE_START':
            return {...state, startPoint}
        default: return state
    }
}