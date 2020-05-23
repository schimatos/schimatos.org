import updateAllChildren from './helper-functions/update-all-children'

export default (state, {hidden}) => {
    return updateAllChildren(state, {deep : true, types : ['targets', 'properties'], prop : 'hidden', value : hidden, start : state.focus})
}