import {values} from './subqueries'

export const badLoad = v => `SELECT DISTINCT (concat('{', group_concat(?res; separator=","), '}') AS ?r) WHERE {
SELECT DISTINCT (concat('"', ?start, '":[', group_concat(?path; separator=','),']') as ?res) WHERE
{SELECT DISTINCT ?start (concat('["', replace(str(?pth), sh:, ""), '",', IF(!isBlank(?d1),concat('"',  replace(str(?d1), sh:, ""), '"'), concat('{"', group_concat(concat(replace(str(?d2), sh:, ""), '":"', replace(str(?d3), sh:, "")); separator='","'), '"}')), ',"', ?b, '"', ']') AS ?path)
WHERE {?start ?pth ?d1
OPTIONAL {?d1 rdf:rest*/rdf:first ?d2 . ?dx rdf:first ?d2 . ?dx rdf:rest/rdf:first ?d3 . ?d1 rdf:rest* ?dx
BIND(false as ?b)}
OPTIONAL {?d1 ?d2 ?d3 FILTER(?d2!=rdf:rest && ?d2!=rdf:first)
BIND(true as ?b)}
FILTER(?pth!=rdf:type)
VALUES(?start) {${values(v)}}
}GROUP BY ?start ?d1 ?pth ?b}}`

export const orderedShapeLoad = v => `SELECT DISTINCT (concat('{', group_concat(?res; separator=","), '}') AS ?r) WHERE {
    SELECT DISTINCT (concat('"', ?start, '":[', group_concat(?path; separator=','),']') as ?res) WHERE
    {SELECT DISTINCT ?start (concat('["', replace(str(?pth), sh:, ""), '",', IF(!isBlank(?d1),concat('"',  replace(str(?d1), sh:, ""), '"'), concat('{"', 
    
    IF(isBlank(?dx), concat('start":["', ?d1, '","',?st, '"],"'), ""),
    
    group_concat(
    
    
    concat(
    
    replace(
    
    IF( !isBlank(?dx) , str(?d2), str(?dx))
    
    
    , sh:, ""), 
    
    IF( !isBlank(?dx) , '":"', '":'),
    
    
    IF( isBlank(?dx) , '["', '')
    
    , IF( !isBlank(?dx) , "", str(?dy)),
    
    IF( isBlank(?dx) , '","', '')
    ,
     replace(
    
    str(?d3)
    
    , sh:, "")
    , IF( !isBlank(?dx) , '"', '"]'))
    
    ; separator=',"'), '}')), ',"', ?b, '"', ']') AS ?path)
    WHERE {?start ?pth ?d1
    OPTIONAL {
    
    ?d1 rdf:first ?st .
    ?d1 rdf:rest*/rdf:first ?d2 . ?dx rdf:first ?d2 . ?dx rdf:rest/rdf:first ?d3 . ?d1 rdf:rest* ?dx . OPTIONAL {?dx rdf:rest ?dy . ?d1 rdf:rest* ?dx . ?d1 rdf:rest* ?dy}
    BIND(false as ?b)}
    OPTIONAL {?d1 ?d2 ?d3 FILTER(?d2!=rdf:rest && ?d2!=rdf:first)
    BIND(true as ?b)}
    FILTER(?pth!=rdf:type)
    VALUES(?start) {${value(v)}}
    }GROUP BY ?start ?d1 ?pth ?st ?dx ?b}}`