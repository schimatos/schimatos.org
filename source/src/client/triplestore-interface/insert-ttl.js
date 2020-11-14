
// ifimport N3 from 'N3'
const N3 = require('n3')
import requester from './requester/single-query'

export const insertTtl = async ({graph, triplestore, ttl}) => {
    const {schema_prefixes} = triplestore

    const prefix_list = Object.entries({...schema_prefixes})
    const ttl_prefixes = prefix_list.reduce((total, [k, v]) => `${total}@prefix ${k}: <${v}> .\n`, ``)

    const writer = new N3.Writer()
    const parser = new N3.Parser()

    return await requester(`INSERT IN GRAPH {${graph + 'named'}} {${ttl}}`, graph + 'graph', triplestore, async x => await x[0], true)
   
    // ew Promise((response, reject) => {
    //     parser.parse(ttl_prefixes+ttl, (err, quad, prefixes) => {
    //         if (quad) {
    //             writer.addQuad(quad) 
    //         } else {
    //             writer.end(async (err, res) => {
    //                 response(await requester(`INSERT IN GRAPH {${graph + 'named'}} {${res}}`, graph + 'graph', triplestore, async x => await x[0], true))
    //             })
    //         }})
    // })
}
