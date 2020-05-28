import {escapeRegExp} from '../../utils'
export const optionsList = ({searchBy, search, makeQueryTerm, makeIRI}) => {
    const header = () => `SELECT DISTINCT (concat('["', group_concat(distinct ?target; separator='","'), '"]') as ?r)
        FROM {knamed}
        `
    switch (searchBy) {
        case 'Custom':
            return header() + search.substring(23,)
        case 'Name': return `
            ${header()}
            WHERE {{OPTIONAL{?target ?p ?o}} UNION {OPTIONAL{?s ?p2 ?target}}
            FILTER(regex(?target, "'${search.replace(/ /g, "' and '") || escapeRegExp(search)}'"))}`
        case 'Subjects Of':
            return header() + `WHERE {?target ${makeQueryTerm(makeIRI(search))} ?o}`
        case 'Objects Of':
            return header() + `WHERE {?s ${makeQueryTerm(makeIRI(search))} ?target}`
        case 'Class':
            return header() + `WHERE {?target a ${makeQueryTerm(makeIRI(search))}}`
        case 'Value':
            return header() + `WHERE {?target rdf:value ?value
                FILTER(regex(?value, '${search.replace(/ /g, "' and '") || escapeRegExp(search)}', 'i'))
            }`
        case 'Any':
                return header() + `WHERE {?target ?p ?value
                    FILTER(regex(?value, '${search.replace(/ /g, "' and '") || escapeRegExp(search)}', 'i'))
            }`
        case 'Label':
            return header() + `WHERE {?target rdfs:label ?label
                FILTER(regex(?label, '${search.replace(/ /g, "' and '") || escapeRegExp(search)}', 'i'))
            }`
        }}
