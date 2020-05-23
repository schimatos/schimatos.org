import {values, filterSeverities} from "./subqueries"
import singleUpdate from "./single-update"

export const getConstraints = ({shacls, severities, language}) => {
    return `
 SELECT DISTINCT (concat('{"constraints":[',group_concat(distinct ?properties; separator=','),  '], "groups":',"{", group_concat(distinct ?res; separator=","), "}", '}') AS ?r)
    {SELECT DISTINCT ?res (concat('{"', group_concat(distinct concat(?prop, IF(?list, "[", ""),?ob2, IF(?list, "]", "")); separator=',"'),'}') AS ?properties)
    FROM {Asnamed}
    WHERE {
    {SELECT DISTINCT ?s ?n ?pa (concat('"', ?group, '":{"',group_concat(distinct concat(REPLACE(str(?pgroup), sh:, ''), '":"', ?ogroup); separator='","'),'"}') AS ?res) (REGEX(?obs, '","', "i") as ?list) (concat('"', group_concat(distinct concat(str(?obs),IF(isLiteral(?oa) && lang(?oa) != '', '', ''),lang(?obs), '"'); separator=',"'), '') AS ?ob)
    WHERE {

{SELECT DISTINCT ?s ?n ?pa ?oa (group_concat(?obt; separator='","') AS ?obs) WHERE {


{SELECT DISTINCT ?s ?n ?pa ?obt ?oa WHERE {?s sh:property ?n . ?n ?pa ?oa OPTIONAL {?oa (rdf:rest*/rdf:first)? ?obt    
}

    FILTER(!isLiteral(?oa) || lang(?oa) = '' || lang(?oa) = '${language}')
FILTER(!isBlank(?obt) ||  ?pa = sh:property)
}

}}}



OPTIONAL {
?n sh:group ?group .
?group ?pgroup ?ogroup
FILTER(?pgroup != rdf:type)}




    FILTER ( ?pa = sh:property   || (!isBlank(?obt) && ?obs != rdf:nil))

}
   
   
}




VALUES (?s) {${values(shacls)}}
${filterSeverities(severities)}



BIND(REPLACE(STR(?pa), sh:, '') AS ?pa2)
BIND(IF(?pa = sh:severity, REPLACE(STR(?ob), sh:, ''),?ob) AS ?ob2)
BIND(CONCAT(IF(?pa2 = 'path' || ?pa2='inversePath' || ?pa2='alternativePath' || ?pa2='zeroOrMorePath' || ?pa2='oneOrMorePath' || ?pa2='zeroOrOnePath', CONCAT('pathType":"', ?pa2,'","path'), ?pa2), '":') AS ?prop)

}GROUP BY ?n ?res}`




}

export const getConstraint = ({blankNodeId, severities, language}) => {
    return `SELECT DISTINCT (concat('{"constraints":[',group_concat(distinct ?properties; separator=','),  '], "groups":',"{", group_concat(distinct ?res; separator=","), "}", '}') AS ?r)
    {SELECT DISTINCT ?res (concat('{"', group_concat(distinct concat(?prop, IF(?list, "[", ""),?ob2, IF(?list, "]", "")); separator=',"'),'}') AS ?properties)
    FROM {Asnamed}
    WHERE {
    {SELECT DISTINCT ?pa (concat('"', ?group, '":{"',group_concat(distinct concat(REPLACE(str(?pgroup), sh:, ''), '":"', ?ogroup); separator='","'),'"}') AS ?res) (REGEX(?obs, '","', "i") as ?list) (concat('"', group_concat(distinct concat(str(?obs),IF(isLiteral(?oa) && lang(?oa) != '', '"', '"'),lang(?obs)); separator=',"'), '') AS ?ob)
    WHERE {

{SELECT DISTINCT ?pa ?oa (group_concat(?obt; separator='","') AS ?obs) WHERE {


{SELECT DISTINCT ?pa ?obt ?oa WHERE {<${blankNodeId}> ?pa ?oa OPTIONAL {?oa (rdf:rest*/rdf:first)? ?obt    
}

    FILTER(!isLiteral(?oa) || lang(?oa) = '' || lang(?oa) = '${language}')
FILTER(!isBlank(?obt) ||  ?pa = sh:property)
}

}}}



OPTIONAL {
<${blankNodeId}> sh:group ?group .
?group ?pgroup ?ogroup
FILTER(?pgroup != rdf:type)}




    FILTER ( ?pa = sh:property   || (!isBlank(?obt) && ?obs != rdf:nil))

}
   
   
}



${filterSeverities(severities)}



BIND(REPLACE(STR(?pa), sh:, '') AS ?pa2)
BIND(IF(?pa = sh:severity, REPLACE(STR(?ob), sh:, ''),?ob) AS ?ob2)
BIND(CONCAT(IF(?pa2 = 'path' || ?pa2='inversePath' || ?pa2='alternativePath' || ?pa2='zeroOrMorePath' || ?pa2='oneOrMorePath' || ?pa2='zeroOrOnePath', CONCAT('pathType":"', ?pa2,'","path'), ?pa2), '":') AS ?prop)

}GROUP BY ?res}`
}

// Doesnt work for lists because of transitive integer issue

export const getTypes = ({types}) => {
    return `
    SELECT DISTINCT (concat('{', group_concat(concat('"', ?type, '":{',  ?constraints, '}' ); separator=","), '}') AS ?r)


    {SELECT DISTINCT ?type (group_concat(concat('"',replace(str(?constraint), sh:, '') ,'":["', ?values, '"]' ); separator=",") AS ?constraints)
    
    
    {SELECT DISTINCT ?type ?constraint (group_concat(distinct ?v; separator='","') AS ?values)
    FROM {Atnamed}
    WHERE {?type ?constraint ?v 
    
    FILTER(?constraint != rdf:type && ?constraint != rdfs:type)
    VALUES (?type) {${values(types)}}}
}
    }`
}

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





    
// SELECT DISTINCT (concat("{", group_concat(concat( '"'  ,?path, '":[', ?type, "]"); separator=","), "}") as ?r) {
//     SELECT DISTINCT ?path (concat('"', group_concat(distinct datatype(?o); separator='","'), '"') AS ?type) WHERE{
//     ?s ?path ?o
//     FILTER(datatype(?o) != rdf:langString)
//     VALUES (?path) {(<http://dbpedia.org/property/2016CarNumber>) (<http://dbpedia.org/property/247sportsOverall>) (<http://dbpedia.org/property/1v5Score>)
//     (<http://dbpedia.org/property/1500Chairman>)
//     (<http://dbpedia.org/property/1BirthPlace>)
    
//     (<http://dbpedia.org/property/1cPlace>) 
//     }}
//     }