import {keepCloning} from '../../utils'

export default ({TargetsContext : [targets,], useActiveraulHistory : [,dispatch]}) => {
    //console.log('update fields called', targets, targets.property)
    dispatch({type : 'DISPLAY_SUBMITTED', property : keepCloning(targets.property)})
}