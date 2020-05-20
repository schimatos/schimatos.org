import requester from './requester/single-query'
import {targetToProperties} from './queries/target-to-properties'
import {insertTriples} from './queries/subqueries'
import {findDatatypes} from './queries/find-datatypes'
import singleUpdate from './queries/single-update'

export const datatypeFind = async (props) => {
    const {targets, triplestore, toInsert} = props
    const {default_severities} = triplestore

    return await requester(findDatatypes(props), 'kgraph', triplestore, x => JSON.parse(x[0].r.value), {})
}