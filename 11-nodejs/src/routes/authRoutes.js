const Joi = require('@hapi/joi'),
  Boom = require('boom'),
  Jwt = require('jsonwebtoken'),
  BaseRoute = require('./base/baseRoute'),
  PasswordHelper = require('./../helpers/passwordHelper')

const failAction = (request, headers, error) => {
    throw error
  },
  USER = {
    username: 'xuxadasilva',
    password: '123'
  }

class AuthRoutes extends BaseRoute {
  constructor(secret, db) {
    super()
    this.secret = secret
    this.db = db
  }

  login() {
    return {
      path: '/login',
      method: 'POST',
      config: {
        auth: false,
        tags: ['api'],
        description: 'Obter token',
        notes: 'faz login com user e senha do banco',
        validate: {
          failAction,
          payload: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
          })
        }
      },
      handler: async (request) => {
        try {
          const { username, password } = request.payload,
            [ usuario ] = await this.db.read({
              username: username.toLowerCase()
            })

          if (!usuario) return Boom.unauthorized('O usuario informado nao existe')

          const math = await PasswordHelper.comparePassword(password, usuario.password)

          if (!math) {
            return Boom.unauthorized('O usuario ou senha invalidos')
          }
          
          /* if (username.toLowerCase() !== USER.username || password !== USER.password)
            return Boom.unauthorized() */

          const token = Jwt.sign({
            username: username,
            id: usuario.id
          }, this.secret)

          return {
            token
          }
        } catch(error) {
          console.log('DEU RUIM', error)
          return Boom.internal()
        }
      }
    }
  }
}

module.exports = AuthRoutes
