import {values} from './subqueries'

export const propertyShape = v => `SELECT DISTINCT (concat('{', group_concat(distinct ?res; separator=","), '}') AS ?r) WHERE {
SELECT DISTINCT (concat( '"',?d1, '":{', group_concat(?res; separator=","), '}') AS ?res) WHERE {
SELECT DISTINCT ?d1 (concat('"', ?d2,'":"', ?d3,'"') as ?res) 
WHERE {?d1 ?d2 ?d3 VALUES(?d1) {${values(v)}}}}}`
    