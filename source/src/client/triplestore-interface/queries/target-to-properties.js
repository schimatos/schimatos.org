import {values, filterSeverities} from './subqueries'
import singleUpdate from './single-update'

export const targetToProperties = ({targets, default_severities, language}) => `
SELECT DISTINCT (concat('"constraints":[{',group_concat(distinct ?tproperties; separator="},{"),'}], "groups":{}') AS ?r) {
{SELECT DISTINCT ?t (concat('"',group_concat(distinct ?properties; separator='},{"')) AS ?x)
{SELECT DISTINCT ?t (group_concat(distinct ?prop; separator=',"') AS ?properties)
FROM {Asnamed}
WHERE {
{?s sh:targetNode ?t}
UNION {?s sh:targetSubjectsOf ?p}
UNION {?s sh:targetObjectsOf ?pi}
UNION {?s  sh:targetClass ?class}
{SELECT DISTINCT ?s ?n ?pa (group_concat(distinct ?obs; separator='","') AS ?ob)
WHERE {?s sh:property ?n . ?n ?pa ?oa OPTIONAL {?oa (rdf:rest*/rdf:first)? ?obs}
FILTER (!isBlank(?obs) && ?obs != rdf:nil)}}
{SELECT DISTINCT ?t ?class ?p ?pi
FROM {knamed}
WHERE {
{SELECT DISTINCT ?t ?class ?p WHERE {?t ?p ?os OPTIONAL {?p rdfs:subPropertyOf*/rdfs:domain+/rdfs:subClassOf* ?class}}}
UNION {SELECT DISTINCT ?t ?class ?pi WHERE {?s ?pi ?t OPTIONAL {?pi rdfs:subPropertyOf*/rdfs:range+/rdfs:subClassOf* ?class}}}
UNION {SELECT DISTINCT ?t ?class WHERE {?t a/rdfs:subClassOf* ?class}}
FILTER (?p != rdf:type && ?p != rdfs:subPropertyOf && ?pi != rdf:type && ?pi != rdfs:subPropertyOf)}}
VALUES (?t) {${values(targets)}}
${filterSeverities(default_severities)}
FILTER(NOT EXISTS { 
    SELECT ?n {
        ?n ?path ?pathname . ?m ?path ?pathname .
        ?n sh:severity ?sev . ?m sh:severity ?sev .
        ?n ?predicate ?object
        FILTER(?n != ?m) 
        FILTER EXISTS {SELECT DISTINCT ?predicate ?object WHERE {?m ?predicate ?object}}
        FILTER EXISTS {SELECT DISTINCT ?n WHERE {?n ?pred2 ?known2 FILTER(?pred2 = sh:minCount || ?pred2 = sh:maxCount || ?pred2 = sh:message)} }
        FILTER NOT EXISTS {SELECT DISTINCT ?n WHERE {?n sh:minCount ?count1 . ?m sh:minCount ?count2 FILTER(?count1 > ?count2)}}
        FILTER NOT EXISTS {SELECT DISTINCT ?n WHERE {?n sh:maxCount ?count11 . ?m sh:maxCount ?count21 FILTER(?count11 < ?count21)}}
        VALUES (?path) {(sh:path) (sh:inversePath) (sh:alternativePath) (sh:zeroOrMorePath) (sh:oneOrMorePath) (sh:zeroOrOnePath)}
    }})
BIND(REPLACE(STR(?pa), sh:, "") AS ?pa2)
BIND(IF(?pa = sh:severity, REPLACE(STR(?ob), sh:, ""),?ob) AS ?ob2)
BIND(CONCAT(IF(?pa2 = 'path' || ?pa2='inversePath' || ?pa2='alternativePath' || ?pa2='zeroOrMorePath' || ?pa2='oneOrMorePath' || ?pa2='zeroOrOnePath', CONCAT('pathType":"', ?pa2, '","path'), ?pa2), IF(regex(?ob, ",", "i") && !regex(?pa2, "message", "i"),'":["','":"'), ?ob2, IF(regex(?ob, ",", "i") ,"']",'"')) AS ?prop)}
GROUP BY ?t ?n}
GROUP BY ?t}
BIND (CONCAT('"', ?t, '":[{', ?x, "}]") AS ?tproperties)}`