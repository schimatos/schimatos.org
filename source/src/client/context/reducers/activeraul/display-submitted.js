import {useContext} from 'react'
import {TriplestoreContext} from '../../contexts/triplestore-context'

import {nextKey, setMinus, keepCloning} from '../../../utils'
import _ from 'underscore'

export default (state, {property}) => {
    //return state
    console.log('at display submitted', state, property)
    const ent = Object.entries(state.properties)

    const newState = ent.reduce((total, [k, v]) => {
        const databaseSelections = property[k].selected.map(x => x.key)

        //const displayed = total.properties[k].children.map(x => total.targets[x].value).filter(x => x!== '')

       // console.log(total, databaseSelections)

        if (total.propertyList[total.properties[k].property].pathType === 'alternativePath') {return total}

        const displayed = total.propertyList[total.properties[k].property].pathType === 'alternativePath' ? (
            Object.fromEntries(Object.entries(total.properties[k].children).map(([path, x]) => [path, x.map(x => total.targets[x].value).filter(x => x!== '')]))
        ) : (
            total.properties[k].children.map(x => total.targets[x].value).filter(x => x!== '')
        )

        //console.log('as', databaseSelections, displayed)



        const notDisplayed = [...setMinus(databaseSelections, displayed)]
        const children = total.properties[k].children

        const [newState1, newNotDisp] = children.reduce(([t, nDisplayed], x) => {
            const val = t.targets[x].value
            if (val === '' && nDisplayed.length > 0) {
                return [{...t, targets : {...t.targets, [x] : {...t.targets[x], value : nDisplayed[0], submitted : true}}}, nDisplayed.slice(1)]     
            } else if (val !== '' && databaseSelections.includes(val)) {
                return [{...t, targets : {...t.targets, [x] : {...t.targets[x], submitted : true}}}, nDisplayed]
            } else {
                return [t, nDisplayed]
            }
        }, [total, notDisplayed])

        if (newNotDisp.length > 0) {
            const minkey = nextKey(newState1.targets)
            const extraEntries = newNotDisp.map((x, i) => {
                return [i+minkey, {
                    parent : k,
                    value : x,
                    submitted : true,
                    loading : false,
                    shacled : false,
                    children : [],
                    hidden : false
                }]
            })
            const addedChildren = _.range(minkey, minkey + newNotDisp.length)
            newState1.properties[k].children = [...newState1.properties[k].children, ...addedChildren]
            const addedTargets = {...newState1, targets : {...newState1.targets, ...Object.fromEntries(extraEntries)}}
            return addedTargets
        } else {
            return newState1
        }
    
    }, keepCloning(state))
    return keepCloning({...newState})
}