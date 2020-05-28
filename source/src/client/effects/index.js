import {useContext} from 'react'

import {ActiveraulContext, TargetsContext, TriplestoreContext} from '../context'
import useActiveraulHistory from '../custom-hooks/activeraul-history'

import endpointFunc from '../custom-hooks/helper-functions/endpoint'
import Conversions from '../custom-hooks/helper-functions/conversions'

import activeraulEffects from './activeraul-effects'
import targetsEffects from './targets-effects'
import typeEffects from './type-effects'
import validatorEffects from './validator-effects'
import stateEffects from './state-effects'

import apply from './helper-functions/apply-multiple'

export const onFormLoad = () => {
    //console.log('at on form load', useContext(ActiveraulContext))
    apply({effects : [activeraulEffects, targetsEffects, typeEffects, validatorEffects, stateEffects],
        contexts : [useContext(ActiveraulContext), useContext(TargetsContext), useContext(TriplestoreContext)],
        hooks : [['useActiveraulHistory', useActiveraulHistory]],
        props : {endpoint : endpointFunc(), kgraphConversions : Conversions(0)}})
}