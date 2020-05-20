import {useContext} from 'react'
import {TargetsContext, TriplestoreContext, HistoryContext, LayoutContext} from '../context'
import Activeraul from '../custom-hooks/activeraul-history'

import {filterDict, keysDelDict} from '../utils'

import endpointFunc from './helper-functions/endpoint'
import conversions from '../custom-hooks/helper-functions/conversions'
import triplestoreInterface from '../triplestore-interface'

export const useActiveraul = () => {
    //console.log('use activeraul')
    const {makeIRIMulti, makeIRIMixed, makeIRI} = conversions(0)
    const shaclConversions = conversions(1)
    const endpoint = endpointFunc()
    const [state, dispatch] = Activeraul()
    const {focus, properties, propertyList} = state
    const [{settings, knowledge_graphs, hide_graph_prefixes, add_graph_prefixes, advanced_features},] = useContext(TriplestoreContext)
    const [targets, targetsDispatch] = useContext(TargetsContext)
    const [{startPoint}, dispatchLayout] = useContext(LayoutContext)
    const [,historyDispatch] = useContext(HistoryContext)
    const graph = knowledge_graphs[settings.knowledge_graph]
    const prefix = graph.prefix
    const triplestore = triplestoreInterface()

    const getName = () => focus.type === 'properties' ? (
        propertyList[properties[id].property].name ? propertyList[properties[id].property].name : propertyList[properties[id].property].path
    ) : (
        state.targets[id].value
    )

    const addOptionFlexible = (type, id, v) => {
        //console.log(type, id, v)
        if (type === 'targets') {
            addOption(id, state.targets[id].parent, v)
        } else {
            const emptyTargets = state.properties[id].children.reduce((t, targ) => state.targets[targ].value === '' ? [...t, targ] : t, [])
            if (emptyTargets.length > 0) {
                addOption(emptyTargets[emptyTargets.length-1], id, v)
            } else {
                addNewOption(id, v)
            }
        }
    }

    const addOption = (i, no, v, type) => {
        if (v!=='') {  
            //console.log('type ad addOption', i, no, v, type)
        const value = v.includes(':') || !add_graph_prefixes || !(type || []).includes('anyURI') ? v : prefix + v
        dispatch({type : 'ADD_OPTION', i, value, targets, render : true, prefix, hide : hide_graph_prefixes})
        targetsDispatch({type : 'ADD_OPTION', no, value, prefix, hide : hide_graph_prefixes})
        }
    }

    const addNewOption = (no, v) => {
        if (v!=='') {
        const value = v.includes(':') || !add_graph_prefixes || !(type || []).includes('anyURI') ? v : prefix + v
        dispatch({type : 'ADD_OPTIONS_FIELD', no, value, targets, render : true, prefix, hide : hide_graph_prefixes})
        targetsDispatch({type : 'ADD_OPTION', no, value, prefix, hide : hide_graph_prefixes})
        }
    }

    const addOptionOnly = (i, no, v) => {
        if (v!=='') {
        const value = v.includes(':') || !add_graph_prefixes || !type.includes('anyURI') ? v : prefix + v
        targetsDispatch({type : 'ADD_OPTION', no, value, prefix, hide : hide_graph_prefixes})
        }
    }

    const activeraulSubmission = async ({getShacl, insert, query, applyTo, shacls}) => {
        const {type, id} = applyTo !== undefined ? applyTo : {...focus}
        const isTarg = type === 'targets'
        const key = isTarg ? state.targets[id].parent : id
        const ids = isTarg ? [id] : properties[id].children
        const targets = ids.map(i => state.targets[i].value)
        const prop = properties[key]
        const {path, pathType, class : sClass, datatype} = prop.property !== undefined ? propertyList[prop.property]  : {path : '', pathType : ''}
        const subject = prop.parent !== undefined ? state.targets[prop.parent].value : ''
        const action = key > -1 && insert ? 'insert' : undefined

        console.log(sClass,propertyList[prop.property] )

        // sClass && endpoint({
        //     query : 'GRAPH_UPDATE',
        //     responseFunc : x => x,
        //     errorFunc : x => x,
        //     toInsert : [[targets[0], 'a', ['',sClass]]]
        // })

        //console.log('detauls', subject, path, targets)

        // const datatypes = pathType === 'path' ? await new Promise((resolve, reject) => {
        //     triplestore({
        //         responseFunc : resolve,
        //         errorFunc : reject,
        //         query : 'DATATYPE_FIND',
        //         subject,
        //         path,
        //         targs : targets
        //     }) 
        // }) : {}

        // const classes = subject!== '' ? await new Promise((resolve, reject) => {
        //     triplestore({
        //         responseFunc : resolve,
        //         errorFunc : reject,
        //         query : 'CLASS_FIND',
        //         subject,
        //         path,
        //         targs : targets
        //     }) 
        // }) : {}

        // const targsToRemove = Object.entries(datatypes).reduce((total, [k, v]) => {
        //     return [...total, ...v.map(x => [k, x])]
        // }, [])

        // //console.log('datatypes', await datatypes, await classes, targsToRemove)

        // const classInserts = sClass ? targets.reduce((total, x) => {
        //     return [...total, ...[classes[x].includes(sClass) ? [] : [[x, 'a', sClass]]]]
        // }, []) : []

        //console.log('class inserts', classInserts)
        
        //const triplestore({responseFunc})

        //const types = 
        // send query below

        // SELECT (concat('{', group_concat(distinct ?ts; separator=','), '}') as ?r) WHERE{
        //     SELECT (concat('"', str(?d), '":["' , group_concat(distinct (datatype(?d) as ?t); separator='","'), '"]') as ?ts)  {
        //     <a> <b> ?d
        //     FILTER(str(?d) IN ("1", "2"))
        //     } GROUP BY str(?d)}

        // case 1
        //[targets, type]


        // case 2
        // targets.map(x => [`<${x}>`, 'a', `<${class}>` )


        // also need to handle the undo process for taking into account when existing class be accidentally deleted



        endpoint({
            query, context : 'activeraul',
            edit : [{subject, path, targets : datatype ? targets.map(x => x) : targets, pathType, action, ...(sClass && {additionalTriples : [['<'+targets[0] + '>', '<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>', '<' + sClass + '>']]})}, {subject, path, pathType, action : 'delete'}],
            init : {type : 'SUBMISSION_MADE', id, t : type, loading : true},
            response : {type : 'SUBMISSION_RESPONSE', dispatch : targetsDispatch, id},
            error : {type : 'SUBMISSION_ERROR', id, t : type},
            other : {getShacl, targets, shacls}
        })
    }

    const editDetails = (type, id, action) => {
        if (type === 'targets') {
            const parentId = state.targets[id].parent
            const targets = [state.targets[id].value]
            const {parent, property} = state.properties[parentId]
            const {path, pathType} = state.propertyList[property]
            const subject = state.targets[parent].value
            return {subject, path, targets, pathType, action}
        } else {
            const {property, parent, children} = state.properties[id]
            const targets = children.map(x => state.targets[x].value)
            const {path, pathType} = propertyList[property]
            const subject = state.targets[parent].value
            return {subject, path, targets, pathType, action}
        }   
    }




    const applyShacls = sh => {

        const sh2 = !advanced_features.manually_select_undefined_severities ? sh.map(([shacl, info, warning, violation,]) => [shacl, info, warning, violation, violation]) : sh

        const shacls = sh2.reduce((t, [details, info, warning, violation, und]) => {

            const {graph, shacl} = JSON.parse(details)
            return {...t, [graph] : [...(t[graph] ? t[graph] : []), [shacl, info, warning, violation, und]]}
        }, Object({}))
        activeraulSubmission({getShacl : true, insert : true, query : 'SHACL_PROPERTIES', shacls})
    }

    const submission = getShacl => {
        activeraulSubmission({getShacl, insert : true, query : 'SHACL_PROPERTIES', shacls : []})
        //activeraulSubmission({getShacl, insert : true, query : 'ALL_PROPERTIES'})
    }

    const addPath = vl => {
        const value = filterDict({...vl, ...Object.fromEntries(vl.other)}, ([k,v]) => k!=='other' && v!=='')
        //console.log('value at add path',value)
        value.path = makeIRIMixed(value.path)
        //console.log('value at add path',value)
        dispatch({type : 'ADD_PATH', dispatch : targetsDispatch, value})
    }

    const updatePath = (id, value) => dispatch({type : 'ADD_PATH', id, value})

    const editQuery = ({type, id, action, init, response, error}) => endpoint({
        query : 'GRAPH_UPDATE', context : 'activeraul',
        edit : editDetails(type, id, action),
        init, response, error, other : {graph : 'k'}
    })

    const remove = (t, id, editTriplestore) => {
        //console.log('editTriplestore', editTriplestore)
        startPoint.type === t && startPoint.id === id && dispatchLayout({type : 'CHANGE_START', startPoint : {type : t === 'targets' ? 'properties' : 'targets', id : state[t][id].parent}})
        //console.log(editTriplestore, 'editTriplestore')
        // editTriplestore ? editQuery({
        //     type : t, id, action : 'delete',
        //     init : {type : 'CHANGE_LOAD_STATUS', loading : true,  t, id},
        //     response : [{type : 'REMOVE', t, id}, {context : 'targets', type : 'REMOVE_SELECTION', i : state.targets[id].parent, value : state.targets[id].value}],
        //     error : {type : 'CHANGE_LOAD_STATUS', loading : false, t, id}
        // }) : dispatch({type : 'REMOVE', t, id})
        // temporary fix

        editQuery({
                type : t, id, action : 'delete',
                init : {type : 'CHANGE_LOAD_STATUS', loading : true,  t, id},
                response : [{type : 'REMOVE', t, id}, {context : 'targets', type : 'REMOVE_SELECTION', i : state.targets[id].parent, value : state.targets[id].value}],
                error : {type : 'CHANGE_LOAD_STATUS', loading : false, t, id}
        })
        dispatch({type : 'REMOVE', t, id})
    }

    const copyForm = () => dispatch({type : 'COPY_FORM', dispatch : targetsDispatch})

    const saveShacl = x => {
        const forceIRI = name => {
            return '<'+(shaclConversions.makeIRI(name))+'>'
        }

        const forceIRIKg = name => {
            return '<'+makeIRI(name)+'>'
        }
        
        const targetByPrefixes = targetsDict => {
            const allPrefixes = Object.entries(targetsDict)
            .reduce((total, x) => `${total}${targetBy(x)}`,``)
            return allPrefixes
        }
        
        const targetBy = ([targetType, targets]) => {
            const number = targets.length
            return number === 0 ? '' : (
            targets.reduce((total, x, i) => i < number - 1 ? `${total} ${forceIRIKg(x)},` : `${total} ${forceIRIKg(x)}${number > 1 ? ']' : ''} ;`,`\nsh:target${targetType} `+(number > 1 ? '[' : ''))
            )
        }
        
        const property2ttl = getShacl//(property, children, depth)
        
        const turtleProperties = (id, state, depth) => {
            const childs = state.targets[id].children
            .reduce((total, x) => {
                const {children, property} = state.properties[x]
                //console.log('inside turtle properties')
                return `${total}${property2ttl(state.propertyList[property], children.reduce((t, i) => `${t}${turtleProperties(i, state, depth + 1)}`, ``))}`
            }, ``)
            return childs
        }

        const name = x.name
        const targetDict = filterDict(x, ([k,v]) => k!=='name')
        const ttlString = `${forceIRI(name)}
        a sh:NodeShape ;${targetByPrefixes(targetDict)}${turtleProperties(state.focus.id, state, 0)}`.split(';')
        ttlString.pop()
        const res = ([].concat(ttlString)).reduce((t,x) => t+(t!=='' ? ';' : '')+x, '').replace(',',';') + '.'


        'hello'.trimEnd().replace(',',';')

        //console.log(res)

        endpoint({
            query : 'INSERT_TTL',
            other : {ttl:res, graph : 's'}
        })
    }

    const getShaclText = x => {
        const forceIRI = name => {
            return '<'+(shaclConversions.makeIRI(name))+'>'
        }

        const forceIRIKg = name => {
            return '<'+makeIRI(name)+'>'
        }
        
        const targetByPrefixes = targetsDict => {
            const allPrefixes = Object.entries(targetsDict)
            .reduce((total, x) => `${total}${targetBy(x)}`,``)
            return allPrefixes
        }
        
        const targetBy = ([targetType, targets]) => {
            const number = targets.length
            return number === 0 ? '' : (
            targets.reduce((total, x, i) => i < number - 1 ? `${total} ${forceIRIKg(x)},` : `${total} ${forceIRIKg(x)}${number > 1 ? ']' : ''} ;`,`\nsh:target${targetType} `+(number > 1 ? '[' : ''))
            )
        }
        
        const property2ttl = getShacl//(property, children, depth)
        
        const turtleProperties = (id, state, depth) => {
            const childs = state.targets[id]?.children || []
            .reduce((total, x) => {
                const {children, property} = state.properties[x]
                console.log('inside turtle properties', depth)
                return `${total}${property2ttl(state.propertyList[property], children.reduce((t, i) => `${t}${turtleProperties(i, state, depth + 1)}`, ``), depth)}`
            }, ``)
            return childs
        }

        //const name = x.name
        //const targetDict = filterDict(x, ([k,v]) => k!=='name')
        const ttlString = `${turtleProperties(state.focus.id, state, 0)}`.split(';')
        ttlString.pop()
        const res = ([].concat(ttlString)).reduce((t,x) => t+(t!=='' ? ';' : '')+x, '').replace(',',';') + '.'


        'hello'.trimEnd().replace(',',';')

        console.log(res)

        return res

        // endpoint({
        //     query : 'INSERT_TTL',
        //     other : {ttl:res, graph : 's'}
        // })
    }

    const undoForm = props => {
        graphUpdate(props, 'UNDO')
    }

    const redoForm = props => {
        graphUpdate(props, 'REDO')
    }

    const graphUpdate = ({toInsert, toDelete}, type) => {
        if (toInsert || toDelete) {
            endpoint({
                query : 'GRAPH_UPDATE', context : 'history',
                response : {type, activeraulDispatch : dispatch},
                // CONSOLE LOG SOME ERROR MESSAGE error : {type : 'SUBMISSION_ERROR', id, t : type},
                other : {toInsert, toDelete, graph : 'k'}
            })
        } else {
            historyDispatch({type, activeraulDispatch : dispatch})
        }        
    }

    const cancelLoad = (type, id) => {
        dispatch({type : 'CHANGE_LOAD_STATUS', loading : false, type, id})
    }

    const getShacl = (property, children, depth) => {
        //console.log('get shacl called', property, children, depth)
        try {
            const indent = _.range(0, depth).reduce((total, x) => `${total}\t`, ``)
            //console.log('indent', indent, depth)
            const prop = { ...keysDelDict(['path', 'pathType'], property), [property.pathType]: '<' + property.path + '>' }
            const body = Object.entries(prop)
                .reduce((total, [k, v]) => {
                    let constraint = v
                    if (Array.isArray(v)) {
                        const first = v.pop()
                        constraint = `(${v.reduce((t, x) => `${t} ${x}`, first)})`
                    }
                    return `${total}\n\t\t${indent}sh:${k} ${k === 'message' ? '"' : ''}${['severity'].includes(k) ? 'sh:' + constraint : constraint}${k === 'message' ? '"' : ''} ;`
                }, ``)
            return `\n\t${indent}sh:property [${body}${children}\n\t${indent}] ;`
        } catch {
            return ''
        }
    }

    //const getShaclText = getShacl()

    return {
        getName,
        addOption,
        submission,
        addPath,
        updatePath,
        remove,
        applyShacls,
        addOptionOnly,
        saveShacl,
        copyForm,
        undoForm,
        redoForm,
        cancelLoad,
        addOptionFlexible,
        getShaclText
    }
}


