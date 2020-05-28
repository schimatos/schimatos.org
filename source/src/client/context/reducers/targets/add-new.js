import { keepCloning } from "../../../utils"

export default (state, category, ids, requested, loading) => {

    //console.log('at add new', ids)

    const blank = () => category === 'property' ? Object({
        selected : [],
        options : [],
        loading,
        requested
    }) : Object({
        options : [],
        loading,
        requested
    })

    state[category] = ids.reduce((total, id) => {
        return Object({...total, [id] : blank()})
    }, state[category])

    return keepCloning({...state})
}