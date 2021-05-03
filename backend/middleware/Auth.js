const jwt = require('jsonwebtoken')
require('dotenv').config()

const status = {
    notFound: 404,
    invalidArgument: 400,
    created: 201,
    sucess: 200,
    internalProblems: 500,
    notAuthtorized: 401
}

const Auth = (req, res, next) => {
    const JWTSecret = process.env.AUTH_SECRET
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
                console.log(data)
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