export const options = ({subject, predicate, inverse}) => `SELECT DISTINCT (concat( '{"options":[', group_concat(distinct ?opts; separator=', selections:'), '],"selections":[', group_concat(distinct ?selts; separator='"}:"{'), ']}') as ?r)
FROM {knamed}
{{SELECT DISTINCT (concat('"',group_concat(distinct ?o; separator='","'), '"') AS ?opts) (concat('"',group_concat(distinct ?selected; separator='","'), '"') AS ?selts)
WHERE {
?s ${predicate} ?o
OPTIONAL {SELECT DISTINCT (?o AS ?selected) {${inverse ? "?o" : subject} ${predicate} ${!inverse ? "?o" : subject}}}
}
GROUP BY datatype(?selected) datatype(?o)}}`