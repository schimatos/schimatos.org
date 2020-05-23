import {useContext} from 'react'
import {TriplestoreContext} from '../context'

export default () => {
    const [{schema_prefixes},dispatch] = useContext(TriplestoreContext)
    const prefixes = Object.values(schema_prefixes)
    const keys = Object.keys(schema_prefixes)

    const reg = new RegExp('[^]+[/#]')
    const extractor = iri => reg.exec(iri)[0]

    const namer = new RegExp('[^](?<=(:\/\/[A-Z]+\/[A-Z]))[A-Z]+', 'i')

    const pr = (knownPrefixes, prefix) => {
        const nameString = namer.exec(prefix)[0]
        const options = _.range(1, 4).map(x => nameString.slice(0,x))
        const option = options.reduce((t, x) => {
            return t ? t : (knownPrefixes.includes(x) ? false : x)
        }, false)
        return option || randomOption(knownPrefixes)
    }

    const randomOption = knownPrefixes => {
        const letterString = 'abcdefghijklmnopqrstuvwxyz'.split('')
        const f = (currentBases) => {
            const newBases = currentBases.reduce((t, x) => [...t, ...letterString.map(y => x + y)],[])
            return newBases.find(x => !knownPrefixes.includes(x)) || f(newBases)
        }

    }

    return iris => {
        
        const newPrefixes = iris.reduce((t, x) => {
            const existingPrefixes = [...prefixes, ...t]
            const prefix = extractor(x)
            return existingPrefixes.includes(prefix) ? t : [...t, prefix]
        }, [])

        const toAdd = newPrefixes.reduce((t, x) => {
            const taken = [...keys, ...t.map(x => x[0])]
            return [...t, [pr(taken, x), x]]
        })

        dispatch({type : 'ADD_PREFIXES', prefixes : Object.entries(toAdd)})
    }
}