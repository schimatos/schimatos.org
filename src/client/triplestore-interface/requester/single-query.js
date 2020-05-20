//import request from 'async-request'
import request from 'request'
import axios from 'axios'
//import fetch from 'fetch'
import www_authenticate from 'www-authenticate'
const indigestion = require('indigestion');

// const promiseRequest = async (options, details) => {
//     return new Promise((resolve, reject) => {

//     })
// }

const updatedHeader = (options, error, details) => {
    const authenticateHeader = error.response.headers["www-authenticate"]
    const authorization = indigestion.generateDigestAuth({
        authenticateHeader,
        ...details
    }) 
    return {...options, 'Authorization' : authorization}
}

// const myRequest = async (options, details) => {
//     return new Promise((resolve, reject) => {
//         request(options, (error, response, body) => {
//             console.log('at response', error, response, body)
//             if (error?.response?.status === 401) {
//                 const update = updatedHeader(options, error, details)
//                 console.log('updated headers', update)
//                 request(update, (e, r, b) => {
//                     if (e) {
//                         reject('x')
//                     } else {
//                         resolve(r)
//                     }
//                 })
//             } else if (error) {
//                 reject('x')
//             } else {
//                 resolve(response)
//             }
//         })
//     })
// }

const myRequest = async (options, details) => {
    // const {username, password} = details
    // const authenticator = www_authenticate.authenticator(username, password)

    // console.log('options', options, details)

    // // console.log('at my request', options, details)

    // // const response = await fetch(options)

    // // console.log('response', await response)


    // //console.log('options at myRequest', o)
    // //const options = {...o, data : {form : o.data }}
    // // console.log('converted options', options)
    return new Promise((resolve, reject) => {
    //     axios(options)
    //     .then(response => {
    //         console.log('resolve inside then', response)
    //         authenticator.get_challenge(response)
    //         authenticator.authenticate_request_options(options)

    //         resolve(response)
    //     })
    //     .catch(error => {
    //         if (error?.response?.status === 401) {
    //             const newOptions = updatedHeader(options, error, details)
    //             console.log('newOptions')
    //             axios(newOptions)
    //             .then(resolve)
    //             .catch(reject)
    //         } else {
    //             reject(error)
    //         }
    //     })
    // })



        console.log('options', options)
        request(options, (error, response, body) => {
            console.log('at response', error, response, body)
            if (error?.response?.status === 401) {
                const update = updatedHeader(options, error, details)
                console.log('updated headers', update)
                request(update, (e, r, b) => {
                    if (e) {
                        reject('x')
                    } else {
                        resolve(r)
                    }
                })
            } else if (error) {
                reject('x')
            } else {
                resolve(response)
            }
        })
    })
}

const makeQuery = async (qu, start_graph, triplestore, preProcess, preProcessCatch, graph_details, recurse, details) => {
    const {settings, knowledge_graphs, shacl_graphs, schema_prefixes, timeout, type_graphs} = triplestore
    console.log("start fo make query", qu)
    const {knowledge_graph, shacl_graph, additional_shacls, type_graph, additional_types} = settings
    const kgraph = knowledge_graphs[knowledge_graph]
    const sgraph = shacl_graphs[shacl_graph]
    const sgraphs = [...(additional_shacls.map(graph => shacl_graphs[graph])), sgraph]
    console.log('type graph', type_graphs, triplestore)
    const tgraph = type_graphs[type_graph]
    const tgraphs = [...(additional_types.map(graph => type_graphs[graph])), tgraph]


    const sparql_prefixes = Object.entries(schema_prefixes).reduce((total, [k, v]) => `${total}PREFIX ${k}: <${v}>\n`, ``)

    const replacePseudo = (replacements, q) => {
        return replacements.reduce((total, [pseudo, iri]) => {
            const replaced = total.replace(`{${pseudo}}`, iri)
            return replaced
        }, q)
    }

    const preProcessor = res => {
        try {
            return preProcess(res)
        } catch {
            return preProcessCatch
        }
    }

    const endpoint = (graph, authentication) => {
        const IRIextension = () => {
            const auth = {"Authorization" : "Basic " + new Buffer(`${graph['authentication']['username']}:${graph['authentication']['password']}`).toString("base64")}
            const isauth = graph['authentication']['username'] + graph['authentication']['password'] !== ''
            const headers = {...(isauth ? auth : {}),
            "Accept" : "application/sparql-results+json",
            "Content-Type" : "application/x-www-form-urlencoded",
            //"timeout" : timeout, ...graph.headers
            }
            return Object.entries(headers).reduce((t, [key, val]) => t+key+'='+val, '?')
        }
        const baseIRI = graph.sparql_endpoint + '/' + graph.endpoint_extension
        return authentication ? baseIRI + IRIextension() : baseIRI
    }

    const graphIRIs = [['sgraph', '<'+endpoint(sgraph, false)+'>'],
                    ['kgraph', '<'+endpoint(kgraph, false)+'>'],
                    ['tgraph', '<'+endpoint(tgraph, false)+'>'],
                    ['sprefix', sgraph.prefix],
                    ['kprefix', kgraph.prefix],
                    ['tprefix', tgraph.prefix],
                    ['fsgraph', 'SERVICE <'+endpoint(sgraph, true)],
                    ['ftgraph', 'SERVICE <'+endpoint(tgraph, true)],
                    ['fkgraph', 'SERVICE <'+endpoint(kgraph, true)+'>'],
                    ['snamed', sgraph.location.includes('http://') ? '<' + sgraph.location + '>' : sgraph.location],
                    ['tnamed', sgraph.location.includes('http://') ? '<' + sgraph.location + '>' : sgraph.location],
                    ['knamed', kgraph.location.includes('http://') ? '<' + kgraph.location + '>' : kgraph.location]]

    const full_query = sparql_prefixes + replacePseudo(graphIRIs, qu)

    const sendQuery = async (graph, query) => {
            console.log('query sent :)', query, graph)
            try {
                const auth = {"Authorization" : "Basic " + new Buffer(`${graph['authentication']['username']}:${graph['authentication']['password']}`).toString("base64")}
                const isauth = graph['authentication']['username'] + graph['authentication']['password'] !== ''
                const response = await myRequest({
                    uri : `${graph.sparql_endpoint}/${graph.endpoint_extension}`,
                    headers : {...graph.headers, ...(isauth ? auth : {}),
                    "Authorization" : "Basic " + new Buffer(`${graph['authentication']['username']}:${graph['authentication']['password']}`).toString("base64"),
                    // 'Access-Control-Allow-Origin' : '*',
                    // 'Access-Control-Allow-Credentials' : true,
                    // 'Access-Control-Allow-Methods' : 'POST, GET, PUT, DELETE, OPTIONS',
                    // 'Access-Control-Allow-Headers' : 'Content-Type',
                        "Accept" : "application/sparql-results+json",
                        "Content-Type" : "application/x-www-form-urlencoded"//,
                        //'Access-Control-Allow-Origin' : "*"
                        //"timeout" : timeout
                    },
                    //'Access-Control-Allow-Origin' : "*",
                    form : {query},//, mode : "cors"
                    "Authorization" : "Basic " + new Buffer(`${graph['authentication']['username']}:${graph['authentication']['password']}`).toString("base64"),
                    method : graph.request_type || 'POST'//,
                    // 'Access-Control-Allow-Origin' : '*',
                    // 'Access-Control-Allow-Credentials' : true,
                    // 'Access-Control-Allow-Methods' : 'POST, GET, PUT, DELETE, OPTIONS',
                    // 'Access-Control-Allow-Headers' : 'Content-Type'
                }, {...graph.authentication, uri : '/' + graph.endpoint_extension, method : graph.request_type})
                console.log('awaiting response')
                console.log('response', await response, graph, query)

                if (response.statusCode !== 200) {
                    console.log(await response)
                    return await preProcess ? preProcessor([]) : []
                } else {
                    console.log('inside else statement')
                    console.log(await await response)
                    const parsed = await JSON.parse(await response.body).results.bindings
                    console.log('parsed', await parsed)
                    const processed = await preProcessor(await parsed)
                    console.log('processed', await processed)
                    const r = await preProcessor ? await processed : await parsed

                    console.log('recurse', recurse)

                    if (recurse) {
                        console.log('inside recurse if', details)
                        const nextQueries = await recurse(await r, details)
                        console.log('next queries', nextQueries)
                        const q = nextQueries.map(async ([query, accumulator]) => [accumulator, await makeQuery(
                            query,
                            start_graph,
                            {settings, knowledge_graphs, shacl_graphs, schema_prefixes, timeout, type_graphs},
                            preProcess,
                            preProcessCatch,
                            graph_details,
                            recurse,
                            details
                        )])

                        const resolved = await Promise.all(q)
                        console.log('resolved', resolved)
                        const aggregatedResult = (await resolved).reduce((t, [accumulator, res]) => accumulator(t, res)  , await r)
                        console.log('aggregated result', aggregatedResult)


                        return aggregatedResult

                        // if (nextQuery === false) {
                        //     return response
                        // } else {
                        //     nextQueries.forEach

                        //     return makeQuery(
                        //         query,
                        //         start_graph,
                        //         {settings, knowledge_graphs, shacl_graphs, schema_prefixes, timeout},
                        //         preProcess,
                        //         preProcessCatch,
                        //         graph_details,
                        //         recurse,
                        //         accumulated_result
                        //     )
                        // }
                    } else {
                        console.log('at response')
                        console.log('at response', await r)
                        return await r
                    }

                }
            } catch (e) {
                console.log(e)
                return preProcess ? preProcessor([]) : []
            }
        }
    
    if (start_graph !== 'sgraph' && start_graph !== 'kgraph' && start_graph !== 'tgraph') {
        console.log('start', start_graph)
        const s = shacl_graphs[start_graph]
        const specIRIs = [['Asprefix', s.prefix],['Asnamed', '<'+s.location+ '>'], ['Asgraph', '<'+endpoint(s, false)+ '>'], ['Afsgraph', '<'+endpoint(s, true)+'>']]
        const q = replacePseudo(specIRIs, full_query)
        const res = await sendQuery(s, q)
        console.log('res1', await res)
        return await res
    } else if (full_query.includes('{Asnamed}') || full_query.includes('{Afsgraph}') || full_query.includes('{Asgraph}')) {
        return [shacl_graph, ...additional_shacls].map(async x => {
            const s = shacl_graphs[x]
            const specIRIs = [['Asprefix', s.prefix],['Asnamed', '<'+s.location+ '>'], ['Asgraph', '<'+endpoint(s, false)+ '>'], ['Afsgraph', '<'+endpoint(s, true)+'>']]
            const q = replacePseudo(specIRIs, full_query)
            const res = graph_details ? [x, await sendQuery(start_graph === 'kgraph' ? kgraph : s, q)] : sendQuery(start_graph === 'kgraph' ? kgraph : s, q)
            console.log('res2', res)
            return res
        })
    } else if (full_query.includes('{Atnamed}') || full_query.includes('{Aftgraph}') || full_query.includes('{Atgraph}')) {
        return [type_graph, ...additional_types].map(async x => {
            const s = type_graphs[x]
            const specIRIs = [['Atprefix', s.prefix],['Atnamed', '<'+s.location+ '>'], ['Atgraph', '<'+endpoint(s, false)+ '>'], ['Aftgraph', '<'+endpoint(s, true)+'>']]
            const q = replacePseudo(specIRIs, full_query)
            const res = graph_details ? [x, await sendQuery(start_graph === 'kgraph' ? kgraph : s, q)] : sendQuery(start_graph === 'kgraph' ? kgraph : s, q)
            console.log('res2', res)
            return res
        })
    } else {
        const specIRIs = [['Asprefix', sgraph.prefix],['Asnamed', sgraph.location.includes('http://') ? '<' + sgraph.location + '>' : sgraph.location], ['Asgraph', '<' +endpoint(sgraph, false)+'>'], ['Afsgraph', '<' +endpoint(sgraph, true)]+'>']
        const q = replacePseudo(specIRIs, full_query)
        const res = await sendQuery(start_graph === 'kgraph' ? kgraph : sgraph, q)
        console.log('res3', res)
        return await res
    }
}

export default makeQuery;