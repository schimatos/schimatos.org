const _ = require('underscore')
const Crypto = require('Crypto-js')
const React = require('react')

export const contentReduce = list => list.reduce((t, x) => <>{t}{x}</>, <></>)

export const strip = (str, toStrip) => str.replace(toStrip,'')

export const stripMany = (str, arr) => arr.reduce(strip, str)

export const notIn = (list, element) => {
    return !list.includes(element)
}

export const notInMany = (lists, element) => {
    const list = lists.pop()
    return notIn(list) && (lists.length > 0 ? notInMany(lists, element) : true)
}

export const dictsMerge = dicts => {
    return dicts.reduce((total, dict) => {
        return Object.entries(dict).reduce((t, [k, v]) => {
            t[k] = {...t[k], ...v}
            return t
        }, total)
    }, {})
}

export const stringifyDict = dict => `${Object.entries(dict).map(([k,v]) => `${[k,v]}`)}`

export const deepIncludes = (list, element) => list.map(x => stringifyDict(x)).includes(stringifyDict(element))

export const deepNotIn = (list, element) => !deepIncludes(list, element)

export const deepNotInMany = (lists, element) => {
    const list = lists.pop()
    return deepNotIn(list, element) && (lists.length > 0 ? deepNotInMany(lists, element) : true)
}

export const deepEquals = (e1, e2) => stringifyDict(e1) === stringifyDict(e2)

export const sortDictsByKey = (dicts, key) => {
    const compare = (d1, d2) => d1[key] === d2[key] ? 0 : (d1[key] > d2[key] ? 1 : -1)
    return dicts.sort(compare)
}

export const sortDictsByKeyNumericCompare = (dicts, key) => {
    const splitter = value => {
        const match = value.match(/\d+$/)
        const istring = match !== null ? match[0] : ''
        const i = parseInt(istring, 10)
        const str = value.slice(0, -(value.length - istring.length + 1))
        return [str, i]
    }

    const compare = (d1, d2) => {
        const [[str1, i1], [str2, i2]] = [splitter(d1[key]), splitter(d2[key])]
        return str1 === str2 ? (i1 === i2 ? 0 : (i1 > i2 ? 1 : -1)) : (str1 > str2 ? 1 : -1)
    }
    
    return dicts.sort(compare)
}

export const dictMap = (dict, map) => Object.fromEntries(Object.entries(dict).map(map))

export const dictValuesMap = (dict, f) => dictMap(dict, ([k, v]) => [k, f(v)])

export const dictKeysMap = (dict, f) => dictMap(dict, ([k, v]) => [f(k), v])

export const setMinus = (a1, a2) => a1.filter(x => !a2.includes(x))

export const removeDuplicates = a => a.reduce((total, x) => total.includes(x) ? total : [...total, x], [])

export const arraysUnion = arrays => removeDuplicates(arrays.reduce((total, a) => [...total, ...a]), [])

export const zipArrays = (a1, a2) => a1.map((e, i) => [e, a2[i]])

export const arrays2Dict = (a1, a2) => Object.fromEntries(zipArrays(a1, a2))

export const array2Dict = a => Object.fromEntries(a.map((x, i) => [i, x]))

export const filterDict = (dict, f) =>  Object.fromEntries(Object.entries(dict).filter(f))

export const filterKeyDict = (dict, f) =>  filterDict(dict, ([k, v]) => f(k))

export const filterValDict = (dict, f) =>  filterDict(dict, ([k, v]) => f(v))

export const keyDelDict = (dict, key) => filterKeyDict(dict, k => k!=key)

export const keysDelDict = (keys, dict) => filterDict(dict, ([k, v]) => !keys.includes(k))

export const arrayDelElt = (arr, elt) => arr.filter(x => x!==elt)

export const fromCamel = string => string.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })

export const camelToSnake = string => string.replace(/([A-Z])/g, '-$1').toLowerCase()

export const toCamel = (s) => {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  };

export const toCamelSentence = (s) => {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', ' ')
        .replace('_', ' ');
    });
  };

export const toSentence = s => s[0].toUpperCase() + toCamelSentence(s.slice(1))

export const capitalize = s => s[0].toUpperCase() + s.slice(1).toLowerCase()

export const fToCamel = (s, ext) => toCamel(s.replace(ext, ''))

export const nextKey = dict => {
    const keysInt = Object.keys(dict).map(x => parseInt(x))
    return Math.max(...keysInt, -1) + 1
}

export const nCopies = (no, item) => _.range(0, no).map(x => item)

export const objectInDict = (dict, object) => {
    const v1 = Object.entries(object).sort()

    return Object.values(dict).reduce((total, d) => {
        const v2 = Object.entries(d).sort()
        return total || deepEquals(v1, v2)}, false)
}

export const getObjectIndex = (dict, object) => {
    const v1 = Object.entries(object).sort()

    return Object.entries(dict).reduce((index, [d, i]) => {
        if (index) {
            return index
        } else {
            const v2 = Object.entries(d).sort()
            return deepEquals(v1, v2) ? i : undefined
        }
    }, undefined)    
}

export const optionsFromArray = array => array.map(x => typeof(x) === 'object' ? x : ({key : x, text : x, value : x}))

export const hasDuplicates = array => (new Set(array).size) !== array.length;

export const removeIndex = (array, i) => array.splice(i, 1)

export const keepCloning = (objectpassed) => {
    if (objectpassed === null || typeof objectpassed !== 'object') {
       return objectpassed;
    }
  // give temporary-storage the original obj's constructor
  var t = objectpassed.constructor(); 
    for (var key in objectpassed) {
      t[key] = keepCloning(objectpassed[key]);
    }
    return t;
  }

// https://stackoverflow.com/questions/38304401/javascript-check-if-dictionary
export const isDict = v => typeof v==='object' && v!==null && !(v instanceof Array) && !(v instanceof Date)

export const displayAs = (graph, option) => {
    const pref = shacl_graphs[graph].prefix
    return strip(option, pref)
}

export const advList = (always, advanced, isAdvanced) => {
    return [...always, ...(isAdvanced ? advanced : [])]
}

export const toEntries = x => Array.isArray(x) ? x : (x != null ? [x] : [])

export const hash = dict => Crypto.SHA256(JSON.stringify(dict)).words

export const intHash = dict => hash(dict)[0]

export const eqHash = (ob1, ob2) => intHash(ob1) === intHash(ob2)

export const extendDict = (d1, d2) => Object({...(d1 ? d1 : {}), ...(d2 ? d2 : {})})

export const extendUnduplicatedArray = (d1, d2) => removeDuplicates(extendArray(d1, d2))

export const extendArray = (d1, d2) => [...(d1 ? d1 : []), ...(d2 ? d2 : [])]

export const hyperlink = link => <a href={link} target='_blank'>{link}</a>

export const makeRegexp = (expression) => {
    const parts = expression.split('/');
    const pattern = parts.slice(1, parts.length - 1).reduce((t, x) => t + x, '');
    const flags = parts[parts.length - 1];
    return new RegExp(pattern, flags);
};
export const testRegexp = (expression, test) => {
    const re = makeRegexp(expression);
    return re.test(test);
};

export const testDictRegexp = (exp, test) => {
    makeDictRegexp(exp).test(test)
}

export const stringDictRegexp = (exp) => {
    return exp ? makeDictRegexp(exp).toString() : ''
}

export const makeDictRegexp = ({pattern, flags}) => new RegExp(pattern, flags)

export const stringRegexp = (pattern, flags) => {
    const p = new Regexp(pattern, flags)
    return p.toString()
}

export const validRegexp = (expression, flags) => {
    try {
        const re = new Regexp(expression, flags)
        return true
    } catch (e) {
        return e
    }
}

export const callAll = (funcs, props) => funcs.forEach(f => f(props))

export const callMap = (f, props) => f.map(f => f(props))

export const intersection = (arr1, arr2) => arr1.filter(x => arr2.includes(x))

export const arrayToSentence = array => array ? array.slice(1).reduce((t, x) => t + ',' + x, array[0]) : ''

export const stringToBool = string => string === 'true'

export const valuesMatch = (dict, condition, sortFunc) => {
    const entries = Object.entries(dict)
    const compare = ([k1, v1], [k2, v2]) => sortFunc(v1) > sortFunc(v2) ? 1 : -1
    const res = (sortFunc ? entries.sort(compare) : entries).find(([k, v]) => {
        return condition(v)
    })
    return res || [undefined, undefined]
}

export const startMatch = (base, toMatch) => toMatch.slice(0, base.length) === base

export const escapeRegExp = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\\\$&')

export const dictSwitch = dict => sw => ({'DEFAULT' : x => x, ...dict})[Object.keys(dict).includes(sw) ? sw : 'DEFAULT']

export const makeReducer = dict => (state, action) => dictSwitch({'DEFAULT' : (s, a) => s, ...dict})(action.type)(state, action)