import customProvider from '../custom-provider'
import reducer from '../reducers/targets'

const [TargetsContext, TargetsProvider] = customProvider(reducer, {
    property : {
        [-1] : {
            selected : [],
            options : [],
            loading : false,
            requested : true
        }
    },
    path : {inverse : {}, normal : {}},
    predicate : {},
    node : {},
    subjectsOf : {},
    objectsOf : {},
    class : {},
    groups : {},
    typeConstraints : {
        'xsd:anyURI' : {
            datatype : 'xsd:anySimpleType',
            pattern : "^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?"
        },
        'xsd:language' : {
            pattern : "[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*",
            datatype : "xsd:token"
        },
        'xsd:normalizedString' : {
            processOut : collapse,
            datatype : "xsd:string"
        },
        'xsd:token' : {
            processOut : input => input.replace(/\s+/g, ' '),
            datatype : "xsd:normalizedString"
        },
        'xsd:NAME' : {
            pattern : "\i\c*",
            datatype : "xsd:token"
        },
        'xsd:NCNAME' : {
            pattern : "[\i-[:]][\c-[:]]*",
            datatype : 'xsd:NAME'
        },
        'xsd:NMTOKEN' : {
            datatype : "xsd:token",
            pattern : "\c+"
        },
        'xsd:boolean' : {
            datatype : 'xsd:anySimpleType',
            processIn : input => ['1', 'true'].includes(['\n', '\f', '\r', '\t', '\v', ' '].forEach((t, x) => t.replace(x, ' '), input))
        },
        'xsd:decimal' : {
            datatype : 'xsd:anySimpleType',
            processOut : collapse
        },
        'xsd:double' : {
            datatype : 'xsd:anySimpleType',
            processOut : collapse
        },
        'xsd:float' : {
            datatype : 'xsd:anySimpleType',
            processOut : collapse
        },
        'xsd:date' : {
            datatype : 'xsd:anySimpleType',
            processOut : collapse
        },
        'xsd:time' : {
            datatype : 'xsd:anySimpleType',
            processOut : collapse
        },
        'xsd:dateTime' : {
            datatype : 'xsd:anySimpleType',
            processOut : collapse
        },
        'xsd:dateTimeStamp' : {
            datatype : 'xsd:dateTime'
        },
        'xsd:gDay' : {
            datatype : 'xsd:anySimpleType',
            in : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        'xsd:gMonth' : {
            datatype : 'xsd:anySimpleType',
            in : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        'xsd:gYear' : {
            datatype : 'xsd:anySimpleType'

        },
        'xsd:duration' : {
            datatype : 'xsd:anySimpleType',
            processOut : collapse
        },
        'xsd:yearMonthDuration' : {
            datatype : 'xsd:duration'
        },
        'xsd:dayTimeDuration' : {
            datatype : 'xsd:duration'
        },
        'xsd:byte' : {
            datatype : 'xsd:short',
            minInclusive : -128,
            maxInclusive : 127
        },
        'xsd:short' : {
            datatype : 'xsd:int',
            minInclusive : -32768,
            maxInclusive : 32767
        },
        'xsd:int' : {
            datatype : 'xsd:long',
            minInclusive : -214748364,
            maxInclusive : 214748364
        },
        'xsd:long' : {
            datatype : 'xsd:integer',
            minInclusive : -9223372036854775808,
            maxInclusive : 9223372036854775
        },
        'xsd:integer' : {
            // Ad somthing
            datatype : 'xsd:decimal'
        },
        'xsd:unsignedByte' : {
            datatype : 'xsd:unsignedShort',
            maxInclusive : 255
        },
        'xsd:unsignedShort' : {
            datatype : 'xsd:unsignedInt',
            maxInclusive : 65535
        },
        'xsd:unsignedInt' : {
            datatype : 'xsd:unsignedLong',
            maxInclusive : 4294967295
        },
        'xsd:unsignedLong' : {
            datatype : 'xsd:nonNegativeInteger',
            maxInclusive : 18446744073709551615
        },
        'xsd:nonNegativeInteger' : {
            datatype : 'xsd:integer',
            minInclusive : 0
        },
        'xsd:positiveInteger' : {
            datatype : 'xsd:nonNegativeInteger',
            minInclusive : 1
        },
        'xsd:negativeInteger' : {
            datatype : 'xsd:nonPositiveInteger',
            maxInclusive : -1
        },
        'xsd:nonPositiveInteger' : {
            datatype : 'xsd:integer',
            maxInclusive : 0
        },
        'xsd:hexBinary' : {
            datatype : 'xsd:anySimpleType',
            processOut : collapse
        },
        'xsd:string' : {
            datatype : 'xsd:anySimpleType'
        }
    },
    propertyTypes : {
    },
    validators : ({}) => {},
    renderedValidators : {},
    validatorsMakeNo : 0
}, 'TargetsContext')

const collapse = input => ['\n', '\f', '\r', '\t', '\v'].forEach((t, x) => t.replace(x, ' '), input)

export {TargetsContext, TargetsProvider}