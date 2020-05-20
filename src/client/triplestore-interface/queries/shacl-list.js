import {escapeRegExp} from '../../utils'
export const shaclList = ({searchBy, search}) => {
    const header = () => `SELECT DISTINCT (concat('["', group_concat(distinct ?shape; separator='","'), '"]') as ?r)
        FROM {Asnamed}
        `

    switch (searchBy) {
        case 'All': return header() + `WHERE {?shape a sh:NodeShape}`
        case 'Custom':
            return header() + search.substring(23,)
        case 'Target': return `
            PREFIX sh: <http://www.w3.org/ns/shacl#>
            ${header()}
            WHERE {?shape a sh:NodeShape
            {?shape sh:targetNode <{Asprefix}${search}>}
            UNION {?shape sh:targetSubjectsOf ?p
            {SELECT DISTINCT ?p
            FROM {knamed}
            WHERE {{<{Asprefix}${search}> ?p ?os}}}
            UNION {?shape sh:targetObjectsOf ?pi
            {SELECT DISTINCT ?pi
            FROM {knamed}
            WHERE {{?s ?pi <{Asprefix}${search}>}}}}}
            UNION {?shape  sh:targetClass ?class
            {SELECT DISTINCT ?class
            FROM {knamed}
            WHERE {{<{Asprefix}${search}> a/rdfs:subClassOf* ?class}}}}}`
        case 'Name': return `
            PREFIX sh: <http://www.w3.org/ns/shacl#>
            ${header()}
            WHERE {?shape a sh:NodeShape
            FILTER(regex(?shape, "${escapeRegExp(search)}", "i"))}`
        case 'Value': return `
            PREFIX sh: <http://www.w3.org/ns/shacl#>
            ${header()}
            WHERE {?shape a sh:NodeShape .
                ?shape rdf:value ?value
            FILTER(regex(?value, "${escapeRegExp(search)}", "i"))}`
        case 'Label': return `
            PREFIX sh: <http://www.w3.org/ns/shacl#>
            ${header()}
            WHERE {?shape a sh:NodeShape .
                ?shape rdfs:label ?label
            FILTER(regex(?label, "${escapeRegExp(search)}", "i"))}`
        default: return  `
            PREFIX sh: <http://www.w3.org/ns/shacl#>
            ${header()}
            WHERE {
            ?shape a sh:NodeShape .
            ?shape sh:${({
            "Class" : 'targetClass',
            "Objects Of" : 'targetSubjectsOf',
            "Subjects Of" : 'targetObjectsOf',
            "Node" : 'targetNode'
            })[searchBy]} ?t
            
            VALUES (?t) {(<{Asprefix}${search}>) (<{kprefix}${search}>)}
            
            }`
        }}
