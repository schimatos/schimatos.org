import _ from 'underscore'

import {nextKey, keepCloning, filterDict, toEntries} from '../../../../utils'

export default ({state, newProperties, id}) => {
    console.log('new properties called', state, newProperties, id)
    // //console.log(state, keepCloning(newProperties), id)


    const addProperties = (state, properties, id_no, idsCreated) => {

        
        console.log('state at start', keepCloning(state), keepCloning(properties))




        const {targets} = state
        const pkey = nextKey(state.properties)
        const plistKey = nextKey(state.propertyList)
        const tkey = nextKey(state.targets)
    
        const newProperty = (parent, idx, children, property) => {
            return ({[idx] : {
                parent,
                children,
                property,
                hidden : false
            }})
        }
    
        const emptyTarg = (index, parent) => {
            return ([index, {
                parent,
                submitted : false,
                shacled : false,
                loading : false,
                children : [],
                value : '',  
                hidden : false  
            }])
        }
        
        const severityMap = severity => {
            switch (severity) {
                case 'Info': return 0;
                case 'Warning': return 1;
                case 'Violation': return 4;
                default: return 3
            }
        }


        const [pList, ps, ts,,npkey,,e] = properties.reduce(([o, ps, ts, key, key1, key2, extraProperties], x) => {
            // //console.log(x, ts, id_no)
            
            const childs = ts[id_no].children
    
            const existing = childs.reduce((total, y) => {
                const ppty = o[ps[y].property]
                const {path, pathType} = ppty
                return (path === x.path && pathType === x.pathType) ? y : total
            }, false)
            

            const min = !isNaN(parseInt(x.minCount))  ? parseInt(x.minCount) : 1
            // console.log('min at thingo', min, x.minCount, parseInt(x.minCount))

            
    
            if (existing !== false) {
                //Dealing with sub properties
                const extras = x.property ? toEntries(keepCloning(x.property)).map(x => [existing, x]) : []
                delete x.property
                // console.log('extras', extras, extraProperties)


                const k = ps[existing].property
                const existingProperty = o[k]
                const {minCount, maxCount, path, pathType, message, severity} = existingProperty
                console.log(minCount, min, existingProperty)
                const newMin = Math.max(min, !isNaN(minCount) ? minCount : 1)
                const newMax = (maxCount && x.maxCount) ? Math.min(maxCount, x.maxCount) : (maxCount ? maxCount : x.maxCount)
                const oldSev = severityMap(severity)
                const newSev = severityMap(x.severity)
                const newSeverity = newSev > oldSev ? x.severity : severity
                const p2 = x.message ? parseInt(x.message.split('%')[0]) : 0
                const p1 = message ? parseInt(message.split('%')[0]) : 0
                const newMessage = (p1 !== NaN && p2 !== NaN) ? (p1 > p2 ? message : x.message) : (p2 !== NaN ? p2 : p1)
                const updatedProperty = {...existingProperty, ...x, minCount : newMin, maxCount : newMax, severity : newSeverity, message : newMessage, path, pathType}
                const childno = ps[existing].children.length
                if (childno < newMin) {
                    const tkeys = _.range(key2, key2 + (newMin - childno))
                    const news = Object.fromEntries(tkeys.map(x => emptyTarg(x, key1)))
                    ps[existing].children = [...ps[existing].children, ...tkeys]
                    return [{...o, [k] : filterDict(updatedProperty, ([k, v]) => v!== undefined)}, ps, {...ts, ...news}, key, key1, key2 + (newMin - childno), [...extraProperties, ...extras]]
                } else if (childno > newMax) {
                    const blankIds = ps[existing].children.filter(x => targets[x].value !== '')
                    const toRemove = (childno-newMax) < blankIds.length ? blankIds.slice(blankIds.length - (childno-newMax)) : blankIds
                    ps[existing].children = ps[existing].children.filter(x => !toRemove.includes(x))
                    ts = filterDict(ts, ([k,]) => !toRemove.includes(k))
                    return [{...o, [k] : filterDict(updatedProperty, ([, v]) => v!== undefined)}, ps, ts, key, key1, key2, [...extraProperties, ...extras]]
                } else {
                    return [{...o, [key] : filterDict(updatedProperty, ([, v]) => v!== undefined)}, ps, ts, key, key1, key2, [...extraProperties, ...extras]]
                }
            } else {
                                    //Dealing with sub properties
                                    const extras = x.property ? toEntries(keepCloning(x.property)).map(x => [key1, x]) : []
                                    delete x.property
                ////console.log('extras', extras, extraProperties)



                const min = !isNaN(parseInt(x.minCount)) ? parseInt(x.minCount) : 1
                const tkeys = _.range(key2, key2 + min)
                const news = Object.fromEntries(tkeys.map(x => emptyTarg(x, key1)))
                ts[id_no].children = [...ts[id_no].children, key1]
                return [{...o, [key] : {...x, minCount : min, ...(x.maxCount ? {maxCount : parseInt(x.maxCount)} : {})}}, {...ps, ...newProperty(id_no, key1, tkeys, key)}, {...ts, ...news}, key + 1, key1 + 1, key2 + min, [...extraProperties, ...extras]]
            }
        }, [keepCloning(state.propertyList), keepCloning(state.properties), keepCloning(state.targets), plistKey, pkey, tkey, []])
        //state.propertyList = pList
        //console.log('plist', pList)
        state.propertyList = pList
        
        // Object.fromEntries(Object.entries(pList).map(([n, x]) => {
        //     //console.log('making property list details' ,n, x)
        //     if (x['path'] === "http://linked.data.gov.au/def/agrif#isAffectedBy") {
        //         //x.datatype = "http://www.w3.org/2001/XMLSchema#anyURI"
        //         return [n, {...x, datatype : "<http://www.w3.org/2001/XMLSchema#anyURI>", type : "anyURI"}]
        //     } else {
        //         return [n, x]
        //     }
        // }))


        state.properties = ps
        state.targets = ts
        // if (state.propertyList[0] && state.propertyList[0].path === "http://linked.data.gov.au/def/agrif#isAffectedBy") {
        //     state.targets[1].value = "http://linked.data.gov.au/dataset/environment/assessment/v0#CreationEventForDoc-1b195dc7f6535d739616cb836a68e0ca"
        //     state.targets[1].submitted = true
        // }
        const ids = _.range(pkey,npkey)
        ////console.log(state.targets, id, ids)
        //state.targets[id].children = [...state.targets[id].children, ...ids]

        // Double check this
        // Most likely will need to do it for *all*
        //console.log(e)
        ////console.log('state at end', keepCloning(state))
        const outSide = keepCloning(e.reduce(([t, newIds], [propId, property]) => {
            //console.log('inside extra propertyy reducer', t, propId, property)
            const childNo = t.properties[propId].children[0]
            // t.targets[childNo].children = [...t.targets[childNo].children, childNo]
            const additions = keepCloning(addProperties(keepCloning(t), [property] ,childNo, newIds))
            ////console.log('before addition', [t, newIds])
            ////console.log('after addition', additions)
            //console.log('additions', additions)

            return additions
        }, [keepCloning(state), [...idsCreated, ...ids]]))

        //console.log('after reducer', outSide)
        return outSide

        ////console.log(newIds, ids)

        ////console.log('outside reducer', keepCloning([newState2, [...newIds, ...ids]]))

        //return //keepCloning([newState2, [...newIds, ...ids]])
    }

    const [newState, allIds] = keepCloning(addProperties(state, keepCloning((newProperties[0] && newProperties[0].constraints) || newProperties.constraints || []), id, []))

    console.log(keepCloning(newState), keepCloning(allIds))


    newState.groups = keepCloning({...state.groups, ...newProperties.groups})

   // //console.log('outside', keepCloning(newState), keepCloning(allIds))

   //console.log(newState, keepCloning(newState))

    console.log(keepCloning(newState))
    return {newState : keepCloning(newState), ids : allIds}
}