import {useContext} from 'react'
import {TriplestoreContext} from '../../context'

import {strip} from '../../utils'

export default graph => {
	//console.log('at conversions')
	const [{
		settings,
		knowledge_graphs,
		shacl_graphs,
		add_graph_prefixes,
		hide_graph_prefixes
	},] = useContext(TriplestoreContext)

	const {knowledge_graph, shacl_graph} = settings

	// 0 is knowledge graph, 1 is default shacl graph, otherwise, use specified shacl
	// graph. This is done so that users can have any name (string) for the graphs in
	// their settings.
	const {prefix} = graph === 0 ? knowledge_graphs[knowledge_graph] : (
		graph === 1 ? shacl_graphs[shacl_graph] : (
			shacl_graphs[graph]
		)
	)
	
	const makeIRI = input => (add_graph_prefixes && !input.includes('http://')) ? (
		prefix + input
	) : (
		input
	)

	const makeIRIMulti = inputs => inputs.map(makeIRI)

	const makeIRIMixed = inputs => Array.isArray(inputs) ? makeIRIMulti(inputs) : makeIRI(inputs)

	const displayIRI = input => (hide_graph_prefixes) ? (
		strip(input, prefix)
	) : (
		input
	)

	const allShaclDisplayIRI = graph => input => (hide_graph_prefixes) ? (
		strip(input, shacl_graphs[graph].prefix)
	) : (
		input
	)

	const displayIRIMulti = inputs => inputs.map(displayIRI)

	const makeInput = ({type, value}) => {
		return type === 'IRI' ? makeIRI(value) : value
	}

	const displayInput = ({type, value}) => {
		return type === 'IRI' ? displayIRI(value) : value
	}

	const makeQueryTerm = input => input.includes('http://') ? (
		'<' + input + '>'
	) : (
		input
	)

	return {
		makeIRI,
		makeIRIMulti,
		makeIRIMixed,
		displayIRI,
		displayIRIMulti,
		makeInput,
		displayInput,
		makeQueryTerm,
		allShaclDisplayIRI,
		prefix
	}
}