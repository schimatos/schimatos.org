import { useContext } from 'react';
import { TriplestoreContext } from '../context';
import { filterKeyDict, dictMap } from '../utils';
export const useTriplestore = () => {
    const [state,] = useContext(TriplestoreContext);
    const graphs = filterKeyDict(state.settings || {}, k => k.includes('_graph'));
    const graphDetails = dictMap(graphs, ([k, v]) => [k, state[k + 's'][v]]);
    return {
        graphDetails,
        ...state
    };
};
