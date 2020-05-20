import {useContext} from 'react'

import request from 'async-request'
import conversions from '../../custom-hooks/helper-functions/conversions'
import {TriplestoreContext} from '../../context'


export default async () => {
    const [{settings, knowledge_graphs, shacl_graphs, schema_prefixes, timeout},] = useContext(TriplestoreContext)
    const kgraph = knowledge_graphs[knowledge_graph]
    const sgraph = shacl_graphs[shacl_graph]
    const sgraphs = [...(additional_shacls.map(graph => shacl_graphs[graph])), sgraph]
    const sparql_prefixes = Object.entries(schema_prefixes).reduce((total, [k, v]) => `${total}PREFIX ${k}: <${v}>\n`, ``)

    
    const replacePseudo = (replacements, q) => {
        return replacements.reduce((total, [pseudo, iri]) => {
            const replaced = total.replace(`{${pseudo}}`, iri)
            return replaced
        }, q)
    }

    const endpoint = (graph, authentication) => {
        const IRIextension = () => {
            const auth = {"Authorization" : "Basic " + new Buffer(`${graph['authentication']['username']}:${graph['authentication']['password']}`).toString("base64")}
            const isauth = graph['authentication']['username'] + graph['authentication']['password'] !== ''
            const headers = {...(isauth ? auth : {}),
            "Accept" : "application/sparql-results+json",
            "Content-Type" : "application/x-www-form-urlencoded",
            //"timeout" : timeout,
            ...graph.headers
            }
            return Object.entries(headers).reduce((t, [key, val]) => t+key+'='+val, '?')
        }
        const baseIRI = graph.sparql_endpoint + '/' + graph.endpoint_extension
        return authentication ? baseIRI + IRIextension() : baseIRI
    }

    const graphIRIs = [['sgraph', '<'+endpoint(sgraph, false)+'>'],
                    ['kgraph', '<'+endpoint(kgraph, false)+'>'],
                    ['fsgraph', 'SERVICE <'+endpoint(sgraph, true)],
                    ['fkgraph', 'SERVICE <'+endpoint(kgraph, true)+'>'],
                    ['snamed', sgraph.location.includes('http://') ? '<' + sgraph.location + '>' : sgraph.location],
                    ['knamed', kgraph.location.includes('http://') ? '<' + kgraph.location + '>' : kgraph.location]]



    const makeQuery = ({query,
        start_graph,
        preProcess,
        preProcessCatch,
        graph_details,
        recurse}) => {

            const preProcessor = res => {
                try {
                    return preProcess(res)
                } catch {
                    return preProcessCatch
                }
            }

            const full_query = sparql_prefixes + replacePseudo(graphIRIs, query)

            const sendQuery = async (graph, query) => {
                    console.log('query sent', query)
                    try {
                        const auth = {"Authorization" : "Basic " + new Buffer(`${graph['authentication']['username']}:${graph['authentication']['password']}`).toString("base64")}
                        const isauth = graph['authentication']['username'] + graph['authentication']['password'] !== ''
                        const response = await request(`${graph.sparql_endpoint}/${graph.endpoint_extension}`, {
                            headers : {...graph.headers, ...(isauth ? auth : {}),
                                "Accept" : "application/sparql-results+json",
                                "Content-Type" : "application/x-www-form-urlencoded"
                                //"timeout" : timeout
                            },
                            data : {query},
                            method : graph.request_type
                        })
                        if (response.statusCode !== 200) {
                            console.log(await response)
                            return await preProcess ? preProcessor([]) : []
                        } else {
                            const parsed = await JSON.parse(await response.body).results.bindings
                            const processed = await preProcessor(await parsed)
                            const response = await preProcessor ? await processed : await parsed

                            if (recurse) {
                                const nextQuery = recurse.resultsToQuery(response)
                                if (nextQuery === false) {
                                    return response
                                } else {
                                    return makeQuery({
                                        query : nextQuery,
                                        start_graph : graph.location,
                                        preProcess,
                                        preProcessCatch,
                                        graph_details,
                                        recurse
                                    })
                                }
                            } else {
                                return response
                            }

                        }
                    } catch (e) {
                        console.log(e)
                        return preProcess ? preProcessor([]) : []
                    }
                }

            if (start_graph !== 'sgraph' && start_graph !== 'kgraph') {
                console.log('start', s)
                const s = shacl_graphs[start_graph]
                const specIRIs = [['Asprefix', s.prefix],['Asnamed', '<'+s.location+ '>'], ['Asgraph', '<'+endpoint(s, false)+ '>'], ['Afsgraph', '<'+endpoint(s, true)+'>']]
                const q = replacePseudo(specIRIs, full_query)
                const res = await sendQuery(s, q)
                console.log('res', await res)
                return await res
            } else if (full_query.includes('{Asnamed}') || full_query.includes('{Afsgraph}') || full_query.includes('{Asgraph}')) {
                return [shacl_graph, ...additional_shacls].map(async x => {
                    const s = shacl_graphs[x]
                    const specIRIs = [['Asprefix', s.prefix],['Asnamed', '<'+s.location+ '>'], ['Asgraph', '<'+endpoint(s, false)+ '>'], ['Afsgraph', '<'+endpoint(s, true)+'>']]
                    const q = replacePseudo(specIRIs, full_query)
                    const res = graph_details ? [x, await sendQuery(start_graph === 'kgraph' ? kgraph : s, q)] : sendQuery(start_graph === 'kgraph' ? kgraph : s, q)
                    console.log('res', res)
                    return res
                })
            } else {
                const specIRIs = [['Asprefix', sgraph.prefix],['Asnamed', sgraph.location.includes('http://') ? '<' + sgraph.location + '>' : sgraph.location], ['Asgraph', '<' +endpoint(sgraph, false)+'>'], ['Afsgraph', '<' +endpoint(sgraph, true)]+'>']
                const q = replacePseudo(specIRIs, full_query)
                const res = await sendQuery(start_graph === 'kgraph' ? kgraph : sgraph, q)
                console.log('res', res)
                return await res
            }
        }
        return makeQuery
}