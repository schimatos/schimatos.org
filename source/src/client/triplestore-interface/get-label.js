import requester from './requester/single-query'

export default async (props) => {
    const {triplestore, IRI} = props
    return await requester(`SELECT DISTINCT * WHERE {<${IRI}> rdf:label ?value}`, 'kgraph', triplestore, x => JSON.parse(x[0].r.value), {})
}