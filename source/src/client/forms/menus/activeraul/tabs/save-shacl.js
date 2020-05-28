
import {input, checkbox, dropdown, button} from '../../../fields/functional-react'
import {useActiveraul} from '../../../../custom-hooks'
import IRIField from '../../../../validated-fields/IRI-field'

import saveShaclModal from '../../../modals/save-shacl'

export default () => {
    const {saveShacl, getShaclText} = useActiveraul()
    const modal = () => {
        const initialState = {
            name : '',
            Node : [],
            Class : [],
            ObjectsOf : [],
            SubjectsOf : []
        }

        const targOpts = (state) => ['Node', 'Class', 'ObjectsOf', 'SubjectsOf'].map(n => {
            return [IRIField, n, {placeholder : `Target ${n}${n === 'Class' ? 'e' : ''}s`, additionLabel : `Add ${n}: `, options : state[n], search :true,  noResultsMessage : `Type the name of the ${n} you wish to associate with this shacl.`, multiple : true, fluid : true, selection : true, allowAdditions : true}, `${n}${n === 'Class' ? 'e' : ''}s`]
        })
        const content = state => [
            ['Shacl Name', [input, 'name', {placeholder : 'Name...'}]],
            ['Shacl Targets', ...targOpts(state)]
        ]
        
        return {initialState, content, header : 'Save Shacl'}
    }

    //console.log('get shacl text', getShaclText())
    
    return {
        modal : saveShaclModal(getShaclText()),
        icon : 'save',
        popup : 'Save Shacl',
        onClick : x => saveShacl(x)
    }
}