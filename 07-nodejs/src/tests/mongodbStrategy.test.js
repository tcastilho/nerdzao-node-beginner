const assert = require('assert'),
  MongoDb = require('../db/strategies/mongodb'),
  Context = require('../db/strategies/base/contextStrategy')

const context = new Context(new MongoDb()),
  MOCK_HEROI_CADASTRAR = {
    nome: 'Mulher Maravilha',
    poder: 'Laço'
  },
  MOCK_HEROI_DEFAULT = {
    nome: `Homem Aranha-${Date.now()}`,
    poder: 'Super teia'
  },
  MOCK_HEROI_ATUALIZAR = {
    nome: 'Patolino-${Date.now()}',
    poder: 'Velocidade'
  }
let MOCK_HEROI_ID = ''

describe('MongoDB Strategy', function () {
  this.beforeAll(async () => {
    await context.connect()
    await context.create(MOCK_HEROI_DEFAULT)
    const result = await context.create(MOCK_HEROI_ATUALIZAR)
    MOCK_HEROI_ID = result._id
  })

  it('Verificar conexao', async () => {
    const result = await context.isConnected(),
      expected = 'Conectado'
    assert.deepEqual(result, expected)
  })

  it('cadastrar', async () => {
    const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR)
    assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
  })

  it('listar', async () => {
    const [{ nome, poder }] = await context.read({ nome: MOCK_HEROI_DEFAULT.nome })
    const result = { nome, poder }
    assert.deepEqual(result, MOCK_HEROI_DEFAULT)
  })

  it('atualizar', async () => {
    const result = await context.update(MOCK_HEROI_ID, {
      nome: 'Pernalonga'
    })
    assert.deepEqual(result.nModified, 1)
  })

  it('remover', async () => {
    const result = await context.delete(MOCK_HEROI_ID)
    assert.deepEqual(result.n, 1)
  })
})