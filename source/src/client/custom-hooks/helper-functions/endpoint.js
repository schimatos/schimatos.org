import {useContext} from 'react'
import {ActiveraulContext, TargetsContext, HistoryContext} from '../../context'
import triplestoreInterface from '../../triplestore-interface'

import {capitalize, toEntries} from '../../utils'

import Activeraul from '../../custom-hooks/activeraul-history'

import contexts from '../activeraul-targets-history'

export default () => {
	//console.log('at endpoint')
	const {activeraulDispatch, historyDispatch, targetsDispatch} = contexts()
	const triplestore = triplestoreInterface()

	return ({query, init, response, error, edit, other, context}) => {
		//console.log('endpoint', query, init, response, error, edit, other, context)
		const triples = ({subject, path, targets, pathType, extraTriples, additionalTriples}) => {
			return [...(pathType === 'inversePath' ? toEntries(targets).map(t => [`<${t}>`, `<${path}>`, `<${subject}>`]) : toEntries(targets).map(t => [`<${subject}>`, `<${path}>`, `<${t}>`])), ...(extraTriples || additionalTriples || [])]
		}
		const actions = toEntries(edit ? edit : []).reduce((total, entry) => {
			return entry.action !== undefined ? Object({...total, ['to' + capitalize(entry.action)] : triples(entry)}) : total
		}, {})

		const functions = Object.fromEntries(
			[['initFunc', init], ['responseFunc', response], ['errorFunc', error]].map(([name, x]) => {
				return [name, res => toEntries(x).forEach(entry => {
					const ctxt = (entry && entry.context) ? entry.context : context
					const input = {...entry, res, triplestoreAction : triplestore}
					if (ctxt === 'activeraul') {
						activeraulDispatch(input)
					} else if (ctxt === 'targets') {
						targetsDispatch(input)
					} else if (ctxt === 'history') {
						historyDispatch(input)
					}
					if (name === 'responseFunc' && Object.keys(actions).length > 0) {
						historyDispatch({type : 'GRAPH_UPDATE', actions : actions})
					}
				})]
			})
		)
		const toSend = {query, ...functions, ...actions, ...(other !== undefined ? other : {}) }

		return triplestore(toSend)
	}
}