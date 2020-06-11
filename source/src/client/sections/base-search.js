import React, { useContext, useReducer, useEffect } from 'react';
import { TriplestoreContext } from '../context';
import { Form, TextArea, Button, Input, Select, Icon, Divider, Segment } from 'semantic-ui-react';
import { optionsFromArray, advList, hash } from '../utils';
import setOptionsDropdown from '../forms/fields/set-options-dropdown';
import undoableSection from '../forms/fields/undoable-section';
import CancelableLoader from '../forms/fields/cancelable-loader';
import triplestoreInterface from '../triplestore-interface';
import IRIField from '../validated-fields/IRI-field'

export default ({ content, initialState, reducer, selectVariable, standardQueries, query, responseConversion, optionsFilter, convertionType, opts , disabled, placeholder}) => {
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
            console.log(up)
            return up
        }, {'':''})




        // opts().forEach(IRI => {
        //     console.log(IRI, opts())
        //     triplestoreInterface({query : 'GET_LABEL', IRI : IRI?.key,
        //     responseFunc: r => !Object.values(labels).includes(r) && addLabels({[IRI] : r})
        //     })
        // })

        useEffect(() => {
            triplestore({query : 'GET_LABELS', IRIS : _.difference(_.cloneDeep(opts().map(x => x.key || x.shacl)), _.cloneDeep(_.keys(labels))),
            responseFunc: addLabels
            })
        }, hash(_.difference(_.cloneDeep(opts()), _.cloneDeep(_.keys(labels)))))

        console.log('labels', labels, hash(_.difference(_.cloneDeep(o), _.cloneDeep(_.keys(labels)))))

        const opts2 = () => opts().map(x => ({key : x.key, value : x.key, text : labels[x.key] || x.text}))

        console.log(opts(), opts2())

        return (
        <Segment basic style={{margin : '0px', padding : '0px'}} disabled={disabled}>
        <Form>
            <Input type='text' key='base' placeholder='Search...' action fluid disabled={disabled}>
                {searchBy !== 'Custom' && searchBy !== 'All' && input(searchBy)}
                <Select key='sel' disabled={disabled} onKeyPress={keyPress} value={searchBy} compact={searchBy !== 'Custom' && searchBy !== 'All'} fluid={searchBy == 'Custom' || searchBy == 'All'} onChange={eValDispatch('CATEGORY_CHANGE')} options={optionsFromArray(o)} />
                <Button key='but' disabled={disabled} onKeyPress={keyPress} onClick={() => makeSearch()} compact align={'right'}><Icon key='ic' name='search' /></Button>
            </Input>
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
        </Segment>);
    };
    return undoableSection({
        content: contentInternal,
        initialState: initialStateInternal,
        reducer: internalReducer,
        title: opts
    });
};
