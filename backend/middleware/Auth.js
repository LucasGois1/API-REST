const Auth = (req, res, next) => {
    const authToken = req.headers['authorization']
    if (authToken != undefined) {
        const [bearer, token] = authToken.split(' ')
        jwt.verify(token, JWTSecret, (error, data) => {
            if (error) {
                res.statusCode = status.notAuthtorized
                res.json({
                    err: 'Token inválido.'
                })
            } else {
                req.token = token
                req.loggedUser = {
                    ...data
                }
                next()
            }
        })
    } else {
        res.statusCode = status.notAuthtorized
        res.json({
            err: 'token inválido'
        })
    }
}

module.exports = Auth