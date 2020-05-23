import requester from './requester/single-query'
import {targetToProperties} from './queries/target-to-properties'
import {insertTriples} from './queries/subqueries'
//import {findDatatypes} from './queries/findDatatypes'
import singleUpdate from './queries/single-update'
import {findClass} from './queries/find-class'

export const classFind = async (props) => {
    const {targets, triplestore, toInsert} = props
    const {default_severities} = triplestore

    return await requester(findClass(props), 'kgraph', triplestore, x => JSON.parse(x[0].r.value), {})
}