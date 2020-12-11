import {arraysUnion, strip} from '../../../utils'

export default (state, {category, id, res, displayIRI}) => {
    const entry = value => Object({key : value, text : displayIRI(value), value})
    // console.log('search response', state, category, id, res, displayIRI)
    
    if (category === 'property') {
        const {selections, options} = res
        const customUnion = (dicts, lists) => {
            const keys = arraysUnion([...dicts.map(dict => dict.map(x=>x.key)), ...lists])
            return keys.map(entry)
        }

        state.property[id] = {
            selected : customUnion([state.property[id].selected],[selections]),
            options : customUnion([state.property[id].options],[options, selections]),
            loading : false,
            requested : true          
        }
        return {...state}
    } else {
        const {options} = res
        const opt = options.map(entry)
        state[category][id] = {
            options : customUnion([state.property[id].options, options]),
            loading : false,
            requested : true  
        }
        return {...state}
    }
}