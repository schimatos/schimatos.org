import requester from './requester/single-query'
import {targetToProperties} from './queries/target-to-properties'
import {insertTriples} from './queries/subqueries'
import singleUpdate from './queries/single-update'

export const allProperties = async (props) => {
    const {targets, triplestore, toInsert} = props
    const {default_severities} = triplestore

    if (toInsert === undefined) {
        return await requester(targetToProperties({targets, default_severities}), 'sgraph', triplestore, x => JSON.parse(x[0].r.value), {})
    } else {
        const inserted = await requester(singleUpdate({ action : 'insert', graph : 'knamed', triples : toInsert}), 'kgraph', triplestore)
        return await requester(targetToProperties({targets, default_severities, inserted : (await inserted)}), 'sgraph', triplestore, x => JSON.parse(x[0].r.value), {})
    }
}