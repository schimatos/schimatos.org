import requester from './requester/single-query'
import singleUpdate from './queries/single-update'
import {getConstraints, getConstraint} from './queries/get-constraints'
import {removeDuplicates, keepCloning, keyDelDict} from '../utils'
import {fillIn} from './get-nested-shape'

export const shaclProperties = async (props) => {
    const {action, triplestore, subject, path, pathType, toInsert, shacls} = props
    const {language} = triplestore
    const insertion = action === 'toInsert'

    console.log('triplestore at start of shacl properties', triplestore)

    const a = Object.entries(shacls).map(([k, v]) => {
        return [k, v.reduce((t, [shacl, i, w, v, u]) => {
            const name = '' + (i ? 'i' : '') + (w ? 'w' : '') + (v ? 'v' : '') + (u ? 'u' : '')
            return name === '' ? t :  Object({...t, [name] : [...(t[name] ? t[name] : []), shacl]})
        }, {})]
    })

    const b = a.reduce((t, [k, v]) => {
        return [...t, ...Object.entries(v).map(([sev, shacls]) => {
            const severity =  sev.split('').map(x => ({
                i : 'Info',
                w : 'Warning',
                v : 'Violation',
                u : 'undefined'
            }[x]))
            return [k, severity, shacls]
        })]
    }, [])

    const queryList = b.map(([graph, severities, shacls]) => {
        return [graph, getConstraints({shacls, severities, language : triplestore.language}), {severities, language : triplestore.language}]
    })

    const reduceResults = async results => {
        console.log('reduce results', results)
        const {groups, constraints} = results.reduce((t, x) => {
            console.log('reduce', t, x)
            const next = keepCloning({constraints : [...t.constraints, ...x.constraints], groups : {...t.groups, ...x.groups}})
            console.log(next)
            return next
        }, Object({constraints : [], groups : {}}))


    const newConstraints = constraints.reduce((t, x) => {
        const stringed = JSON.stringify(x)
        return t.includes(stringed) ? t :[...t, stringed]
    }, [])
    .map(JSON.parse)

    return {groups, constraints : newConstraints}

}


    // const fillInProperty = async response => {
    //     const dct = JSON.parse(x[0].r.value)
    //     if (dct.constraints) {
    //         dct.constratints
    //     } else {

    //     }


    //     if (propDict.property) {

    //         return 
    //     } else {
    //         return propDict
    //     }
    // }

    // [query, accumulator]

    const itermed = async (res, {severities, language}) => {




        const toFind = await removeDuplicates(Object.values(await res.constraints).reduce((t, x) => {
            return x.property ? (Array.isArray(x.property) ? [...t, ...x] : [...t, x.property]) : t
        }, []))
        console.log('toFind', await toFind)
        return toFind.map(blankNodeId => [getConstraint({blankNodeId, severities, language}), 
            (current, response) => {
            const constraints = current.constraints.map(x => {
                console.log(x)
                if (x.property === blankNodeId) {
                    x.property = response.constraints
                } else if (Array.isArray(x) && x.property.includes(blankNodeId)) {
                    x.property = [...x.property.filter(x => x!=blankNodeId), ...response.constraints]
                }
                return keepCloning(x)
            })
            console.log('current', current.groups, response.groups)
            const groups = {...current.groups, ...response.groups}
            return keepCloning({constraints, groups})
        }
    ])
    }

    // const reduceConstraints = constraits => {
    //     return constraints.reduce(([t,x], x) => {

    //     }, [[],[]])
    // }

    const postFilter = x => {
        const {constraints, groups} = JSON.parse(x[0].r.value)
        return {constraints, groups : keyDelDict(groups, '""')}
    }


    console.log('triplestore at end', triplestore)
    if (toInsert === undefined) {
        const results = await Promise.all(queryList.map(async ([graph, query, {severities, language}]) => {
            console.log('deets', severities, language)
            const resp = await requester(query, graph, triplestore, postFilter, [], false, itermed, {severities, language})
            console.log('resp', resp)    
            return await keepCloning(resp)
        })) 
        console.log('resilts2 qvcr5', keepCloning(await results))
        const p = keepCloning(await results)[0].constraints[0].property
        console.log('p', p)
        const toReturn  = await reduceResults(await keepCloning(results))
        //toReturn.constraints = {...toReturn.constraints, property : keepCloning(p)}
        console.log('resilts2ToReturn', await toReturn)
        console.log('resilts2 qvcr5', keepCloning(await results))
        return await keepCloning(toReturn)//await toReturn
    } else {
        const inserted = await requester(singleUpdate({ action : 'insert', graph : 'knamed', triples : toInsert}), 'kgraph', triplestore)
        const results = await Promise.all(queryList.map(async ([graph, query, {severities, language}]) => {
            console.log('deets', severities, language)
            const fx = await requester(query, graph, {...triplestore, inserted : (await inserted)},postFilter, [], false, itermed, {severities, language})
            console.log('fx', fx)
            return await keepCloning(fx)
        })) 
        console.log('resilts1', results)
        const toReturn  = await reduceResults(await results)
        console.log('toRturn', toReturn)
        return await keepCloning(toReturn)
    }
}