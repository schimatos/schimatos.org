import requester from './requester/single-query'
import {update} from './queries/update'

export const graphUpdate = async ({graph, toInsert, toDelete, triplestore}) => {
	return await requester(update({graph : graph + 'named', toInsert, toDelete, triplestore}), graph + 'graph', triplestore, true, true)
}