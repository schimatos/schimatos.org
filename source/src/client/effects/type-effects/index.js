import {useContext} from 'react'
// import {TargetsContext} from '../context'
// import effectTemplate from '../helper-functions/effect-template'

import loadTypeConstraints from './load-type-constraints'

export default ({TargetsContext : [{propertyTypes},]}) => [[loadTypeConstraints], propertyTypes]