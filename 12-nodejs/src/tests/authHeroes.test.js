const assert = require("assert"),
  api = require("./../api"),
  Context = require('./../db/strategies/base/contextStrategy'),
  Postgres = require('./../db/strategies/postgres/postgres'),
  UserSchema = require('./../db/strategies/postgres/schemas/usuarioSchema')

let app = {},
  context = {}

const USER = {
    username: 'xuxadasilva',
    password: '123'
  },
  USER_DB = {
    ...USER,
    password: '$2b$04$PufWBnBy2IND.NXF6cdIYu8NLDPmHx9lWHHY6S6ecreJh332zOzXC'
  }

describe('Auth test suite', function () {
  this.beforeAll(async () => {
    app = await api

    const connectionPostgres = await Postgres.connect(),
      model = await Postgres.defineModel(connectionPostgres, UserSchema)
  
    context = new Context(new Postgres(connectionPostgres, model))

      await context.update(null, USER_DB, true)
  })

  it('deve obter um token', async () => {
    const result = await app.inject({
        method: 'POST',
        url: '/login',
        payload: USER
      }),
      statusCode = result.statusCode,
      dados = JSON.parse(result.payload)

    assert.deepEqual(statusCode, 200)
    assert.ok(dados.token.length > 10)
  })

  it('deve retornar nao autorizado ao tentar obter um login errado', async () => {
    const result = await app.inject({
        method: 'POST',
        url: '/login',
        payload: {
          username: 'thiagocastilho',
          password: '123'
        }
      }),
      statusCode = result.statusCode,
      dados = JSON.parse(result.payload)

    assert.deepEqual(statusCode, 401)
    assert.deepEqual(dados.error, 'Unauthorized')
  })
})