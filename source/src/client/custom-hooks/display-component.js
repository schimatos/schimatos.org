import {useContext} from 'react'

import conversions from './helper-functions/conversions'
import {ActiveraulContext} from '../context'

import {dictMap, nextKey, zipArrays} from '../utils'

import _ from 'underscore'

export const displayComponent = () => {
    ////console.log('display component')
    const {displayIRI} = conversions(0)
    const [state,] = useContext(ActiveraulContext)
    return displayComponentFunctions({state, displayIRI})
}

export const displayComponentFunctions = ({state, displayIRI}) => {
    const {properties, targets, propertyList} = state

    const pathString = id => {
        ////console.log(properties, id)
        const path = propertyList[properties[id].property].path
        return Array.isArray(path) ? path.slice(1).reduce((t, x) => t+'|'+displayIRI(x), displayIRI(path[0])) : displayIRI(path)
    }

    const targetString = id => targets[id].value ? displayIRI(targets[id].value) : 'undefined...'

    const componentString = (t, id) => t === 'targets' ? targetString(id) : pathString(id)

    const getChildren = (t, id) => state[t][id] ? (state[t][id].children ? state[t][id].children : []) : []

    const typeSpecificChildren = (t, id, arrFunc, dictFunc) => {
        const children = getChildren(t, id)
        return Array.isArray(children) ? arrFunc(children) : dictFunc(children)
    }

    const sameActionChildren = (t, id, f) => typeSpecificChildren(t, id, f, x => dictMap(x, ([k, v]) => f(v) ))

    const allChildren = (t, id) => {
        return typeSpecificChildren(t, id, x => x, x => Object.entries(x).reduce((t, [k,v]) => [...t, ...v], []))
    }

    const filterChildren = (t, i, f) => sameActionChildren(t, i, x => x.filter(f))

    const removeChild = (t, i, filterId) => filterChildren(t, i, y => y!=filterId)

    const copyChildren = (t, id) => {
        const minkey = nextKey(state[t === 'targets' ? 'properties' : 'targets'])
        ////console.log('minkey', minkey)
        return typeSpecificChildren(t, id, x => [_.range(minkey, minkey + x.length), zipArrays(x, _.range(minkey, minkey + x.length))],dictCopyChildren(minkey))
        
    }

    const dictCopyChildren = minkey => {
        return x => {
            const  [newChilds, mapping] = Object.entries(x).reduce(([t, mapping, min], [v, childs]) => {
                const next = min + childs.length
                ////console.log(min, next)
                const newChilds = _.range(min, next)
                const newMapping = zipArrays(childs, newChilds)
                return [[...t, [v, _.range(min, next)]], [...mapping, ...newMapping], next]
                }, [[], [], minkey])
            return [Object.fromEntries(newChilds), mapping]
        }
    }

    return {
        pathString,
        targetString,
        componentString,
        allChildren,
        filterChildren,
        removeChild,
        copyChildren
    }
}