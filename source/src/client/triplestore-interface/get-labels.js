import requester from './requester/single-query'

export default async (props) => {
    const {triplestore, IRIS} = props
    // console.log('get labels called', props)
    const response_labels = IRIS.length > 0 ? await requester(`SELECT DISTINCT * FROM {knamed} WHERE {?iri rdf:label ?value VALUES(?iri) {${IRIS.reduce((t,x) => t + `(<${x}>)`,'')}}}`, 'kgraph', triplestore, x => x, {}) :[]
    const response_labels3 = IRIS.length > 0 ? await requester(`SELECT DISTINCT * FROM {knamed} WHERE {?iri rdfs:label ?value VALUES(?iri) {${IRIS.reduce((t,x) => t + `(<${x}>)`,'')}}}`, 'kgraph', triplestore, x => x, {}) :[]
    // console.log(await response_labels)
    // const response_labels2 = IRIS.length > 0 ? await requester(`SELECT DISTINCT * FROM {knamed} WHERE {?iri domo:keyword ?value VALUES(?iri) {${IRIS.reduce((t,x) => t + `(<${x}>)`,'')}}}`, 'kgraph', triplestore, x => x, {}) :[]
    // console.log(await response_labels2)
    const r = await [...await response_labels, ...await response_labels3]
    // console.log(await r)
    const r2 = r.reduce((t, x) => ({...t, [x.iri.value] : x.value.value}), {})
    // console.log(await r2)
    return await r2
}