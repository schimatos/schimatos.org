import {dictSwitch} from './utils'
import XRegExp from 'xregexp'

export const convert = string => {
    const extract = {
        'uri' : `^<(?<value> [^]*)>$`,
        'typed-literal' : `^'(?<value> [^]*)'\\^\\^(?<datatype> [^]*)$`,
        'literal' : `^'(?<value> [^]*)'(@(?<lang> [^]*))?$`,
        DEFAULT : `^(?<value> [^]*)$`
    }
    const [type, {datatype, value, lang}] = Object.entries(extract).map(([t, x]) => [t, XRegExp.exec(string, XRegExp(x, 'x'))]).find(([,x]) => x) || [,{}]
    return {type, datatype, value, 'xml:lang' : lang}
}

export const reconstruct = ({type, datatype, value, 'xml:lang' : lang}) => {
    const toReturn = dictSwitch({
        'uri' : `<${value}>`,
        'typed-literal' : `'${value}'^^${datatype || 'xsd:string'}`,
        'literal' : `'${value}'` + lang ? `@${lang}` : '',
        DEFAULT : value
    })(type)
    return toReturn
}