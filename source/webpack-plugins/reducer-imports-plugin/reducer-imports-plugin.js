// https://github.com/codemeasandwich/redux-auto/blob/master/index.js


const toCamel = (s) => {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  };

const toUpper = (s) => s.replace('-', '_').toUpperCase()

const fToUpper = (s, ext) => {
    return toUpper(s.replace(ext, ''))
}

const fToCamel = (s, ext) => {
    return toCamel(s.replace(ext, ''))
}

const stringifyDict = dict => `${Object.entries(dict).map(([k,v]) => `${[k,v]}`)}`
// https://www.geeksforgeeks.org/how-to-make-first-letter-of-a-string-uppercase-in-javascript/
const capitalizeFLetter = string => {
    return string[0].toUpperCase() + string.slice(1)
}

class ReducerImportsPlugin {
    apply(compiler) {

    }
}
// compiler.hooks.normalModuleFactory.tap("entry-option", (params, callback) => {
//     params.hooks.module.tap('x', (m, data) => {
//         //console.log(m)
//     })
//     //console.log(params.hooks)
//     //console.log(params.hooks.createModule)
// })

// ns = readType('.json').reduce((ns, file) => {
//     const name = fToCamel(file, '.json')
//     const Context = createContext([{}, () => {}])
//     const Provider = props => {
//         const reducers = readType('.js').reduce((reducers, file2) => {
//                 reducers[fToUpper(file2, '.js')] = require(path.join(reducerFiles, file2))
//                 return reducers
//             }, {})
//         return (
//             <Context.Provider
//             value={useReducer(reducers[action.type](state, action), require(path.join('./', file)))}>
//                 {props.children}
//             </Context.Provider>                
//         )}
//     ns[name+'Context'] = Context
//     ns[name+'Provider'] = Provider
//     module.export[name+'Context'] = Context
//     module.export[name+'Provider'] = Provider
//     //ns[name+'Context', name+'Provider'] = [Context, Provider]
//     return ns
// }, {})

const path = require('path')
const {createPlugin} = require('docz-core')
//import {createPlugin} from 'docz-core'

// const ReducerImportsPlugin = () => createPlugin({
//     modifyFiles : (files, args) => {
//         //console.log(files)
//         return files
//     }
// })

// class ReducerImportsPlugin {
//     apply(compiler) {
//         compiler.plugin("entry-option", (context, entry) => {
//             const itemToPlugin = (item, name) => {
//                 if (Array.isArray(item)) {
//                     return new MultiEntryPlugin(context, item, name)
//                 } else {
//                     return new SingleEntryPlugin(context, item, name)
//                 }
//             }
//         })



        // createPlugin({
        //     modifyFiles : (files, args) => {
        //         //console.log(files)
        //         return files
        //     }
        // })
//     }
// }

// class ReducerImportsPlugin {
//     apply(compiler) {
//         compiler.hooks.thisCompilation.tap('ReducerImportsPlugin', compilation => {

//             compilation.mainTemplate.hooks.renderManifest.tap('ReducerImportsPlugin', (result, {chunk}) => {
                
//                 const renderedModules = Array.from(chunk.modulesIterable)
                
//                 const reducers = renderedModules.reduce((r, m) => {
//                     const name = m.resource ? m.resource : ''
//                     if (name.includes('\\context\\reducers\\')) {
//                         const [p, sbpth] = name.split('\\context\\reducers\\')
//                         const parts = sbpth.split('\\')
//                         if (parts.length === 2) {
//                             const [reducer, fname] = parts
//                             const functions = (r[p] && r[p][reducer]) ? [...r[p][reducer], fname.replace('.js', '')] : [fname.replace('.js','')]
//                             const pth = r[p] ? {...r[p], [reducer] : [...functions]} : {[reducer] : [...functions]}
//                             return {...r, [p] : pth}
//                         }
//                     }
//                     // } else if (name.includes('\\context\\contexts\\')) {
//                     //     const fname = name.split('\\context\\contexts\\')
//                     //     //console.log(m)
//                     //     return [r, {...c, [fname] : [fname]}]
//                     // }
//                     return r
//                 }, Object({}))

//                 const newFiles = Object.entries(reducers).reduce((total, [p, reducers]) => {
//                     if (Object.keys(reducers).length > 0) {
//                         const fileName = path.join(p, 'context', 'index.js')
//                         const fileContents = Object.entries(reducers).reduce((t, [reducer, functions]) => {
//                             const reducerName = capitalizeFLetter(reducer)
//                             const imports = functions.reduce((t, n) => `${t}import ${n} from './reducers/${reducer}/${n}'\n`, ``)
//                             const dict = `{${functions.reduce((t, f) => `${t}, ${"'"+fToUpper(f.toString())+"'"} : (state, action) => ${f.toString()}(state, action)`, ``).slice(1)}}`
//                             return `${t}
// ${imports}
// export const ${reducerName}Context = createContext([{}, () => {}])
// export const ${reducerName}Provider = props => (
//         <${reducerName}Context.Provider
//             value={useReducer((state, action) => (${dict})[action.type](state, action), require('./contexts/${reducer}.json'))}>
//             {props.children}
//         </${reducerName}Context.Provider>                
//     )
// }`}, ``)
//                             return [...total , [fileName, fileContents]]
//                     }
//                     return total
//                     }, [])

//                 //console.log('newFiles', newFiles)
//                 //console.log(compilation.hooks)
//                 // newFiles.forEach(([contents, name]) => {
//                 //     compiler.plugin("entry-option", (context, entry) => {
//                 //         const itemToPlugin = (item, name) => {
//                 //             if (Array.isArray(item)) {
//                 //                 return new MultiEntryPlugin(context, item, name)
//                 //             } else {
//                 //                 return new SingleEntryPlugin(context, item, name)
//                 //             }
//                 //         }
//                 //     })
            
                    
//                     compilation.hooks.addEntry(contents, name))



//                 // }
//                 //     import {toCamel, toUpper, fToUpper, fToCamel}
//                 //     readType('.json').reduce((ns, file) => {
//                 //         const name = fToCamel(file, '.json')
//                 //         const Context = createContext([{}, () => {}])
//                 //         const Provider = props => {
//                 //             const reducers = readType('.js').reduce((reducers, file2) => {
//                 //                     reducers[fToUpper(file2, '.js')] = require(path.join(reducerFiles, file2))
//                 //                     return reducers
//                 //                 }, {})
//                 //             return (
//                 //                 <Context.Provider
//                 //                 value={useReducer(reducers[action.type](state, action), require(path.join('./', file)))}>
//                 //                     {props.children}
//                 //                 </Context.Provider>                
//                 //             )}
//                 //         ns[name+'Context'] = Context
//                 //         ns[name+'Provider'] = Provider
//                 //         module.export[name+'Context'] = Context
//                 //         module.export[name+'Provider'] = Provider
//                 //         //ns[name+'Context', name+'Provider'] = [Context, Provider]
//                 //         return ns
//                 //     }, {})



//                 // )

//                 // //console.log(reducers)





//             })
//         })
//             //     ////console.log(params))
//         // compiler.hooks.beforeCompile.tapAsync('ReducerImportsPlugin', (params, callback) => {
//         //     ////console.log(params)
//         //     Object.entries(params).forEach(//console.log)
//         //     //console.log(params.normalModuleFactory)

//         // })
//         // compiler.hooks.contextModuleFactory.tap('ReducerImportsPlugin', params => {
//             ////console.log(params)
//             // //console.log(params.hooks.contextModuleFiles)
//             //Object.entries(params).forEach(//console.log)
//         //})
//         // compiler.hooks.contextModuleFiles.tapWaterfall('ReducerImportsPlugin', params => {
//         //     //console.log(params)
//         // })
//         // compiler.hooks.buildModule.tap('ReducerImportsPlugin', m => {
//         //     //console.log(m)
//         // })
//     }
// };

module.exports = ReducerImportsPlugin;

// const fs = require('fs-extra')

// const readType = str => fs.readdirSync('./').filter(f => f.includes(str))

// const toCamel = (s) => {
//     return s.replace(/([-_][a-z])/ig, ($1) => {
//       return $1.toUpperCase()
//         .replace('-', '')
//         .replace('_', '');
//     });
//   };

// const toUpper = (s) => s.replace('-', '_').toUpperCase()

// const fToUpper = (s, ext) => {
//     return toUpper(s.replace(ext, ''))
// }

// const fToCamel = (s, ext) => {
//     return toCamel(s.replace(ext, ''))
// }


// ns = readType('.json').reduce((ns, file) => {
//     const name = fToCamel(file, '.json')
//     const Context = createContext([{}, () => {}])
//     const Provider = props => {
//         const reducers = readType('.js').reduce((reducers, file2) => {
//                 reducers[fToUpper(file2, '.js')] = require(path.join(reducerFiles, file2))
//                 return reducers
//             }, {})
//         return (
//             <Context.Provider
//             value={useReducer(reducers[action.type](state, action), require(path.join('./', file)))}>
//                 {props.children}
//             </Context.Provider>                
//         )}
//     ns[name+'Context'] = Context
//     ns[name+'Provider'] = Provider
//     module.export[name+'Context'] = Context
//     module.export[name+'Provider'] = Provider
//     //ns[name+'Context', name+'Provider'] = [Context, Provider]
//     return ns
// }, {})
