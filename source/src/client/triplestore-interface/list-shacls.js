import requester from './requester/single-query'
import {shaclList} from './queries/shacl-list'

export const listShacls = async props => {
    const query = shaclList(props)
    return await requester(query, 'sgraph', props.triplestore,  x => JSON.parse(x[0].r.value).filter(x => x!== ''), [], true)
}