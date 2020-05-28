import requester from './requester/single-query'
import {optionsList} from './queries/options-list'

export const listOptions = async props => {
    const query = optionsList(props)
    //console.log('list options', query)
    return await requester(query, 'kgraph', props.triplestore,  x => JSON.parse(x[0].r.value).filter(x => x!== ''), [], false)
}