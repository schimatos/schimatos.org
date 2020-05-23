export const filterSeverities = severities => {
    const toInclude = severities.filter(x => x!=='undefined')
    const nexists = severities.includes('undefined')
    const notExists = nexists ? '|| NOT EXISTS { SELECT ?n WHERE {?n sh:severity ?w}}' : '' 
    return `FILTER (EXISTS {SELECT ?n {?n sh:severity ?w . VALUES (?w) {${toInclude.reduce((t, r) => `${t}(sh:${r})`, ``)}}}} ${notExists} )`
}