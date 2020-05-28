import effectsTemplate from './effect-template'
import {extendDict, keyDelDict, keysDelDict} from '../../utils'

export default ({effects, contexts, hooks, props}) => {

    const hookEntries = hooks.map(([name, hook]) => [name, hook()])
    const contextEntries = contexts.map(([state, dispatch]) => [state.name, [state, dispatch]])
    const p = [hookEntries, contextEntries].reduce((t, x) => extendDict(t, Object.fromEntries(x)), props)

    const makeTrigger = trigger => Array.isArray(trigger) ? (
        Array.isArray(trigger[1]) ? keyDelDict(trigger[0], trigger[1]) : keysDelDict(trigger[1], trigger[0])
        ) : trigger

    ////console.log

    return effects.map(effect => {
        const [e, trigger] = effect(p)
        return effectsTemplate(e, makeTrigger(trigger), p)
    })
}