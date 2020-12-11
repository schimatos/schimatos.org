import React, {useState} from 'react'
import { Button, Icon, Input, Segment, Select, Dropdown } from 'semantic-ui-react'
import { dictSwitch, flipVal, isArray, optionsTextMap, dfltDict } from '../../utils'

const getPath = ({path : [pT, ...path], value=_.isArray(pT)?pT[0]:0}) => dictSwitch({
    'or' : x => x[value],
    'inv' : x => x.reverse().map(y => _.isString(y) ? ['inv', [y]] : (y[0] == 'inv' ? ['path', y[1]] : [y[0], ['inv', [y]]])),
    'default' : Array(value).fill
})(pT)(path).reduce((t, x) => _.isString(x) ? [...t, pT == 'inv' ? [x] : x] : [...t, ...getPath(x)], [])

const pathAsText = p => getPath(p).reduce((t, x, i) => t + (i > 0 ? '/' : '') + (isArray(x) ? '^' : '') + x, '')

const get = x => (_.isString(x) || _.isUndefined(x)) ? x : dictSwitch({
    or : t => ({
        value : 2,
        options : t.map(get),
        get current () {return this.options[this.value]},
        get lastPath () {
            // console.log(this.current)
            //return this.current
            return _.isString(this.current) ? this.current : this.current.lastPath
        },
        get nextPath () {return this.lastPath},
        // update : () => {
        //     console.log(this)
        //     this.value = _.isString(this.value) ? this.value : this.value.update()
        // }
    }),
    inv : t => ({
        inverse : true,
        value : get(t),
        get current () {return this.value},
        get lastPath () {
            return this.value && {path : this.value.path, inverse : !this.value.inverse}
        },
        get nextPath () {
            return this.value && {path : this.value.path, inverse : !this.path.inverse}
        },
        // update : () => {
        //     this.value = _.isString(this.value) ? this.value : this.value.update()
        // }
    }),
    default : t => {
        const s = _.tail(t).reduce((tt, v) => [...tt, {hist : []}, get(v)], get(t[0]))
        // console.log(t.length, t, _.range(0, t.length))
        return {
        range : x[0],
        link : [],
        section : _.cloneDeep(s),
        ...dfltDict(_.range(t.length), []),
        value : _.range(x[0][0]-1).reduce(tt => [...tt, {hist : [], link : undefined, prev : {path : undefined, inverse : false}, next : {path : undefined, inverse : false}}, _.cloneDeep(s)], [_.cloneDeep(s)]),
        get current () {return this.value},
        get lastPath () {
            //return _.findLast(this.value, (x, i) => i +1 % 2)
            const l = _.findLast(this.value, (x, i) => i+1 % 2 && _.some(x, (y, ii) => ii + 1 % 2 && (_.isString(y) ? y : y.lastPath)))
            const ls = _.findLast(l, (y, ii) => ii+1 % 2 && (_.isString(y) ? y : y.lastPath))
            return ls && (_.isString(ls) ? {path : ls, inverse :false} : ls.lastPath)
        },
        get nextPath () {
            const l = _.find(this.value, (x, i) => i + 1 % 2 && _.some(x, (y, ii) => ii + 1 % 2 && (_.isString(y) ? y : y.lastPath)))
            const ls = _.find(l, (y, ii) => ii +1 % 2 && (_.isString(y) ? y : y.lastPath))
            return ls && (_.isString(ls) ? {path : ls, inverse :false} : ls.lastPath)
        },
        add : (index, right) => {
            const i = index*2 + right 
            this.value = _.concat(this.value.slice(0,i), right ? [{hist : [], link : undefined, prev : {path : undefined, inverse : false}, next : {path : undefined, inverse : false}},_.cloneDeep(this.s)] : [_.cloneDeep(this.s), {hist : [], link : undefined, prev : {path : undefined, inverse : false}, next : {path : undefined, inverse : false}}],this.slice(i))
        },
        // remove : (index, right) => {
        //     const i =  index*2 + right 
        //     this.value = _.concat(this.value.slice(0, i-1), this.value.slice(i+1))
        // },
        // change : (index) => {

        // },
        // update : () => {
        //     this.value.forEach((x,i) => {
        //         if (i%2) {
        //             const la1 = _.findLast(this.value[i-1]||[], y => _.isString(y) || y?.lastPath)
        //             const n1 = _.find(this.value[i+1]||[], y=> _.isString(y) || y?.nextPath) // keep searching right
        //             this.value[i].prev = _.isString(la1) ? la1 : la1?.lastPath
        //             this.value[i].next = _.isString(n1) ? n1 : n1?.lastPat
        //         } else {
        //             this.value = _.isString(this.value) ? this.value : this.value.update()
        //         }
        //     })
        // }
    }}
})(x[0])(_.tail(x))

//x.updateIRIs(store)

//const or = x => 
    // ['or', 'a', [[0, 1], 'p', 'q', ['inv', 's']], 'b', 'c']
    // const x = {
    //     value : 0,
    //     1 : {
    //         link : [
    //             ['s', 'p', 'v']
    //         ],
    //         range : [0, 1],
    //         value : [[p, {value : 'iri', hist : [['p', 'q', 'iri']]}, q,{}, ['inv','s']],{},[{},{}],{},[{},{}]]
    //     }
    // }

const AddComponent = () => <Button icon='plus'/>

const RemComponent = () => <Button icon='-'/>

const BranchOut = () => '  bout  '
const D = ({value}) => value, DI = ({left, right}) => '(  l  '+left+'  r  '+right+' )'

// const DI = ({left, right, link, value, currentPath}) => {
//     const l = _.isArray(left) ? store.each(undefined, left[0], undefined).map(x => x.object.uri) : store.each(undefined, left, undefined).map(x => x.subject.uri)
//     const r = _.isArray(right) ? store.each(undefined, right[0], undefined).map(x => x.subject.uri) : store.each(undefined, right, undefined).map(x => x.object.uri)
    
//     const entitiesAlongPath = currentPath.reduce((x,i) => {

//     })
    
//     const allowedByPreds = _.intersection(l, r)


//     validatedField({nodeKind : 'IRI', 'in' : allowedByPreds}) // Add coloration to those that do/do not belong to the 'entitiesAlongPath' category

//     const link = 
// }

const getLast = (inv, p) => {
    if (_.isArray(p)) {
        return getLast(_.last(p))
    } else if (_.isObject(p)) {
        return v.current
    }
}

// Left keep searching right. If immediate left has no IRI then

export default ({path : p, value:va=get(p), onChange:c, name:n}) => {


    const [val, setVal] = useState(va)

    const isStatic = ([pT, ...pa]) => (_.isArray(pT) ? pT[0] == pT[1] : pT!='or') && pa.every(_.overSome([_.isString, isStatic]))

    //console.log(val)

    const ch = ([l, ...list], change, vs) => {
        if (!l) {
            return change(vs)
        }
        // console.log([l, ...list], change, vs)
        const cchange = a => list.length > 0 ? ch(list, change, a) : change(a)
        if (_.isArray(l)) {
            const [i,j] = l
            return {...vs, value : _.concat(vs.value.slice(0, i),_.concat(vs.value[i].slice(0,j), cchange(vs.value[i][j]), vs.value[i].slice(j+1)),_.concat(vs.value.slice(i+1)))}
        } else {
            return {...vs, options : _.concat(vs.options.slice(0,l),cchange(vs.options[l]), vs.options.slice(l+1))}
        }


        // return {...vs, [_.isArray(l) ? 'value' : 'options'] : (_.isArray(l) ? {} : {})
        
        
        
        
        // (list.length > 0 ? ch(list, ) : 
    }

    const cha = (l, change) => setVal(ch(l, change, val))

    const add = (index, right) => ({value, ...r}) => {
        const i = index + right 
        // console.log('adding', value, value.slice(0,i), value.slice(i), right ? [{hist : [], link : undefined, prev : {path : undefined, inverse : false}, next : {path : undefined, inverse : false}},_.cloneDeep(r.section)] : [_.cloneDeep(r.section), {hist : [], link : undefined, prev : {path : undefined, inverse : false}, next : {path : undefined, inverse : false}}])
        return {value : _.concat(value.slice(0,i), right ? [{hist : [], link : undefined, prev : {path : undefined, inverse : false}, next : {path : undefined, inverse : false}},_.cloneDeep(r.section)] : [_.cloneDeep(r.section), {hist : [], link : undefined, prev : {path : undefined, inverse : false}, next : {path : undefined, inverse : false}}],value.slice(i)), ...r}
    }

    const remove = (index, right) => ({value, ...r}) => {
        const i =  index + right 
        return {value : _.concat(value.slice(0, i-1), value.slice(i+1)), ...r}
    }

    const addl = (l, index, right) => cha(l, add(index, right))
    const reml = (l, index, right) => cha(l, remove(index, right))
    // const setIRI = (l, iri) => cha(l, value => {

    // })

    // const [val, setVal] = useState(v)
    
    const PathSection = (locList, v) => {
        // console.log('path section called', locList, v)
        if (_.isArray(v)) {
            return <Input><Icon {...{name : 'pointing up'}}/>{v[0]}</Input>
        } else if (_.isNumber(v.value)) {
            // console.log(v,v.options)
            const o = optionsTextMap(v.options, (x, i) => <Input>{PathSection([...locList, i], x)}</Input>)
            return <Select {...{options:o, text : o[v.value].text, style : {width : '100%'}, onChange : (e, {value}) => {
                cha(locList, r => ({...r, value}))}}}/>
        } else if (_.isString(v)) {
            return <D value={v}/>
        } else {
            const {range : [min, max], section, value, link} = v
            const repeats = (value.length + 1) / 2
            const allowAdd = repeats < max, allowRem = repeats > min
            // const add = (index, right) => {
            //     const i = index*2 + right 
            //     v.value = _.concat(value.slice(0,i), right ? [{hist : [], link : undefined, prev : {path : undefined, inverse : false}, next : {path : undefined, inverse : false}},_.cloneDeep(section)] : [_.cloneDeep(section), {hist : [], link : undefined, prev : {path : undefined, inverse : false}, next : {path : undefined, inverse : false}}],value.slice(i))
            // }
            // const remove = (index, right) => {
            //     const i =  index*2 + right 
            //     v.value = _.concat(value.slice(0, i-1), value.slice(i+1))
            // }
            return value.map((x,i) => {
                // console.log(x, i, ((i+1) % 2 ==0) ?'irr':'sec', (i+1) %2)
                const la1 = _.findLast(value[i-1]||[], y => _.isString(y) || y?.lastPath)
                const n1 = _.find(value[i+1]||[], y=> _.isString(y) || y?.nextPath) // keep searching right
                const la = _.isString(la1) ? la1 : la1?.lastPath
                const n = _.isString(n1) ? n1 : n1?.lastPath
                // console.log(x, value[i-1], _.findLast(value[i-1]||[], y => y?.lastPath), value[i+1])
                // console.log('loclist', locList)
                return ( i % 2) ? <DI left={la} right={n} link={link} value={x} onChange={updated => cha(locList, i, updated)}/> : [allowAdd && <Button icon='plus' onClick={() => addl(locList, i, false)}/>, allowRem && i>0 && <Button icon='minus' onClick={() => reml(locList, i, false)}/>, x?.map((y, ii) => ii % 2 ? <DI left={x[ii-1] && _.isString(x[ii-1]) ? x[ii-1] : x[ii-1].lastPath} right={x[ii+1] && _.isString(x[ii+1]) ? x[ii+1] : x[ii+1].nextPath} link={link} value={x}/> : PathSection([...locList, i, ii], y)), allowRem && i+1<value.length && <Button icon='minus' onClick={() => reml(locList, i, true)}/>, allowAdd && <Button icon='plus' onClick={() => addl(locList, i, true)}/>]
            })
        }
    }
    // console.log([], va)
    return PathSection([], val)
}
//     const PathSection = (locList, [pT, ...paths], {value=_.isArray(pT)?pT[0]:0, ...r}={}) => {
//         const [min, max]=pT, key=_.toString(locList), onClick = e => e.stopPropogation(),
//         onChange = (l, {value:n=l}) => _.isUndefined(n) || c([...locList, n].reduce(([obj, l], v) => [_.set(obj, [...l, 'value'], v), [...l, v]], [value, []])[0]),
//         s=paths.map((x, i) => _.isString(x) ? <D value={x}/> : PathSection([...locList, i], x, r[i])),
//         children=pT!='or'?<Input key={key}>{s}</Input>:optionsTextMap(s, x => <Input>{x}</Input>)   
//         console.log(children, children[value].text)   

//         return dictSwitch({
//             'or' : () => <Select {...{options:children, text : children[value].text, onChange}}/>,
//             'inv' : () => <Input><Icon {...{key, name : 'pointing up'}}/>{children}</Input>,
//             'default' : () => {
//                 min < max
//             }
//         return 




//         value.reduce((t,v,i) => {
//             const val = v.each(left,)
            
//             v[left][right] || _.intersection(_.values(v[left]), storedGraph.each()
//             return i%2==0 ? PathSection(locList) : <DI onChange={} />
//         })
//         const num = 
//         if (num > min) {
//             include  +'s'
//         }
//         if (num < max) {

//         }
//         return pT == 'or' ? 


//         return dictSwitch({
//             'or' : () => <Select {...{options:children, text : children[value].text, onChange}}/>,
//             'inv' : () => <Input><Icon {...{key, name : 'pointing up'}}/>{children}</Input>,
//             'default' : () => {alpha.reduce((t, x, i) => {
//                 return i + 1 < alpha.length ? [...t, x, <DI left={x} right={alpha[i+1]}/>] : [...t, x]
//             }, [])}
//     }


//     return alpha.reduce((t, x, i) => {
//         return i + 1 < alpha.length ? [...t, x, <DI left={x} right={alpha[i+1]}/>] : [...t, x]
//     }, [])

//     v = {
//         value : 0,
//         3 : [['f'], {
//             ['f','f', IRI1],
//             ['f', 'g', IRI2]
//         }, ['f'], IRI, ['f'],]
//     }


//     value = {
//         value : [[{

//         },IRI,undefined],IRI,[undefined,IRI,undefined]],

//     }


//     const isStatic = ([pT, ...pa]) => (_.isArray(pT) ? pT[0] == pT[1] : pT!='or') && pa.every(_.overSome([_.isString, isStatic]))




//     const D = ({value}) => value, DI = ({left, right}) => '(  l  '+left+'  r  '+right+' )'
//     const alpha = ['or','a', 'b', 'c', [[2,3], 'f']]

//     if (min < max) {
//         add button in int and ext
//     } else if ()

//     const PathSection = (locList, [pT, ...paths], {value=_.isArray(pT)?pT[0]:0, ...r}={}) => {
//         return pT == 'or' ? 


//         return dictSwitch({
//             'or' : () => <Select {...{options:children, text : children[value].text, onChange}}/>,
//             'inv' : () => <Input><Icon {...{key, name : 'pointing up'}}/>{children}</Input>,
//             'default' : () => {alpha.reduce((t, x, i) => {
//                 return i + 1 < alpha.length ? [...t, x, <DI left={x} right={alpha[i+1]}/>] : [...t, x]
//             }, [])}
//     }


//     return alpha.reduce((t, x, i) => {
//         return i + 1 < alpha.length ? [...t, x, <DI left={x} right={alpha[i+1]}/>] : [...t, x]
//     }, [])





//     // const D = ({value}) => value, DI = ({left, right}) => 'l'+left+'r'+right

//     // const PathSection = (locList, [pT, ...paths], {value=_.isArray(pT)?pT[0]:0, ...r}={}) => {
//     //     const [min, max]=pT, key=_.toString(locList), onClick = e => e.stopPropogation(),
//     //     onChange = (l, {value:n=l}) => _.isUndefined(n) || c([...locList, n].reduce(([obj, l], v) => [_.set(obj, [...l, 'value'], v), [...l, v]], [value, []])[0]),
//     //     s=paths.map((x, i) => _.isString(x) ? <D value={x}/> : PathSection([...locList, i], x, r[i])),
//     //     children=pT!='or'?<Input key={key}>{s}</Input>:optionsTextMap(s, x => <Input>{x}</Input>)   
//     //     console.log(children, children[value].text)   
//     //     return dictSwitch({
//     //         'or' : () => <Select {...{options:children, text : children[value].text, onChange}}/>,
//     //         'inv' : () => <Input><Icon {...{key, name : 'pointing up'}}/>{children}</Input>,
//     //         'default' : () => {
//     //             min < max
//     //         }



//     //         '0,1' : () => <Button {...extendDict({key, onClick : () => {onClick(); onChange(flipVal(value, 0, 1))}}, value ? {children} : {name:'step forward'})}/>,
//     //         '1,1' : children,
//     //         'default' : () => <Input key={key}>{children}<Input {...{type:'number',defaultValue:value,min,max, onClick, label : <Input><span>x<sup>{max}</sup><sub>{min}</sub></span></Input>}}/></Input>
//     // })(pT)()}

//     // return <DI left={'http://example.org'}/>
// }


// //     const isStatic = ([pT, ...pa]) => (_.isArray(pT) ? pT[0] == pT[1] : pT!='or') && pa.every(_.overSome([_.isString, isStatic]))
// //     const {configState : {advanced_features : {display_path_instead_of_name:d}}, formDisp : dispatch} = context()
// //     const D = IRIDisplay(), DI = IRIField()
    
// //     const PathSection = (locList, [pT, ...paths], {value=_.isArray(pT)?pT[0]:0, ...r}={}) => {
// //         return <D value={'http://example.org'}/>




// //         // const [min, max]=pT, key=_.toString(locList), onClick = e => e.stopPropogation(),
// //         // onChange = (l, {value:n=l}) => _.isUndefined(n) || c([...locList, n].reduce(([obj, l], v) => [_.set(obj, [...l, 'value'], v), [...l, v]], [value, []])[0]),
// //         // s=paths.map((x, i) => _.isString(x) ? <D value={x}/> : PathSection([...locList, i], x, r[i])),
// //         // children=pT!='or'?<Input key={key}>{s}</Input>:optionsTextMap(s, x => <Input>{x}</Input>)   
// //         // console.log(children, children[value].text)   
// //         // return dictSwitch({
// //         //     'inv' : () => <Input><Icon {...{key, name : 'pointing up'}}/>{children}</Input>,
// //         //     'default' : () => null
// //         // })
// //     }
// // //(!p || (!d && n && isStatic(p))) ? n : 
// //     return PathSection([], p, v)
// // }



// //     //     const [min, max]=pT, key=_.toString(locList), onClick = e => e.stopPropogation(),
// //     //     onChange = (l, {value:n=l}) => _.isUndefined(n) || c([...locList, n].reduce(([obj, l], v) => [_.set(obj, [...l, 'value'], v), [...l, v]], [value, []])[0]),
// //     //     s=paths.map((x, i) => _.isString(x) ? <D value={x}/> : PathSection([...locList, i], x, r[i])),
// //     //     children=pT!='or'?<Input key={key}>{s}</Input>:optionsTextMap(s, x => <Input>{x}</Input>)   
// //     //     console.log(children, children[value].text)   
// //     //     return dictSwitch({
// //     //         'inv' : () => <Input><Icon {...{key, name : 'pointing up'}}/>{children}</Input>,
// //     //         'default' : () => null
// //     //         // 'or' : () => <Dropdown {...{options:children, text : children[value].text, onChange}}/>,
// //     //         // 'inv' : () => <Input><Icon {...{key, name : 'pointing up'}}/>{children}</Input>,
// //     //         // '0,1' : () => <Button {...extendDict({key, onClick : () => {onClick(); onChange(flipVal(value, 0, 1))}}, value ? {children} : {name:'step forward'})}/>,
// //     //         // '1,1' : children,
// //     //         // 'default' : () => <Input key={key}>{children}<Input {...{type:'number',defaultValue:value,min,max, onClick, label : <Input><span>x<sup>{max}</sup><sub>{min}</sub></span></Input>}}/></Input>
// //     // })(pT)()}

// //     // const {configState : {advanced_features : {display_path_instead_of_name:d}}, formDisp : dispatch} = context()
// //     // const D = IRIDisplay()
// //     // if (!p || (!d && name && isStatic(p))){return <Segment children={name}/>}
// //     // const PathSection = (locList, [pT, ...paths], {value=_.isArray(pT)?pT[0]:0, ...r}={}) => {
// //     //     const [min, max]=pT, key=_.toString(locList), onClick = e => e.stopPropogation(),
// //     //     onChange = (l, {value:n=l}) => _.isUndefined(n) || c([...locList, n].reduce(([obj, l], v) => [_.set(obj, [...l, 'value'], v), [...l, v]], [value, []])[0]),
// //     //     s=paths.map((x, i) => _.isString(x) ? <D value={x}/> : PathSection([...locList, i], x, r[i])),
// //     //     children=pT!='or'?<Input key={key}>{s}</Input>:optionsTextMap(s, x => <Input>{x}</Input>)      
// //     //     return dictSwitch({
// //     //         'or' : () => <Select {...{options:children, text : children[value].text, onChange}}/>,
// //     //         'inv' : () => <Input><Icon {...{key, name : 'pointing up'}}/>{children}</Input>,
// //     //         '0,1' : () => <Button {...extendDict({key, onClick : () => {onClick(); onChange(flipVal(value, 0, 1))}}, value ? {children} : {name:'step forward'})}/>,
// //     //         '1,1' : children,
// //     //         'default' : () => <Input key={key}>{children}<Input {...{type:'number',defaultValue:value,min,max, onClick, label : <Input><span>x<sup>{max}</sup><sub>{min}</sub></span></Input>}}/></Input>
// //     // })(pT)()}

// //     // const IRIPathInput = (path, value) => {
// //     //     return null//getPath({path, value})
// //     // }
// //     //     // const [min, max]=pT, key=_.toString(locList), onClick = e => e.stopPropogation(),
// //     //     // onChange = n => _.isUndefined(n) || c([...locList, n].reduce(([obj, l], v) => [_.set(obj, [...l, 'value'], v), [...l, v]], [value, []])[0]),
// //     //     // s=paths.map((x, i) => _.isString(x) ? <IRIDisplay value={x}/> : PathSection([...locList, i], x, r[i])),
// //     //     // children=pT!='or'?<Input key={key}>{s}</Input>:optionsTextMap(s, x => <Input>{x}</Input>)      
// //     //     // return dictSwitch({
// //     //     //     'or' : () => <Select {...{options:children, text : children[value].text, onChange : (_, {value:v}) => onChange(v)}}/>,
// //     //     //     'inv' : () => <Input><Icon {...{key, name : 'pointing up'}}/>{children}</Input>,
// //     //     //     '0,1' : () => <Button {...extendDict({key, onClick : () => {onClick(); onChange(flipVal(value, 0, 1))}}, value ? {children} : {name:'step forward'})}/>,
// //     //     //     '1,1' : children,
// //     //     //     'default' : () => <Input key={key}>{children}<Input {...{type:'number',defaultValue:value,min,max, onClick, label : <Input><span>x<sup>{max}</sup><sub>{min}</sub></span></Input>}}/></Input>
// //     //     //     })(pT)()}        
// //     // return <Input>{PathSection([], p, v)}</Input>