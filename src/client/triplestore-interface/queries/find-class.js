export const findClass = ({subject, predicate, targs}) => `
    SELECT (concat('{', group_concat(distinct ?ts; separator=','), '}') as ?r)
    FROM {kgraph}
    WHERE{
    SELECT (concat('"', str(?o), '":["' , group_concat(distinct ?t; separator='","'), '"]') as ?ts)  {
    <${subject}> <${predicate}> ?o .
    ?o rdf:type ?t
    FILTER(str(?t) IN (${targs.reduce((t,x) => t+`"${x}"`)}))
    } GROUP BY str(?o)}
    `

    