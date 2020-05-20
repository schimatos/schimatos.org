import {isDict} from '../../../utils'

export default (state, {edits, action}) => {

    //const {inverse, normal} = edits

    const otherDirection = direction => direction === 'inverse' ? 'normal' : 'inverse'

    //action - remove, graphRemove, graphInsert, formInsert, 

    const metaReduceDict = ({reduce, init, f}) => {
        const reduceRecurse = (r, path, i) => {
            Object.entries(r).reduce((t, [p, rest]) => {
                const newPath = [...path, p]
                if (isDict(rest)) {
                    reduceRecurse(rest, newPath, t)
                } else {
                    return f(newPath, t)
                }
            }, i)
        }
        return reduceRecurse(reduce, [], init)
    }

    const newState = metaReduceDict({
        reduce : edits,
        init : state,
        f : (objects, [direction, subject, path, type], s) => {
            s[direction][subject] = s[direction][subject] || {}
            s[direction][subject][path] = s[direction][subject][path] || {}
            s[direction][subject][path][type] = s[direction][subject][path][type] || []

            s[direction][subject][path][type] = s[direction][subject][path][type].filter(x => !objects.includes(x[0]))

            if (action === 'graphInsert' || action === 'formInsert' || action === 'graphRemove') {
                s[direction][subject][path][type] = arraysUnion(s[direction][subject][path][type], objects.map(x => [x, action === 'graphInsert']))
            }

            if (type === 'anyURI') {
                if (action === 'remove' || action === 'graphRemove') {
                    s = objects.reduce((t, x) => {
                        if (t[otherDirection(direction)][x] && t[otherDirection(direction)][x][path] && t[otherDirection(direction)][x][path]['anyURI']) {
                            t[otherDirection(direction)][x][path]['anyURI'] = t[otherDirection(direction)][x][path]['anyURI'].filter(y => y!= subject)
                            if ( action === 'graphRemove') {
                                t[otherDirection(direction)][x][path]['anyURI'] = [...t[otherDirection(direction)][x][path]['anyURI'], [subject, false]]
                            }
                        }
                    }, s)
            }}
           return s
        }
    })

    // Object.entries(edits).reduce((t1, [direction, d1]) => {
    //     Object.entries(d1).reduce((t2, [subject, d2]) => {
    //         Object.entries(d2).reduce((t3, [path, objects]) => {
    //             t3[direction][subject] = t3[direction][subject] || {}
    //             t3[direction][subject][path] = t3[direction][path] || []

    //             if (action === 'remove' || action === 'graphRemove') {
    //                 t3[direction][subject][path] = t3[direction][subject][path].filter(x => !objects.includes(x[0]))
    //             }

    //         }, t2)
    //     }, t1)
    // }, state.path)



    // const {path} = state

    return {...newState}

}
