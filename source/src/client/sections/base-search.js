import React, { useContext, useReducer, useEffect, useRef } from 'react';
import { TriplestoreContext } from '../context';
import { Form, TextArea, Button, Input, Select, Icon, Divider, Segment } from 'semantic-ui-react';
import { optionsFromArray, advList, hash } from '../utils';
import setOptionsDropdown from '../forms/fields/set-options-dropdown';
import undoableSection from '../forms/fields/undoable-section';
import CancelableLoader from '../forms/fields/cancelable-loader';
import triplestoreInterface from '../triplestore-interface';
import IRIField from '../validated-fields/IRI-field'
import { useJourney, JourneyStep } from 'react-journey'


export default ({ content, initialState, reducer, selectVariable, standardQueries, query, responseConversion, optionsFilter, convertionType, opts , disabled, placeholder, name}) => {
    const KField = IRIField('knowledge')
    const SField = IRIField('shacl')
    
    



    
    // fix conversionType spelling
    const [{ advanced_features },] = useContext(TriplestoreContext);
    const triplestore = triplestoreInterface();
    const internalReducer = (oldState, action) => {
        const state = reducer(oldState, action);
        const { searchBy, loading, prevSearch, prevSearchBy, searchText, queryText } = state;
        const { type, value, response, r } = action;
        const legalQueryChange = query => {
            const enforcedQuery = `SELECT DISTINCT ?${selectVariable}\n`;
            const qlength = enforcedQuery.length;
            return query.length >= qlength && query.substring(0, qlength) === enforcedQuery;
        };
        const changeOptions = clear => {
            //console.log('change options', response)
            if (loading && prevSearch === r.search && prevSearchBy === r.searchBy) {
                const oldOptions = clear ? [] : options;
                //console.log('old options', oldOptions)
                const options = responseConversion ? (convertionType === 'reduce' ? (response.reduce((t, opt) => [...t, ...responseConversion(opt)], oldOptions)) : ([...oldOptions, ...response.map(responseConversion)])) : oldOptions;
                //console.log('options', options)
                return { ...state, loading: false, options };
            }
            else {
                return state;
            }
        };
        switch (type) {
            case 'TEXT_CHANGE':
                return (value !== searchText) && { ...state, searchText: value };
            case 'CATEGORY_CHANGE':
                return { ...state, searchBy: value };
            case 'QUERY_CHANGE':
                return (legalQueryChange(value) && value !== queryText) && { ...state, queryText: value };
            case 'MAKE_SEARCH':
                return { ...state, prevSearch: searchBy === 'Custom' ? queryText : searchText, loading: true, prevSearchBy: searchBy };
            case 'SEARCH_RESPONSE':
                return changeOptions(true);
            case 'EXTEND_OPTIONS':
                return changeOptions(false);
            case 'SEARCH_ERROR':
                return { ...state, loading: false };
            default: return state;
        }
    };
    const initialStateInternal = {
        searchBy: 'Any',
        prevSearch: '',
        prevSearchBy: '',
        searchText: '',
        queryText: `SELECT DISTINCT ?${selectVariable}\nWHERE {?${selectVariable} ?p ?o}`,
        options: [],
        loading: false,
        ...initialState
    };
    const contentInternal = ({ searchBy, loading, options, searchText, queryText, prevSearch, prevSearchBy, ...state }, dispatch, valDispatch) => {
        const eValDispatch = type => (e, { value }) => valDispatch(type)(value);
        const keyPress = e => {
            e.key === 'Enter' && makeSearch();
        };
        const makeSearch = () => {
            const search = searchBy === 'Custom' ? queryText : searchText;
            if ((prevSearch !== search || prevSearchBy !== searchBy) && (search !== '' || searchBy === 'All')) {
                triplestore({
                    initFunc: valDispatch('MAKE_SEARCH'),
                    errorFunc: valDispatch('SEARCH_ERROR'),
                    responseFunc: response => dispatch({ type: 'SEARCH_RESPONSE', response, r: { search, searchBy } }),
                    query, search, searchBy, selectVariable
                });
            }
        };
        const opts = () => {
            const filterCond = optionsFilter(state);
            return options.filter(x => filterCond(x.value));
        };
        const o = advList(standardQueries, ['Custom'], advanced_features.manual_sparql_queries);
        if (!advanced_features.manual_sparql_queries && searchBy === 'Custom') {
            valDispatch('CATEGORY_CHANGE')('Class');
        }

        const input = searchBy => {
            if (['Objects Of', 'Subjects Of', 'Class', 'Target'].includes(searchBy)) {
                return <KField onKeyPress={keyPress} style={{width : '100%'}} onChange={e => valDispatch('TEXT_CHANGE')(e.target.value)} value={searchText} />
            // } else if (searchBy === 'Name') {
            //     return <SField onKeyPress={keyPress} style={{width : '100%'}} onChange={e => valDispatch('TEXT_CHANGE')(e.target.value)} value={searchText} />
            } else {
                return <input onKeyPress={keyPress} onChange={e => valDispatch('TEXT_CHANGE')(e.target.value)} value={searchText} />
            }
        }

        const [labels, addLabels] = useReducer((state, action) => {
            const up = (_.cloneDeep({...state, ...action}))
            // console.log(up)
            return up
        }, {'':''})




        // opts().forEach(IRI => {
        //     console.log(IRI, opts())
        //     triplestoreInterface({query : 'GET_LABEL', IRI : IRI?.key,
        //     responseFunc: r => !Object.values(labels).includes(r) && addLabels({[IRI] : r})
        //     })
        // })

        // useEffect(() => {
        //     triplestore({query : 'GET_LABELS_AND_DETAILS', IRIS : _.difference(_.cloneDeep(opts().map(x => x.key || x.shacl)), _.cloneDeep(_.keys(labels[0]))),
        //     responseFunc: addLabels
        //     })
        // }, hash(_.difference(_.cloneDeep(opts()), _.cloneDeep(_.keys(labels[0])))))
        
        useEffect(() => {
            triplestore({query : 'GET_LABELS', IRIS : _.difference(_.cloneDeep(opts().map(x => x.key || x.shacl)), _.cloneDeep(_.keys(labels))),
            responseFunc: addLabels
            })
        }, hash(_.difference(_.cloneDeep(opts()), _.cloneDeep(_.keys(labels)))))

        const [labelsDetails, addLabelsDetails] = useReducer((state, action) => {
            const up = (_.cloneDeep({...state, ...action[1]}))
            // console.log(up)
            return up
        }, {'':''})

        // console.log('labels details', labelsDetails)

        // useEffect(() => {
        //     triplestore({query : 'GET_LABELS_AND_DETAILS', IRIS : _.difference(_.cloneDeep(opts().map(x => x.key || x.shacl)), _.cloneDeep(_.keys(labels))),
        //     responseFunc: addLabelsDetails
        //     })
        // }, hash(_.difference(_.cloneDeep(opts()), _.cloneDeep(_.keys(labels)))))

        // console.log('labels', labels, hash(_.difference(_.cloneDeep(o), _.cloneDeep(_.keys(labels)))))

        const opts2 = () => opts().map(x => {
            return ({key : x.key, value : x.key, text : (labels[x.key] || /[a-z0-9]*$/i.exec(x.text)[0]) 
            
        // + (labels[1][x.key]?.['http://www.w3.org/ns/shacl#property'] ? 
        //     `[${labels[1][x.key]?.['http://www.w3.org/ns/shacl#property']?.length} properties]`
        // : '')

        // + labels[1][x.key]
        // + labels
        
        })})

        // console.log(opts(), opts2())

        const DetailPopup = (IRI) => {

        }

        // const { useStep } = useJourney();
        // const el2 = useRef(1);
        // useStep(el2, 'Why not try it out by searching for an entity now?');
        // console.log(opts(), opts2())
        return (
        <JourneyStep message="You can use this dropdown to select the entity you wish to work with. We show the label if it is available and use the IRI as a fallback. Press next and then make your selection!">
        
        You can use the search field below to search for {name === 'SHACL' ? 'SHACL constraints to apply' : 'targets to enter into the form'}
        <Divider/>
        <Segment basic style={{margin : '0px', padding : '0px'}} disabled={disabled}>
        
        <Form>
            <JourneyStep message="Lets start by searching for an entity that we want to enter some details about.">
            <Input type='text' key='base' placeholder='Search...' action fluid disabled={disabled}>
                {searchBy !== 'Custom' && searchBy !== 'All' && input(searchBy)}
                <Select key='sel' disabled={disabled} onKeyPress={keyPress} value={searchBy} compact={searchBy !== 'Custom' && searchBy !== 'All'} fluid={searchBy == 'Custom' || searchBy == 'All'} onChange={eValDispatch('CATEGORY_CHANGE')} options={optionsFromArray(o)} />
                <Button key='but' disabled={disabled} onKeyPress={keyPress} onClick={() => makeSearch()} compact align={'right'}><Icon key='ic' name='search' /></Button>
            </Input>
            </JourneyStep>
            
            {searchBy === 'Custom' && <TextArea rows={queryText.split(/\r\n|\r|\n/).length} value={queryText} onChange={eValDispatch('QUERY_CHANGE')} />}
            <Divider />
            {loading ? (<CancelableLoader onClick={valDispatch('SEARCH_ERROR')} />) : (opts().length === 0 ? ('No remaning options for this search.') : (setOptionsDropdown({
                multiple: true,
                options: opts2(),//opts(),
                customOptions : true,
                sort: true,
                placeholder,
                value: [],
                onChange: eValDispatch('ADD_SELECTIONS'),
                customOptions: true
            })))}
            {content && content(state, dispatch, valDispatch, eValDispatch)}
            
        </Form>
        
        </Segment>
        </JourneyStep>
        );
    };
    return undoableSection({
        content: contentInternal,
        initialState: initialStateInternal,
        reducer: internalReducer,
        title: opts
    });
};
