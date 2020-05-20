import updateFields from './update-fields'
import {dictValuesMap} from '../../utils'

export default ({TargetsContext : [{property},]}) => {
    //console.log('at target effects', property)
    return [[updateFields], dictValuesMap(property, x => x.selected)]
}