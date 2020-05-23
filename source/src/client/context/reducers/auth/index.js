export default (state, action) => {
    //console.log('auth reducer', state, action)
    const {type, username} = action
    switch (type) {
        case 'LOG_IN': return {logged_in : true, username}
        case 'LOG_OUT': return {logged_in : false, username : ''}
    }
}