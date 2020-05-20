export default (state, {path}) => {
    const {targets, properties, propertyList} = state
    Object.entries(properties).reduce((targets, [id, p]) => {
        const {children, parent, property} = p
        const {path, pathType} = propertyList[property]
        const subject = targets[parent].value
    }, targets)
    return state
}
