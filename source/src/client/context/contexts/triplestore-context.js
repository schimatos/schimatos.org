import customProvider from '../custom-provider'
import reducer from '../reducers/triplestore'

const [TriplestoreContext, TriplestoreProvider] = customProvider(reducer, require('../../../../config.json'), 'TriplestoreContext')
export {TriplestoreContext, TriplestoreProvider}