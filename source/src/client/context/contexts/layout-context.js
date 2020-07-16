import customProvider from '../custom-provider'
import reducer from '../reducers/layout'

const [LayoutContext, LayoutProvider] = customProvider(reducer, {
    info : true,
    warnings : true,
    propertyDetails : true,
    selectionsSidebar : true,
    creationSidebar : false,
    queries : false,
    optionsType : 'target',
    startPoint : {type : 'targets', id : 0}
}, 'LayoutContext')

export {LayoutContext, LayoutProvider}