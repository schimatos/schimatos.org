import requester from '../requester/single-query'
import graphUpdate from './graph-update'

export const performUpdate = async ({action, graph, triples}) => {
	return await requester(graphUpdate({action, graph : graph + 'named', triples}), graph + 'graph')
}