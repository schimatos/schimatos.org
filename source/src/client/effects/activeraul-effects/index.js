import loadTypes from './load-types'
import fetchData from './fetch-data'

export default ({ActiveraulContext : [state,]}) => [[loadTypes, fetchData], [state, 'targets']]