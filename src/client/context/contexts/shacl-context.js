import customProvider from '../custom-provider'
import reducer from '../reducers/shacl'

const [ShaclContext, ShaclProvider] = customProvider(reducer, {
    selections : {}, 
    options : {}
}, 'ShaclContext')

export {ShaclContext, ShaclProvider}