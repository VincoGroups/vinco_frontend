export const generateId = (length) => {
    let result = '';
    const characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.~_';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const MinimizeBigTitle = (text) => {
    let stringvalue = null
    if (text.length > 10) {
        stringvalue = text.substring(0, 11) + '...'
    } else {
        stringvalue = text
    } 

    return stringvalue
}
