export default ({TriplestoreContext : [{path,}], ActiveraulContext : [,dispatch]}) => {
    ////console.log('update targers')
    return dispatch({type : 'UPDATE_TARGETS', path})
}