export default (state, {deep, types, prop, value, start}) => {
    
    const layerUpdate = (s, t, i) => {
        return s[t][i].children.reduce((total, child) => {
            const t2 = t === 'targets' ? 'properties' : 'targets'
            total[t2][child][prop] = (types.includes(t2)) ? value : total[t2][child][prop]
            return deep ? layerUpdate(total, t2, child) : total
        }, s)
    }
    const newState = {...layerUpdate(state, start.type, start.id)}
    return {...newState}
}