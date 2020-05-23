import {useContext} from 'react'
// import {TargetsContext} from '../context'
// import effectTemplate from '../helper-functions/effect-template'

import makeValidators from './make-validators'

export default ({TargetsContext : [{propertyTypes, typeConstraints, property},], ActiveraulContext : [{properties, propertyList, targets},]}) => [[makeValidators], {propertyTypes, typeConstraints, properties, propertyList, property, targets}]