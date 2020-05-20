import {Form} from 'semantic-ui-react'

import {setMinus, keyDelDict, dictMap, intersection, arraysUnion, toEntries, arrayToSentence, extendDict, stringToBool, stringDictRegexp, makeDictRegexp, removeDuplicates} from '../../utils'
import validatedFields from '../../validated-fields'

export default ({TargetsContext : [targets,dispatch], ActiveraulContext : [{properties, propertyList},], TriplestoreContext : [{advanced_features},]}) => {
    const {use_type_constraints,
        always_apply_range_constraints,
        use_object_types_if_no_type_specified,
        always_use_object_types
    } = advanced_features
    const {propertyTypes, typeConstraints} = targets
    const tContext = targets

    console.log('at make validators', properties, propertyList)

    //console.log('make validators effect called')

    const makeValidator = prop => {

        const getAllConstraints = constraints => {
            //console.log('get all constraints', constraints)
            const minimizedConstraints = removeDuplicates(constraints)
            //console.log('minimized contraints', minimizedConstraints)

            const newConstraints = minimizedConstraints.map(x => typeConstraints[x]?.datatype).filter(x => x!=undefined)
            //console.log('new contraints', constraints)

            if (setMinus(newConstraints, minimizedConstraints).length > 0) {
                //console.log('if', constraints)
                return getAllConstraints([...newConstraints, ...minimizedConstraints])
            } else {
                //console.log('else', minimizedConstraints)
                return [...minimizedConstraints]
            }
        }

        const property = propertyList[prop.property]

        const predicate = getPredicate(prop, property)

        //console.log('predicate', predicate)

        const {fromRange, fromOptions} = (predicate !== true && propertyTypes[predicate] !== undefined && use_type_constraints) ? propertyTypes[predicate] : {}

        //console.log('fromRange', fromRange, 'fromObjects', fromOptions, propertyTypes, propertyTypes[predicate])

        const rangeConstraints = (always_apply_range_constraints && fromRange !== undefined) ? fromRange : []
        const useObjects = (((fromRange === undefined || fromRange.length === 0) && use_object_types_if_no_type_specified) || always_use_object_types) && use_type_constraints
        const objectConstraints = (useObjects && fromOptions !== undefined) ? fromOptions : []
        // Last term in brackets below ensures IRI constraint on inverse path
        const typesToConstrain = getAllConstraints([...rangeConstraints, ...objectConstraints, ...(predicate === true ? ['http://www.w3.org/2001/XMLSchema#anyURI'] : [])])
        
        //console.log('types to constrain', typesToConstrain)
        const typeConstriantList = typesToConstrain.map(type => ({...typeConstraints[type], type}))
        // ned to convert datatype to type




        //console.log('types to constraint', typeConstriantList, typeConstraints, typeConstraints['http://example.org/name'])

        const allConstraints = [property, ...typeConstriantList]

        //console.log('all constraints', allConstraints)

        const merged = mergeConstraints(allConstraints)

        //console.log('merged constraints', merged)

        const [validator, details] = constraintsToValidator(merged)

        //console.log('constraints after constraints to validator', validator, details)

        return [validator, {...details, path : property.path, pathType : property.pathType}]
    }

    const validatorDict = dictMap(properties, ([k, v]) => ([k, makeValidator(v)]))

    //console.log('validator dict', validatorDict)

    const makeField = (id, [validators, details], targets, options) => {
        //console.log('make field details', 'id', id, 'validators', validators, 'details', details, 'targets', targets, 'options', options)
        const detailList = Object.keys(details)
        const types = details.types

        const premadeProps = makeProp(id, details, targets, options, properties, validators, tContext)

        //const Field = fieldType(details, detailList, types)

        return validatedFields(premadeProps)
    }

    dispatch({type : 'SET_VALIDATORS', validators : ({targets, options}) => dictMap(validatorDict, ([k, v]) => ([k, makeField(k, v, targets, options)]))})
}



const fieldType = (details, detailList, types) => {
    //console.log('details', details)
    if (detailList.includes('in')) {
        return details['in'].length <= 5 ? Form.Select : Form.Dropdown
    } else if (detailList.includes('pattern')) {
        return require('../../validated-fields/multi-word-field-2')
    } else if (!types || types.length === 0) {
        return Form.Input
    } else {
        const condensed = types ? types.map(x => mapping[x]) : []
        if (condensed.includes('boolean')) {
            return Form.Checkbox
        } else if (condensed.includes('URI')) {
            return Form.Dropdown
        } else if (condensed.includes('date')) {
            return Form.Input
        } else {
            return Form.Input
        }
    }
}


const makeProp = (id, details, targets, additionalOptions, properties, validators, tContext) => {

    // to come back
    //const selections = getSelections(targets, properties, id)
    //const allValidators = validators//duplicateCheckValidation(validators, selections)


    const {options, selections} = tContext.property[id]//getOptions(id, targets, options)
    const [availableOptions, takenOptions] = [options, selections]
    

    const dropdownOptions = details['in'] ? setMinus(details['in'], takenOptions) : {...options, ...additionalOptions}
    //console.log('details before', details)
    return {...details ,validators : duplicateCheckValidation(validators, takenOptions ? takenOptions.map(x => x.value) : [])}
}

const getSelections = (targets, properties, id) => {
    return []
}

const getOptions = (targets, properties, id) => {
    return [[],[]]
}

const duplicateCheckValidation = (validators, selections) => {
    return ({...validators, validate : extendDict(validators.validate,  {noDuplicates : v => !selections.includes(v) ||  'this entry should not match an existing selection' })})
}

const getPredicate = (prop, property) => {
    // To finish properly. True indicates that the path is inverse and hence an IRI is required
    const x = property.path
    //console.log('get predicate', property)
    return {
        'path' : Array.isArray(x) ? x[x.length-1] : x,
        'inversePath' : true,
    }[property.pathType]
}

export const mergeConstraints = constraints => {
    return constraints.reduce((validator, constraint) => {
        const updatedConstraint = keyDelDict(dictMap(constraint, ([k, v]) => [k, k==='pattern' ? {pattern : v, flags : constraint.flags ? constraint.flags : ''} : v]), 'flags')

        //console.log('updated constraint', updatedConstraint)

        const lowerBounds = ['minLength', 'minExclusive', 'minInclusive']
        const upperBounds = ['maxLength', 'maxnExclusive', 'maxInclusive']
        const listed = ['languageIn', 'lessThan', 'lessThanOrEquals', 'equals', 'disjoint', 'pattern', 'type', 'defaultValue']
        const listedIntersection = ['in']
        const booleanOr = ['isNumeric', 'uniqueLang']

        const toIterate = [[lowerBounds, (a,b) => Math.max(a, b), Number],
            [upperBounds, (a,b) => Math.min(a, b), Number],
            [listed, (a,b) => arraysUnion([a,b]), toEntries],
            [listedIntersection, (a,b) => intersection(a,b), toEntries],
            [booleanOr, (a, b) => a||b, stringToBool]
        ]

        const singleAggregation = (toAgg, aggFunc, converter, val) => {
            const v = validator[toAgg]
            const c = updatedConstraint[toAgg]
            if (v !== undefined && c !==undefined) {
                return {...val, [toAgg] : aggFunc(v, converter(c))}
            } else if (v === undefined && c===undefined) {
                return val
            } else if (v === undefined) {
                return {...val, [toAgg] : converter(c)}
            } else {
                return {...val, [toAgg] : v}
            }
        }

        return toIterate.reduce((t, [e,f, converter]) => {
            return e.reduce((total, c) => singleAggregation(c, f, converter, total), t)
        }, {})
        
    }, {})
}

export const constraintsToValidator = constraints => {

    console.log('constraints at constraints to validator', constraints)

    const isNumeric = intersection(Object.keys(constraints), ['maxInclusive', 'minExclusive', 'minInclusive', 'maxInclusive']).length > 0 || constraints.isNumeric
    const isString = intersection(Object.keys(constraints), ['pattern', 'languageIn', 'uniqueLang', 'maxLength', 'minLength']).length > 0 || constraints.isString

    // const inferredType = {
    //     'maxInclusive' : 'numeric',
    //     'minInclusive' : 'numeric',
    //     'maxExclusive' : 'numeric',
    //     'minExclusive' : 'numeric',
    //     'lessThan' : 'numeric',
    //     'lessThanOrEqual' : 'numeric',
    //     'pattern' : 'string',
    //     'languageIn' : 'string',
    //     'uniqueLang' : 'string',
    //     'maxLength' : 'string',
    //     'minLength' : 'string'
    // }

    if (isNumeric) {
        constraints.isNumeric = true
    }

    if (isString) {
        constraints.isString = true
    }


    //console.log('after', constraints)

    const numericRequirement = req => v => {
        return (isNaN(Number(v)) ? `entry should be a number` : req(v))
    }

    const vFuncMapping = requirement => ({
        in : () => v => requirement.includes(v) || `entry should be one of the following values: ${arrayToSentence(requirement)}`,
        isNumeric : () => numericRequirement(v => true),
        maxExclusive : () => numericRequirement(v => Number(v) < Number(requirement) || `should be less than than ${requirement}`),
        minExclusive : () => numericRequirement(v => Number(v) > Number(requirement) ||  `should be greater than ${requirement}`),//Object({value : v => parseInt(v) > parseInt(requirement), message : `should be greater than ${requirement}`}),
        additionalPattern : () =>  v => testDictRegexp(requrement, v) || `should match pattern ${stringDictRegexp(requirement)}`, // change to own custom description function
        languageIn : () => v => true || `this entry should be in one of the following languages: ${arrayToSentence(requirement)}`, // get api etc // also add details as this can be sued to edit the form field
        lessThan : () => numericRequirement(v => true || `this entry should be less than the value of: ${arrayToSentence(requirement)}`), // get api etc
        lessThanOrEquals : () => numericRequirement(v => true || `this entry should be less than or equal to the value of: ${arrayToSentence(requirement)}`), // get api etc
        equals : () => v => true || `this entry should be equal to the value of: ${arrayToSentence(requirement)}`, // get api etc // also add details as this can be sued to edit the form field
        disjoint : () => v => true || `this entry should not have the same values as: ${arrayToSentence(requirement)}`, // get api etc
        uniqueLang : () => v => true || `this entry should not be in the same language as: ${arrayToSentence(requirement)}` // get api etc
    })

    const hFormMapping = requirement => ({
        maxInclusive : {name : 'max', message : `should be less than or equal to ${requirement}`},
        maxLength : {name : 'maxLength', message : `should have at most ${requirement} character${requirement > 1 ? 's' : ''}`},
        minInclusive : {name : 'min', message : `should be greater than or equal to ${requirement}`},
        minLength : {name : 'minLength', message :  `should have at least ${requirement} character${requirement > 1 ? 's' : ''}`}
    })

    const validationFuncMapping = (name, requirement) => vFuncMapping(requirement)[name]()
    const hookFormMapping = (name, requirement) => hFormMapping(requirement)[name]


    const specialCases = (name, constraint, validators, details) => {
        const pattern = () => {
            const formsPattern = constraint[0]
            const functionPatterns = constraint.slice(1)
            const newValidators = extendDict(validators, {pattern : { value : makeDictRegexp(formsPattern), message : `should match pattern ${stringDictRegexp(formsPattern)}`}})
            //console.log('new Validators',newValidators)
            // Do not think these are working correctly
            const out = [functionPatterns.reduce((total, pattern, i) => ({...total, validate : extendDict(total.validate, { ['pattern'+i] : validationFuncMapping('additionalPattern', pattern)})}), newValidators), {...details, pattern : formsPattern}]
            //console.log('output of pattern special case', out)
            return out
        }
        
        const type = () => {
            const types = getPrimitives(constraint)
            const numericTypes = ['integer', 'decimal', 'float', 'double', 'nonPositiveInteger', 'long', 'int', 'short', 'byte', 'nonNegativeInteger', 'unsignedLong', 'unsignedInt', 'unsignedShort', 'unsignedByte', 'postiveInteger']
            const newDetails = {...details, types}
            if (intersection(types, numericTypes).length > 0) {
                return  [{...validators, validate : extendDict(validators.validate, { 'isNumeric' : validationFuncMapping('isNumeric', true)})}, newDetails]
            } else {
                return [validators, newDetails]
            }
        }

        const isString = () => {
            return [validators, {...details, inferredTypes : extendArray(details.inferredTypes, ['string'])}]
        }

        const isNumeric = () => {
            return [validators, {...details, inferredTypes : extendArray(details.inferredTypes, ['number'])}]
        }

        return ({
            pattern,
            type,
            isString,
            isNumeric
        })[name]()
    }

    const addDetails = (name, constraint, details) => {
        if (name === 'defaultValue') {
            return {...details, default : constraint}
        } else if (name === 'in') {
            return {...details, values : constraint}
        } else {
            return details
        }
    }

    const hookFormsValidators = Object.keys(hFormMapping())
    const functionValidators = Object.keys(vFuncMapping())
    const specialValidators = ['pattern', 'type']

    const reduced = Object.entries(constraints).reduce(([validators, det], [name, constraint]) => {
        const details = addDetails(name, constraint, det)
        if (functionValidators.includes(name)) {
            return [{...validators, validate : extendDict(validators.validate, { [name] : validationFuncMapping(name, constraint)})}, details]
        } else if (hookFormsValidators.includes(name)) {
            const entry = hookFormMapping(name, constraint)
            return [extendDict(validators, {[entry.name] : { value : constraint, message : entry.message}}), details]
        } else if (specialValidators.includes(name)) {
            return specialCases(name, constraint, validators)
        } else {
            return [validators, details]
        }
    }, [{required : {value : true, message : 'Required'}}, {}])

    //console.log('reduced constraint', reduced)

    return reduced


}

const getPrimitives = types => {
    const xsdIRI = 'http://www.w3.org/2001/XMLSchema#'
    return types.filter(t => t.slice(0, xsdIRI.length) === xsdIRI).map(t => t.slice(xsdIRI.length,))
}

// sh:languageIn // How do we even validate this NLP or give dropdown for the language of
// sh:lessThan // "Specifies a property that must have smaller values than the value nodes."@en ;
// sh:lessThanOrEquals //"Specifies a property that must have smaller or equal values than the value nodes."@en ;
// sh:equals
// sh:disjoint
// sh:maxExclusive (v => v<x)
// sh:maxInclusive => max
// sh:maxLength => maxLength
// sh:minExclusive (v => v>x)
// sh:minInclusive => min
// sh:minLength => minLength

// sh:node -> all values must conform to this shape
// sh:nodeKind -> specifies if the node is an IRI or literal
// sh:not -> nodes must not conform to this shape
// sh:or -> nodes must conform to at least one shape in a list

// (pattern, flags) => `/${pattern}/${flags}`

// sh:flags -> optional flag added with regexp pattern
// sh:pattern -> regexp => pattern 
// sh:uniqueLang -> all nodes must have a single or unique lang tag
// sh:xone -> conforms to exactly one of a list of shapes



// const mapping = {
//     string : {field : Form.Input, type : ,
//     boolean : Form.Checkbox,
//     decimal : ,
//     integer ,
//     double ,
//     float ,
//     date ,
//     time ,
//     dateTime ,
//     dateTimeStamp ,
//     gYear ,
//     gMonth ,
//     gDay ,
//     duration ,
//     yearMonthDuration ,
//     dayTimeDuration ,
//     byte ,
//     short ,
//     int ,
//     long ,
//     unsignedByte ,
//     unsignedShort ,
//     unsignedInt ,
//     unsignedLong ,
//     positiveInteger ,
//     nonNegativeInteger ,
//     negativeInteger ,
//     negativeInteger ,
//     nonPositiveInteger ,
//     negativeInteger ,
//     hexBinary ,
//     anyURI ,
//     language ,
//     normalizedString ,
//     language ,
//     normalizedString ,
//     token ,
//     valueNMTOKEN ,
//     NAME ,
//     NCNAME

//     other : Form.Field
// }

// additional rdf:HTML, rdf:XMLLiteral, rdf:langString, rdf:Property

// // Send async sparql query to test whether it conforms to the shapes listed. Show loading while doing this
// sh:AndConstraintComponent
// sh:ClassConstraintComponent 


// // Validation constraints that can be applied to nodes without regarding siblings or effects on other shapes in graph
// // qualified mincount, maxcount etc should be considererd separately

// sh:languageIn // How do we even validate this NLP or give dropdown for the language of
// sh:lessThan // "Specifies a property that must have smaller values than the value nodes."@en ;
// sh:lessThanOrEquals //"Specifies a property that must have smaller or equal values than the value nodes."@en ;
// sh:maxExclusive (v => v<x)
// sh:maxInclusive => max
// sh:maxLength => maxLength
// sh:minExclusive (v => v>x)
// sh:minInclusive => min
// sh:minLength => minLength

// sh:node -> all values must conform to this shape
// sh:nodeKind -> specifies if the node is an IRI or literal
// sh:not -> nodes must not conform to this shape
// sh:or -> nodes must conform to at least one shape in a list

// (pattern, flags) => `/${pattern}/${flags}`

// sh:flags -> optional flag added with regexp pattern
// sh:pattern -> regexp => pattern 
// sh:uniqueLang -> all nodes must have a single or unique lang tag
// sh:xone -> conforms to exactly one of a list of shapes

// sh:ask -> executes sparql ask query which reutrn t/f res
// sh:construct -> construct query
// sh:select
// sh:update
// sh:prefixes -> prefixes to be applied before executing assocairtated quer
// sh:prefix
// sh:namespace
// sh:sparql

// sh:defaultValue
// 	a rdf:Property ;
// 	rdfs:label "default value"@en ;
// 	rdfs:comment "A default value for a property, for example for user interface tools to pre-populate input fields."@en ;
// 	rdfs:domain sh:PropertyShape ;
// 	rdfs:isDefinedBy sh: .

// sh:description
// 	a rdf:Property ;
// 	rdfs:label "description"@en ;
// 	rdfs:comment "Human-readable descriptions for the property in the context of the surrounding shape."@en ;
// 	rdfs:domain sh:PropertyShape ;
// 	# range: xsd:string or rdf:langString
// 	rdfs:isDefinedBy sh: .

// sh:group
// 	a rdf:Property ;
// 	rdfs:label "group"@en ;
// 	rdfs:comment "Can be used to link to a property group to indicate that a property shape belongs to a group of related property shapes."@en ;
// 	rdfs:domain sh:PropertyShape ;
// 	rdfs:range sh:PropertyGroup ;
// 	rdfs:isDefinedBy sh: .

// sh:name
// 	a rdf:Property ;
// 	rdfs:label "name"@en ;
// 	rdfs:comment "Human-readable labels for the property in the context of the surrounding shape."@en ;
// 	rdfs:domain sh:PropertyShape ;
// 	# range: xsd:string or rdf:langString
// 	rdfs:isDefinedBy sh: .

// sh:order
// 	a rdf:Property ;
// 	rdfs:label "order"@en ;
// 	rdfs:comment "Specifies the relative order of this compared to its siblings. For example use 0 for the first, 1 for the second."@en ;
// 	# range: xsd:decimal or xsd:integer ;
//     rdfs:isDefinedBy sh: .
    

//     sh:js
// 	a rdf:Property ;
// 	rdfs:label "JavaScript constraint"@en ;
// 	rdfs:comment "Constraints expressed in JavaScript." ;
//   	rdfs:range sh:JSConstraint ;
// 	rdfs:isDefinedBy sh: .

// sh:jsFunctionName
// 	a rdf:Property ;
// 	rdfs:label "JavaScript function name"@en ;
// 	rdfs:comment "The name of the JavaScript function to execute."@en ;
// 	rdfs:domain sh:JSExecutable ;
// 	rdfs:range xsd:string ;
// 	rdfs:isDefinedBy sh: .

// sh:jsLibrary
// 	a rdf:Property ;
// 	rdfs:label "JavaScript library"@en ;
//   	rdfs:comment "Declares which JavaScript libraries are needed to execute this."@en ;
// 	rdfs:range sh:JSLibrary ;
// 	rdfs:isDefinedBy sh: .

// sh:jsLibraryURL
// 	a rdf:Property ;
// 	rdfs:label "JavaScript library URL"@en ;
// 	rdfs:comment "Declares the URLs of a JavaScript library. This should be the absolute URL of a JavaScript file. Implementations may redirect those to local files."@en ;
// 	rdfs:domain sh:JSLibrary ;
// 	rdfs:range xsd:anyURI ;
// 	rdfs:isDefinedBy sh: .


// const mapping = {
//     string : {field : Form.Input, type : ,
//     boolean : Form.Checkbox,
//     decimal : ,
//     integer ,
//     double ,
//     float ,
//     date ,
//     time ,
//     dateTime ,
//     dateTimeStamp ,
//     gYear ,
//     gMonth ,
//     gDay ,
//     duration ,
//     yearMonthDuration ,
//     dayTimeDuration ,
//     byte ,
//     short ,
//     int ,
//     long ,
//     unsignedByte ,
//     unsignedShort ,
//     unsignedInt ,
//     unsignedLong ,
//     positiveInteger ,
//     nonNegativeInteger ,
//     negativeInteger ,
//     negativeInteger ,
//     nonPositiveInteger ,
//     negativeInteger ,
//     hexBinary ,
//     anyURI ,
//     language ,
//     normalizedString ,
//     language ,
//     normalizedString ,
//     token ,
//     valueNMTOKEN ,
//     NAME ,
//     NCNAME

//     other : Form.Field
// }


// const fieldMapping = {
//     "url" : Form.Input,
//     "week" : Form.Input,
//     "url" : Form.Input,
//     "time" : Form.Input,
//     "text" : Form.Input,
//     "range" : Form.Input,
//     "number" : Form.Input,
//     "month" : Form.Input,
//     "email" : Form.Input,
//     "datetime-local" : Form.Input,
//     "date" : Form.Input,
//     "color" : Form.Input,
//     default : Form.Input
// }