const express = require('express')
const CORS = require('cors')

//Authorizations and password 
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWTSecret = 'husiahuishuai'


const app = express()

const connection = require('./database')
const Game = require('./Game')
const User = require('./User')
const Auth = require('./middleware/Auth')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(CORS())

connection
    .authenticate()
    .then(() => {
        console.log("Connection: Sucess!")
    })
    .catch((erro) => {
        console.log("Connection : Failed. ERRO: " + erro)
    })

const status = {
    notFound: 404,
    invalidArgument: 400,
    created: 201,
    sucess: 200,
    internalProblems: 500,
    notAuthtorized: 401
}


//ATUALIZAR JOGO
app.put('/games', Auth, (req, res) => {
    const { id, name, year, price } = req.body
    Game.update({
            name,
            year,
            price
        }, {
            where: {
                id: id
            }
        })
        .then(() => {
            res.statusCode = status.sucess
            res.send('Jogo alterado com sucesso')
        })
        .catch((error) => {
            res.statusCode = status.internalProblems
            res.send(`Houve um problema durante a solicitação: ${error}`)
        })
})

//DELETAR JOGO
app.delete('/games', Auth, (req, res) => {
        const { id } = req.body
        Game.destroy({
                where: {
                    id: id
                }
            })
            .then(() => {
                res.statusCode = status.sucess
                res.send('Jogo deletado com sucesso')
            })
            .catch((error) => {
                res.statusCode = status.internalProblems
                res.send(`Houve um erro durante a requisição: ${error}`)
            })
    })
    //ADICIONAR UM JOGO
app.post('/games', Auth, (req, res) => {
    const { name, year, price } = req.body
    if (name, year, price) {
        Game.create({
                name,
                year,
                price
            })
            .then(() => {
                res.statusCode = status.sucess
                res.send('Jogo adicionado com sucesso')
            })
            .catch((error) => {
                res.statusCode = status.internalProblems
                res.send(`Houve um problema durante a solicitação: ${error}`)
            })
    } else {
        res.statusCode = status.invalidArgument
        res.send('Parametros inválidos')
    }

})

//TODOS OS JOGOS
app.get('/games', Auth, (req, res) => {
    Game.findAll()
        .then((games) => {
            if (games != undefined) {
                res.statusCode = status.sucess
                res.json(games)
            } else {
                res.statusCode = status.notFound
                res.send('Nenhum jogo encontrado')
            }
        })
        .catch((error) => {
            res.statusCode = status.internalProblems
            res.send(`Houve um problema durante a requisição: ${error}`)
        })
})


app.get('/games/:id', Auth, (req, res) => {
    const { id } = req.params
    if (!isNaN(id)) {
        Game.findOne({
                where: {
                    id: parseInt(id)
                }
            })
            .then((result) => {
                if (result != undefined) {
                    res.statusCode = status.sucess
                    res.json(result)
                } else {
                    res.statusCode = status.notFound
                    res.send('Jogo não encontrado')
                }
            })
            .catch((error) => {
                res.statusCode = status.internalProblems
                res.send(`Houve um problema durante a requisição: ${error}`)
            })
    } else {
        res.statusCode = status.invalidArgument
        res.send('Parâmetro inválido')
    }
})

//LOGIN

app.post('/auth', (req, res) => {
    const { email, password } = req.body
    if (email != undefined && password != undefined) {
        User.findOne({
                where: {
                    email: email
                }
            })
            .then((user) => {
                const autorization = bcrypt.compareSync(password, user.password)
                if (autorization) {
                    res.statusCode = status.sucess
                    jwt
                        .sign({
                                id: user.id,
                                name: user.email,
                            },
                            JWTSecret, {
                                expiresIn: '2h'
                            },
                            (error, token) => {
                                if (error) {
                                    res.statusCode = status.internalProblems
                                    res.json({
                                        err: 'Houve um problema durante a autorização.'
                                    })
                                } else {
                                    res.statusCode = status.sucess
                                    res.json({
                                        user: {
                                            id: user.id,
                                            email: user.email,
                                            token: token
                                        }

                                    })
                                }
                            })

                } else {
                    res.statusCode = status.notAuthtorized
                    res.json({
                        err: 'E-mail ou senha incorretos.'
                    })
                }

            }).catch((error) => {
                res.statusCode = status.internalProblems
                res.send('Houve um problema durante a requisição.')
            })
    } else {
        res.statusCode = status.invalidArgument
        res.json({
            err: 'E-mail ou senha inválidos.'
        })
    }
})

//ROTA TEMPORARIA PARA ADICIONAR USUARIOS NO BANCO

app.post('/user', (req, res) => {
    const { name, email, password } = req.body
    const salt = bcrypt.genSaltSync()
    const hash = bcrypt.hashSync(password, salt)
    User.create({
        name,
        email,
        password: hash
    }).then((result) => {
        res.statusCode = status.sucess
        res.send('Usuario criado com sucesso')
    }).catch((error) => {
        res.statusCode = status.internalProblems
        res.send('Houve algum problema durante a requisição')
    })
})

app.listen(5000, () => {
    console.log('server is running')
})