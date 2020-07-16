import React from 'react'
import {input, dropdown} from '../fields/functional-react'
import IRIField from '../../validated-fields/IRI-field'
import {TextArea} from 'semantic-ui-react'
import conversions from '../../custom-hooks/helper-functions/conversions'

import DownloadButton from '../../components/download-button'
import shacl from '../../context/reducers/shacl'
import { access } from 'fs'

export default (shaclFile) => {
    const IRI = IRIField('knowledge')
    const Name = IRIField('shacl')
    const shaclConversions = conversions(1)
    const {makeIRIMulti, makeIRIMixed, makeIRI} = conversions(0)

    const remakeTtl = state => {
        // console.log('inside remake ttl', state)
        const forceIRI = name => {
            return '<'+(shaclConversions.makeIRI(name))+'>'
        }
    
        const forceIRIKg = name => {
            return '<'+makeIRI(name)+'>'
        }

        const targetByPrefixes = targetsDict => {
            const allPrefixes = Object.entries(targetsDict).filter(([k, v]) => k!== 'turtle' && k!== 'name')
            .reduce((total, x) => `${total}${targetBy(x)}`,``)
            return allPrefixes
        }
        
        const targetBy = ([targetType, targets]) => {
            const number = targets.length
            // console.log('targetTypes', targetType, targets)
            return number === 0 || targetType === 'name' ? '' : (
            targets.reduce((total, x, i) => i < number - 1 ? `${total} ${forceIRIKg(x)},` : `${total} ${forceIRIKg(x)}${number > 1 ? ']' : ''} ;`,`\n\tsh:target${targetType} `+(number > 1 ? '[' : ''))
            )
        }

        return `${forceIRI(state.name)}
\ta sh:NodeShape ;${targetByPrefixes(state)}` + shaclFile
    }

    const base = {
        name : '',
        Node : [],
        Class : [],
        ObjectsOf : [],
        SubjectsOf : [],
        empt : ''
    }

    const getLast = x => {
        const l1 = x.split('/')
        const l2 = l1[l1.length-1].split('#')
        const l3 = l2[l2.length-1].split('.')
        const l4 = l3[l3.length-1]
        const isShape = ['shape', 'Shape'].includes(l4.slice(l4.length-5,))
        const l5 = isShape ? l4 : (l4 + 'Shape')
        return l5 + '.ttl'
    }

    const initialState = {...base, turtle : 'ex:shapeName\n\ta sh:NodeShape ;\t' + shaclFile.replace(',h',' h').replace(';h',' h')}

    const targOpts = (state) => ['Node', 'Class', 'ObjectsOf', 'SubjectsOf'].map(n => {
        return [p => <IRI {...p}/>, n, {placeholder : `Target ${n}${n === 'Class' ? 'e' : ''}s`, additionLabel : `Add ${n}: `, options : state[n], search :true,  noResultsMessage : `Type the name of the ${n} you wish to associate with this shacl.`, multiple : true, fluid : true, selection : true, allowAdditions : true}, `${n}${n === 'Class' ? 'e' : ''}s`,{routine : x => ({...x, turtle :  remakeTtl(x)})}]
    })
    const content = state => [
    //     ['Shacl Name', [p => <Name {...p}/>, 'name', {placeholder : 'Name...'},,{routine : x => ({...x, turtle :  x})}]],
    //    ['Shacl Targets', ...targOpts(state)],
        ['Shacl File', [props => <TextArea {...{...props, style : {width : '100%'}}} />, 'turtle',,,{routine : x => {

            const newState = {...x, turtle :  x}

            return x//newState
        }}]
        ,[() => <DownloadButton style={{align : 'right'}} state={state} filename={getLast(state.name)} text={state.turtle}/>, 'empt']
        ]
    ]
    
    return {initialState, content, header : 'Save Shacl'}
}

// const saveShacl = x => {
//     const forceIRI = name => {
//         return '<'+(shaclConversions.makeIRI(name))+'>'
//     }

//     const forceIRIKg = name => {
//         return '<'+makeIRI(name)+'>'
//     }
    
//     const targetByPrefixes = targetsDict => {
//         const allPrefixes = Object.entries(targetsDict)
//         .reduce((total, x) => `${total}${targetBy(x)}`,``)
//         return allPrefixes
//     }
    
//     const targetBy = ([targetType, targets]) => {
//         const number = targets.length
//         return number === 0 ? '' : (
//         targets.reduce((total, x, i) => i < number - 1 ? `${total} ${forceIRIKg(x)},` : `${total} ${forceIRIKg(x)}${number > 1 ? ']' : ''} ;`,`\nsh:target${targetType} `+(number > 1 ? '[' : ''))
//         )
//     }
    
//     const property2ttl = getShacl//(property, children, depth)
    
//     const turtleProperties = (id, state, depth) => {
//         const childs = state.targets[id].children
//         .reduce((total, x) => {
//             const {children, property} = state.properties[x]
//             console.log('inside turtle properties')
//             return `${total}${property2ttl(state.propertyList[property], children.reduce((t, i) => `${t}${turtleProperties(i, state, depth + 1)}`, ``))}`
//         }, ``)
//         return childs
//     }

//     const name = x.name
//     const targetDict = filterDict(x, ([k,v]) => k!=='name')
//     const ttlString = `${forceIRI(name)}
//     a sh:NodeShape ;${targetByPrefixes(targetDict)}${turtleProperties(state.focus.id, state, 0)}`.split(';')
//     ttlString.pop()
//     const res = ([].concat(ttlString)).reduce((t,x) => t+(t!=='' ? ';' : '')+x, '').replace(',',';') + '.'
// }