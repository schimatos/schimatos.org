export default (change, [hist, no], {dispatch}) => {
    const {toInsert, toDelete, ...state} = hist[hist.length-(no + change)]
    dispatch({type : 'COMPLETE_UPDATE', state })
    return keepCloning([hist, no + change])
}