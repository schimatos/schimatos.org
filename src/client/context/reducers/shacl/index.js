import {keepCloning} from '../../../utils'

export default (state, action) => {
    //console.log('shacl reducer', state, action)
    const {shacl, type, id} = action
    switch (type) {
        case 'ALTER_SELECTION':
            const n = {...state, selections : {...state.selections, [id] : shacl}}
            return keepCloning(n)
        case 'INIT_ID':
            return ['undefined', ...Object.keys(state.selections)].includes(id.toString()) ? state : {...state, selections : {...state.selections, [id] : [[`{"graph":"DBpedia", "shacl":"est"}`, true, false, true]]}}
        default: return state
    }
}