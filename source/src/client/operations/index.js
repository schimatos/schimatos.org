import display from './display'
import general from './general'
import properties from './properties'
import targets from './targets'

export default ({operation, ...props}) => {
    return {
        'dislpay' : display,
        'general' : general,
        'properties' : properties,
        'targets' : targets                
    }
}