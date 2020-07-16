import {useContext} from 'react'
import {TriplestoreContext} from '../context'

import {graphUpdate} from './graph-update'
import {allProperties} from './all-properties'
import {insertTtl} from './insert-ttl'
import {listShacls} from './list-shacls'
import {listOptions} from './list-options'
import {loadTypeConstraints} from './load-type-constraints'
import {loadTypes} from './load-types'
import options from './options.js'
import { shaclProperties } from './shacl-properties'
import { datatypeFind } from './datatype-find'
import { classFind } from './class-find'
import conversions from '../custom-hooks/helper-functions/conversions'
import targetDetails from './target-details.js'
import getlabel from './get-label.js'
import getlabels from './get-labels.js'
import getlabelsanddetails from './get-labels-and-details.js'

export default () => {
    const [triplestore,] = useContext(TriplestoreContext)
    const {makeQueryTerm, makeIRI} = conversions(0)
    return async props => {
        const {errorFunc, responseFunc, initFunc, query, targets} = props
        const updatedProps = {...props, triplestore, makeQueryTerm, makeIRI}
        initFunc && initFunc()
        //console.log('query call', props)
        //console.log('triplestore', triplestore)
        try {
            const response = {
                'SHACL_PROPERTIES' : shaclProperties,
                'ALL_PROPERTIES' : allProperties,
                'GRAPH_UPDATE' : graphUpdate,
                'INSERT_TTL' : insertTtl,
                'LIST_OPTIONS' : listOptions,
                'LIST_SHACLS' : listShacls,
                'LOAD_TYPES' : loadTypes,
                'OPTIONS' : options,
                'LOAD_TYPE_CONSTRAINTS' : loadTypeConstraints,
                'DATATYPE_FIND' : datatypeFind,
                'CLASS_FIND' : classFind,
                'TARGET_DETAILS' : targetDetails,
               // 'TARGET_DETAILS_TYPE' : targetDetailsType,
                'GET_LABEL' : getlabel,
                'GET_LABELS' : getlabels,
                'GET_LABELS_AND_DETAILS' : getlabelsanddetails
            }[query](updatedProps)

            //console.log('response', await response)
            const res = await Array.isArray(await response) ? Promise.all(await response) : await response
            //console.log('res', res)
            const aggregated = ({
                'ALL_PROPERTIES' : async r => {
                    return (await r).reduce((total, x) => {
                        return Object.entries(x).reduce((t, [k, v]) => Object({...t, [k] : [...(t[k] ? t[k] : []),...v] }), total)
                    }, {})
                },
                'SHACL_PROPERTIES' : r => Object.fromEntries(targets.map(x => [x, r])),
                'LOAD_TYPE_CONSTRAINTS' : r => r.reduce((t, x) => ({...t, ...x}), {})
            })[query]

            const processed = await aggregated ? aggregated(await res) : res
            //console.log('processed at index', await processed && processed[''] && processed[''].constraints && processed[''].constraints[0])
            responseFunc(await processed)
        } catch (e) {
            //console.log(e)
            errorFunc && errorFunc(e)
        }
    }
}