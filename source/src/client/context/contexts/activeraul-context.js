import customProvider from '../custom-provider'
import reducer from '../reducers/activeraul'

const [ActiveraulContext, ActiveraulProvider] = customProvider(reducer, {
    focus : {type : 'targets', id : 0, hold : false},
    targets : {
        0 : {parent : -1,
            value : '',
            submitted : false,
            loading : false,
            shacled : false,
            children : [],
            hidden : false
        }
    },
    properties : { [-1] : {children : [0], property : -1}},
    propertyList : {
        '-1' : {
            path : 'Full Form',
            pathType : 'inversePath',
            severity : 'none',
            nodeKind : 'sh:IRI'
        }
    },
    selections : {

    }
}, 'ActiveraulContext')

export {ActiveraulContext, ActiveraulProvider}


// const [ActiveraulContext, ActiveraulProvider] = customProvider(reducer, {
//     focus : {type : 'targets', id : 0, hold : false},
//     targets : {
//         0 : {parent : -1,
//             value : '',
//             submitted : false,
//             loading : false,
//             shacled : false,
//             children : [],
//             hidden : false}
//     },
//     properties : { [-1] : {children : [0], property : -1}},
//     propertyList : {
//         '-1' : {
//             path : 'Full Form',
//             pathType : 'inversePath',
//             severity : 'none'
//         }
//     },
//     propertyList : {
//         '0' : {
//             path : ['alternativePath', ['sequencePath', ['opt1', 'opt2', ['opt3.1', 'opt3.2', ['zeroOrOnePath', ['opt3.1']], 'opt3.3', 'opt3.4', ['inversePath', ['opt3.5']]]]]],
//             severity : 'none'
//         }
//     },
//     selections : {

//     }
// }, 'ActiveraulContext')

// export {ActiveraulContext, ActiveraulProvider}

// const pathDropdowns = (path, selections, onChange) => {
//     const display = startPoint => {
//         const iterate = (point, path) => {
//             if (point.length === 0) {
//                 return path
//             } else {
//                 const [...remainder, current] = point
//                 return iterate(remainder, path[1][current])
//             }
//         }
//     }

//     const displayAlternative = path => {
//         const displayers = type => ({
//             'alternativePath' : {left : '', separator='|', right : ''},
//             'sequencePath' : {left : '', separator='/', right : ''},
//             'zeroOrOnePath' : {left : '', separator='', right : '*'},
//             'zeroOrMorePath' : {left : '', separator='', right : '?'},
//             'oneOrMorePath' : {left : '', separator='', right : '+'},
//             'inversePath' : {left : '^', separator='', right : ''},
//         })(type)
//         const displayer = ([type, values]) => {
//             const {separator, left, right} = displayers(type)
//             const [start, ...rest] = values.map(x => left + (Array.isArray(x) ? (x.length > 1 ? `(${displayer(x)})` : displayer(x)) : x) + right)
//             return rest.reduce((t, x) => t + separator + x, start)
//         }
//         return typeof(path) === 'string' ? path : displayer(path)
//     }

//     const makeOptions = ([type, alternatives]) => {
//         return ({
//             'alternativePath' : () => alternatives.map((x, i) => ({key : i, text : displayAlternative(x), value : i})),
//             'sequencePath' : {left : '', separator='/', right : ''},
//             'zeroOrOnePath' : {left : '', separator='', right : '*'},
//             'zeroOrMorePath' : {left : '', separator='', right : '?'},
//             'oneOrMorePath' : {left : '', separator='', right : '+'},
//             'inversePath' : {left : '^', separator='', right : ''},            
//         })[type]()
//     }




//     return (
//         <Input>

//         </Input>
//     )
// }
