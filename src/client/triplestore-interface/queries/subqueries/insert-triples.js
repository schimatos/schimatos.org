export const insertTriples = (insert, namedGraph) => {
    if (insert !==undefined) {
        return `{INSERT DATA {GRAPH {${namedGraph}} {${insert.reduce(([s, p, o]))}}}}`
    } else {
        return ``
}}