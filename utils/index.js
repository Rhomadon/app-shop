function getToken(req) {
    let token = 
    req.header.authorization ? req.header.authorization.replace(`Bearer`, ``) : null

    return token && token.length ? token : null
}

module.exports = {
    getToken
}