import singleUpdate from './single-update'

export const update = ({graph, toInsert, toDelete}) => singleUpdate({action : 'INSERT', graph, triples : toInsert}) + singleUpdate({action : 'DELETE', graph, triples : toDelete})