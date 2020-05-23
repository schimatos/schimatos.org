import requester from './requester/single-query'
//import {options} from './queries'

export default async props => {
    const s = props.subject
    const p = props.predicate
    const subject = (s.includes('http://') && !s.includes('<')) ? '<' + s + '>' : s
    return await requester( `SELECT DISTINCT ?p ?o FROM {knamed} WHERE {${subject} ?p ?o} `, 'kgraph', props.triplestore, x => x.reduce((t, x) => [...t, [x.p.value, x.o.value]], []), [])
}