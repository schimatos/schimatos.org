// import {useContext} from 'react'
// import rdfstore from 'rdfstore'
// import {TriplestoreContext} from '../context'
// const fs = require('fs-extra')
// //import fs from 'fs-extra'
// const N3 = require('n3')

// const efunc = f => (e, input) => {
//     e && console.log(e)
//     return f(input)
// }

// const eRetFunc = efunc(x => x)

// export default () => {
//     const [{settings, shacl_graphs, knowledge_graphs, schema_prefixes},] = useContext(TriplestoreContext)
//     const {shacl_graph, knowledge_graph} = settings
//     const [sgraph, kgraph] = [shacl_graphs[shacl_graph], knowledge_graphs[knowledge_graph]]

//     const queryGraph = (graph, query) => {
//         graph.local_location ? queryLocal(graph.local_location, query) : queryEndpoint(graph, query)
//     }

//     // const queryLocal = (graph, query) => {
//     //     // const parser = new N3.Parser();
//     //     // const rdfStream = fs.readFile(filePath)
//     //     // const store = parser.parse(rdfStream)
//     //     const {local_location, write_location, read_encoding, write_encoding} = graph
//     //     const write_to = write_location === '' ? local_location : write_location

//     //     const results = rdfstore.create(efunc(store => {

//     //         const fmap = {
//     //             ttl : "text/turtle",
//     //             rdf : "application/rdf+xml" //check
//     //         }

//     //         const fileType = fmap[local_location.split('.')[1]]
//     //         const fileString = fs.readFileSync(local_location, read_encoding)
            
//     //         store.load(fileType, fileString, eRetFunc)
//     //         store.execute(query, eRetFunc)

//     //         const writer = new N3.Writer({format : fileType, prefixes : schema_prefixes})
//     //         const data = writer.addQuads(store.getQuads())
//     //         fs.writeFileSync(write_to, data, write_encoding)

//     //         // return results
//     //     }))

//     //     return results
//     // }

//     //queryGraph(sgraph, 'SELECT ?s WHERE {?s ?p ?o} LIMIT 100')

//     return []

//     return {
//         testQuery
//     }
// }