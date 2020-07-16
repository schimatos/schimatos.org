import requester from './requester/single-query'
import {options} from './queries'

export default async props => {
    const s = props.subject
    const p = props.predicate
    const subject = (s.includes('http://') && !s.includes('<')) ? '<' + s + '>' : s
    const predicate = (p.includes('http://') && !p.includes('<')) ? '<' + p + '>' : p
    const {options: o, selections} = await requester(options({...props, subject, predicate}), 'kgraph', props.triplestore, x => {
        const {options, selections} = JSON.parse(x[0].r.value)
        return {options : options.filter(x => x!=""), selections : selections.filter(x => x!="")}
    }, {options : [], selections: []})

    const o2 = await requester(`
    SELECT DISTINCT ?o FROM {knamed} WHERE {
        ${props.inverse ? `?o ${predicate} ?s` : `?s ${predicate} ?o`}
    }
    `, 'kgraph', props.triplestore, x => {
        // console.log(x)
        return x.map(x => x.o.value).filter(v => v !== '')
    })

    // console.log('os', o, o2)

    return await {
        options : [...o, ...o2],
        selections
    }
}