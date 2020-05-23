export default ({action, graph, triples}) => `${action} DATA { GRAPH {${graph}}
{${triples.reduce((total, [s, p, o]) => total + ` ${s} ${p} ${o.includes('://') ? o : o.replace('<', "'").replace('>', "'")} .`,'')}} } `
// Need to change this hacky fix for object insertion