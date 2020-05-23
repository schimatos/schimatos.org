import requester from './requester/single-query'
import {options} from './queries'

export default async props => {
    const s = props.subject
    const p = props.predicate
    const subject = (s.includes('http://') && !s.includes('<')) ? '<' + s + '>' : s
    const predicate = (p.includes('http://') && !p.includes('<')) ? '<' + p + '>' : p
    return await requester(options({...props, subject, predicate}), 'kgraph', props.triplestore, x => {
        const {options, selections} = JSON.parse(x[0].r.value)
        return {options : options.filter(x => x!=""), selections : selections.filter(x => x!="")}
    }, {options : [], selections: []})
}