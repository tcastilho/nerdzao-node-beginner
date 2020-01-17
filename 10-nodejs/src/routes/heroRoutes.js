const Joi = require('@hapi/joi'),
  Boom = require('boom'),
  BaseRoute = require('./base/baseRoute')

const failAction = (request, headers, error) => {
  throw error
}

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super()
    this.db = db
  }

  list() {
    return {
      path: '/herois',
      method: 'GET',
      config: {
        tags: ['api'],
        description: 'Deve listar herois',
        notes: 'pode paginar resultados e filtrar por nome',
        validate: {
          // payload -> body
          // headers -> header
          // params -> na URL :id
          // query -> ?skip=10&limit=100
          failAction,
          query: Joi.object({
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            nome: Joi.string().min(3).max(100)
          })
        }
      },
      handler: (request, headers) => {
        try {
          const { skip, limit, nome } = request.query
          let query = nome ? {
            nome: {$regex: `.*${nome}*.`}
          } : {}
          return this.db.read(query, parseInt(skip), parseInt(limit))
        } catch(error) {
          console.log('DEU RUIM', error)
          return Boom.internal()
        }
      }
    }
  }

  create() {
    return {
      path: '/herois',
      method: 'POST',
      config: {
        tags: ['api'],
        description: 'Deve cadastrar heroi',
        notes: 'pode cadastrar heroi por nome e poder',
        validate: {
          failAction,
          payload: Joi.object({
            nome: Joi.string().required().min(3).max(100),
            poder: Joi.string().required().min(2).max(100)
          })
        }
      },
      handler: async (request) => {
        try {
          const { nome, poder } = request.payload,
            result = await this.db.create({ nome, poder })
          // console.log('result', result)
          return {
            message: 'Heroi cadastrado com sucesso',
            _id: result._id
          }
        } catch(error) {
          console.log('DEU RUIM', error)
          return Boom.internal()
        }
      }
    }
  }

  update() {
    return {
      path: '/herois/{id}',
      method: 'PATCH',
      config: {
        tags: ['api'],
        description: 'Deve atualizar heroi por id',
        notes: 'pode atualizar qualquer campo',
        validate: {
          failAction,
          params: Joi.object({
            id: Joi.string().required()
          }),
          payload: Joi.object({
            nome: Joi.string().min(3).max(100),
            poder: Joi.string().min(2).max(100)
          })
        }
      },
      handler: async (request) => {
        try {
          const { id } = request.params,
            { payload } = request,
            dadosString = JSON.stringify(payload),
            dados = JSON.parse(dadosString),
            result = await this.db.update(id, dados)
          // console.log('result', result)
          if (result.nModified !== 1) return Boom.preconditionFailed('Id nao encontrado no banco')
          return {
            message: 'Heroi atualizado com sucesso'
          }
        } catch(error) {
          console.log('DEU RUIM', error)
          return Boom.internal()
        }
      }
    }
  }

  delete() {
    return {
      path: '/herois/{id}',
      method: 'DELETE',
      config: {
        tags: ['api'],
        description: 'Deve remover heroi por id',
        notes: 'o id tem que ser valido',
        validate: {
          failAction,
          params: Joi.object({
            id: Joi.string().required()
          })
        }
      },
      handler: async (request) => {
        try {
          const { id } = request.params,
            result = await this.db.delete(id)
          // console.log('result', result)
          if (result.n !== 1) return Boom.preconditionFailed('Id nao encontrado no banco')
          return {
            message: 'Heroi removido com sucesso'
          }
        } catch(error) {
          console.log('DEU RUIM', error)
          return Boom.internal()
        }
      }
    }
  }
}

module.exports = HeroRoutes