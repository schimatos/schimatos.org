export const findDatatypes = ({subject, predicate, targs}) => `
    SELECT DISTINCT (concat('{', group_concat(distinct ?ts; separator=','), '}') as ?r)
    FROM {kgraph}
    WHERE{
    SELECT DISTINCT (concat('"', str(?d), '":["' , group_concat(distinct (datatype(?d) as ?t); separator='","'), '"]') as ?ts)  {
    <${subject}> <${predicate}> ?d
    FILTER(str(?d) IN (${targs.reduce((t,x) => t+`"${x}"`)}))
    } GROUP BY str(?d)}
    `

    