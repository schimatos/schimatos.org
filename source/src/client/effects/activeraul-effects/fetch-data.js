export default ({endpoint, kgraphConversions : {displayIRI, makeIRI}, ActiveraulContext : [state,], TargetsContext : [targets,]}) => {

    ////console.log('fect data called')

        const getOptions = (k, parent, property) => {
             //console.log('inside get options')
            // //console.log('inside get options', k)
            // //console.log(k)
            // //console.log(parent, property)
            // //console.log(state, state.targets, state.targets[parent])
            ////console.log('inside for each',state.targets, pare)
            if (k > -1 && state.targets[parent] && state.targets[parent].submitted) {
                ////console.log('isnide if 1')
                
                const {requested, loading} = targets.property[k]
                const {path, pathType} = state.propertyList[property]
               // //console.log('end of if 1')
                // Ignoring alternate paths for now
                if (!requested && !loading && pathType !== 'alternativePath') {
                    ////console.log('inside if 2')
                    endpoint({
                        query : 'OPTIONS', context : 'targets',
                        init : {type : 'SET_LOAD_STATUS', category : 'property', ids : [k], loading : true},
                        error : {type : 'SET_LOAD_STATUS', category : 'property', ids : [k], loading : false},
                        response : {type : 'SEARCH_RESPONSE', category : 'property', id : k, displayIRI, makeIRI},
                        other : {subject : state.targets[parent].value, predicate : path, inverse : pathType === 'inversePath'}
                    })
                }
        }
        //console.log('afer get options')
    
    }

        //console.log('state', state, state.properties)

        Object.entries(state.properties ? state.properties : {}).forEach(([k, {parent, property}]) => {
            //console.log('inside object.entries')
            getOptions(k, parent, property)
        })
}