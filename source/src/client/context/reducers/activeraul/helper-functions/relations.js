export default state => {

    const otherType = type => {
        return (type === 'targets') ? (
            'properties'
        ) : (
            'targets'
        )
    }

    const parent = (type, id) => state[type][id].parent

    const siblingIDs = (type, id) => {
        return state[otherType(type)][parent(type, id)].children
    }

    const siblings = (type, id) => {
        const sib = siblingIDs(type, id)
        .map(i => state[type][i])

        return sib
    }

    const siblingValues = id => {
        const vals = siblings('targets', id)
        .map(x => x.value)

        return vals
    }

    return {
        parent,
        siblingIDs,
        siblings,
        siblingValues,
        otherType
    }
}

export const otherType = type => {
    return (type === 'targets') ? (
        'properties'
    ) : (
        'targets'
    )
}

export const parent = (type, id) => state[type][id].parent

export const siblingIDs = (type, id) => {
    return state[otherType(type)][parent(type, id)].children
}

export const siblings = (type, id) => {
    const sib = siblingIDs(type, id)
    .map(i => state[type][i])

    return sib
}

export const siblingValues = id => {
    const vals = siblings('targets', id)
    .map(x => x.value)

    return vals
}