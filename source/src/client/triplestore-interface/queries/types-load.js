import {values, filterSeverities} from "./subqueries"
import singleUpdate from "./single-update"


// SELECT DISTINCT (concat('[',group_concat(distinct ?properties; separator=','), ']') AS ?r)
// {SELECT DISTINCT (concat('{"', group_concat(distinct ?prop; separator=',"'), '}') AS ?properties)
// FROM {Asnamed}
// WHERE {
// {SELECT DISTINCT ?s ?n ?pa ((IF(true, group_concat(distinct ?obs; separator='","'), concat( '["', group_concat(distinct ?obs; separator='","')   ,'"]'  ))) AS ?ob)
// WHERE {?s sh:property ?n . ?n ?pa ?oa OPTIONAL {?oa (rdf:rest*/rdf:first)? ?obs
// FILTER(IF(NOT EXISTS {SELECT ?r WHERE {?n ?p ?r FILTER(lang(?r) = '${language}')}}, lang(?oa) = '', lang(?oa) = '${language}'))
// }

// FILTER (!isBlank(?obs) && ?obs != rdf:nil)}}
// VALUES (?s) {${values(shacls)}}
// ${filterSeverities(severities)}
// BIND(REPLACE(STR(?pa), sh:, '') AS ?pa2)
// BIND(IF(?pa = sh:severity, REPLACE(STR(?ob), sh:, ''),?ob) AS ?ob2)
// BIND(CONCAT(IF(?pa2 = 'path' || ?pa2='inversePath' || ?pa2='alternativePath' || ?pa2='zeroOrMorePath' || ?pa2='oneOrMorePath' || ?pa2='zeroOrOnePath', CONCAT('pathType":"', ?pa2, '","path'), ?pa2), '":"', ?ob2,'"') AS ?prop)}
// GROUP BY ?n}


// PREFIX sh: <http://www.w3.org/ns/shacl#>
// PREFIX ex: <http://example.org/>
// PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
// PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
// PREFIX rdfs: <http://www.w3.org/ns/shacl#>
// PREFIX ex2: <http://example.org>
// SELECT DISTINCT (concat('{"constraints":[',group_concat(distinct ?properties; separator=','),  '], "groups":[',"{", group_concat(distinct ?res; separator=","), "}", ']}') AS ?r)
//     {SELECT DISTINCT ?res (concat('{"', group_concat(distinct concat(?prop, IF(?list, "[", ""),?ob2, IF(?list, "]", "")); separator=',"'), '}') AS ?properties) (concat('{"', group_concat(distinct ?prop; separator=',"'), '}') AS ?groups)
//     FROM <http://shacl>
//     WHERE {
//     {SELECT DISTINCT ?s ?n ?pa ?oa (COUNT(?obs) > 1 as ?list) (concat('"', group_concat(distinct concat(str(?obs),IF(isLiteral(?oa) && lang(?obs) != '', '"@', '"'),lang(?obs)); separator=',"'), '') AS ?ob)
//     WHERE {?s sh:property ?n . ?n ?pa ?oa OPTIONAL {?oa (rdf:rest*/rdf:first)? ?obs

    

//     }


// FILTER(!isLiteral(?oa) || lang(?oa) = '' || lang(?oa) = 'en-us')



//     FILTER (!isBlank(?obs) && ?obs != rdf:nil)}





    
// }



// OPTIONAL {SELECT DISTINCT  (concat('"', ?group, '":{"',group_concat(distinct concat(REPLACE(str(?pgroup), sh:, ''), '":"', ?ogroup); separator='","'),'"}') AS ?res) WHERE {
// ?pa sh:group ?group .
// ?group ?pgroup ?ogroup
// FILTER(?pgroup != rdf:type)
// }


// }




//     VALUES (?s) {(<http://example.org/PersonFormShape>) (<http://example.org/NewZealandLanguagesShape>)}
//     FILTER (EXISTS {SELECT ?n {?n sh:severity ?w . VALUES (?w) {(sh:Warning)(sh:Violation)}}} || NOT EXISTS { SELECT ?n WHERE {?n sh:severity ?w}} )



//     BIND(REPLACE(STR(?pa), sh:, '') AS ?pa2)
//     BIND(IF(?pa = sh:severity, REPLACE(STR(?ob), sh:, ''),?ob) AS ?ob2)
//     BIND(CONCAT(IF(?pa2 = 'path' || ?pa2='inversePath' || ?pa2='alternativePath' || ?pa2='zeroOrMorePath' || ?pa2='oneOrMorePath' || ?pa2='zeroOrOnePath', CONCAT('pathType":"', ?pa2, '","path'), ?pa2), '":') AS ?prop)




// }
//     GROUP BY ?n ?res}










// SELECT (concat('{', group_concat(concat( '"'  ,?path, '":"' ,  ?type, '"'); separator=',' ), '}') AS ?r) WHERE{
//     ?path rdfs:range ?type .
//     ?type a rdfs:Datatype
//     VALUES (?path) {(<http://dbpedia.org/ontology/deathPlace>) (<http://dbpedia.org/property/deathPlace>) (<http://dbpedia.org/property/death>) (<http://dbpedia.org/property/reference>) (<http://dbpedia.org/ontology/review>) (<http://dbpedia.org/ontology/age>)}
    
//     }
    
//     LIMIT 1





    
// PREFIX sh: <http://www.w3.org/ns/shacl#>
// PREFIX ex: <http://example.org/>
// PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
// PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
// PREFIX rdfs: <http://www.w3.org/ns/shacl#>
// PREFIX ex2: <http://example.org>
// SELECT DISTINCT (concat('{"constraints":[',group_concat(distinct ?properties; separator=','),  '], "groups":[',"{", group_concat(distinct ?res; separator=","), "}", ']}') AS ?r)
//     {SELECT DISTINCT ?res (concat('{"', group_concat(distinct concat(?prop, IF(?list, "[", ""),?ob2, IF(?list, "]", "")); separator=',"'),'}') AS ?properties) (concat('{"', group_concat(distinct ?prop; separator=',"'), '}') AS ?groups)
//     FROM {Asnamed}
//     WHERE {
//     {SELECT DISTINCT ?s ?n ?pa (COUNT(?obs) > 1 as ?list) (concat('"', group_concat(distinct concat(str(?obs),IF(isLiteral(?oa) && lang(?obs) != '', '"@', '"'),lang(?obs)); separator=',"'), '') AS ?ob)
//     WHERE {?s sh:property ?n . ?n ?pa ?oa OPTIONAL {?oa (rdf:rest*/rdf:first)? ?obs    }
//     FILTER(!isLiteral(?oa) || lang(?oa) = '' || lang(?oa) = 'en-us')
//     FILTER ( ?pa = sh:property   || (!isBlank(?obs) && ?obs != rdf:nil))}
   
// }
// OPTIONAL {SELECT DISTINCT  (concat('"', ?group, '":{"',group_concat(distinct concat(REPLACE(str(?pgroup), sh:, ''), '":"', ?ogroup); separator='","'),'"}') AS ?res) WHERE {
// ?pa sh:group ?group .
// ?group ?pgroup ?ogroup
// FILTER(?pgroup != rdf:type)}}
// VALUES (?s) {${values(shacls)}}
// ${filterSeverities(severities)}
// BIND(REPLACE(STR(?pa), sh:, '') AS ?pa2)
// BIND(IF(?pa = sh:severity, REPLACE(STR(?ob), sh:, ''),?ob) AS ?ob2)
// BIND(CONCAT(IF(?pa2 = 'path' || ?pa2='inversePath' || ?pa2='alternativePath' || ?pa2='zeroOrMorePath' || ?pa2='oneOrMorePath' || ?pa2='zeroOrOnePath', CONCAT('pathType":"', ?pa2,'","path'), ?pa2), '":') AS ?prop)
// }GROUP BY ?n ?res}

export const fromRange = ({properties}) => `
SELECT DISTINCT (concat("{", group_concat(concat( '"'  ,?path, '":[', ?types, "]"); separator=","), "}") as ?r) {
SELECT DISTINCT ?path (concat('"', group_concat(distinct ?type; separator='","'), '"') AS ?types)
FROM {knamed}
WHERE{
    ?path rdfs:range ?type .
    ?type a rdfs:Datatype
VALUES (?path) {${values(properties)}}}
}`

export const fromOptions = ({properties}) => `
SELECT DISTINCT (concat("{", group_concat(concat( '"'  ,?path, '":[', ?type, "]"); separator=","), "}") as ?r) {
SELECT DISTINCT ?path (concat('"', group_concat(distinct datatype(?o); separator='","'), '"') AS ?type)
FROM {knamed}
WHERE{
?s ?path ?o
FILTER(datatype(?o) != rdf:langString)
VALUES (?path) {${values(properties)}}}}
`

// export const fromRange = ({properties}) => `
// SELECT (concat('{', group_concat(concat( '"'  ,?path, '":"' ,  ?type, '"'); separator=',' ), '}') AS ?r)
// FROM {knamed}
// WHERE{
// ?path rdfs:range ?type .
// ?type a rdfs:Datatype
// VALUES (?path) {${values(properties)}}
// }`

// export const fromOptions = ({properties}) => `
// SELECT DISTINCT (concat("{", group_concat(concat( '"'  ,?path, '":[', ?type, "]"); separator=","), "}") as ?r) {
// SELECT DISTINCT ?path (concat('"', group_concat(distinct datatype(?o); separator='","'), '"') AS ?type)
// FROM {knamed}
// WHERE{
// ?s ?path ?o
// FILTER(datatype(?o) != rdf:langString)
// VALUES (?path) {${values(properties)}}}}
// `