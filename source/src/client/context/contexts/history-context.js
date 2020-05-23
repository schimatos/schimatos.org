import customProvider from '../custom-provider'
import reducer from '../reducers/history'

const [HistoryContext, HistoryProvider] = customProvider(reducer, [[], 1], 'HistoryContext')

export {HistoryContext, HistoryProvider}