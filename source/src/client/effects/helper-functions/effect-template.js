import {useEffect} from 'react'
import {hash, callAll} from '../../utils'

export default (effects, trigger, props) => {
    return useEffect(() => {
        console.log(effects, trigger, props)
        callAll(effects, props)
    }, hash(trigger))
}