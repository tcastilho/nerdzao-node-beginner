const assert = require('assert'),
  Postgres = require('../db/strategies/postgres'),
  Context = require('../db/strategies/base/contextStrategy')

const context = new Context(new Postgres()),
  MOCK_HEROI_CADASTRAR = {
    nome: 'Gaviao Negro',
    poder: 'flexas'
  },
  MOCK_HEROI_ATUALIZAR = {
    nome: 'Batman',
    poder: 'Dinheiro'
  }

describe('Postgres Strategy', function() {
  this.timeout(Infinity)
  this.beforeAll(async function() {
    await context.connect()
    await context.delete()
    await context.create(MOCK_HEROI_ATUALIZAR)
  })
  it('PostgresSQL Connection', async function() {
    const result = await context.isConnected()
    assert.equal(result, true)
  })

  it('cadastrar', async function() {
    const result = await context.create(MOCK_HEROI_CADASTRAR)
    delete result.id
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
  })
  
  it('listar', async function() {
    const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome })
    delete result.id
    assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
  })

  it('atualizar', async function() {
    const [ itemAtualizar ] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome }),
      novoItem = {
        ...MOCK_HEROI_ATUALIZAR,
        nome: 'Mulher Maravilha'
      },
      [ result ] = await context.update(itemAtualizar.id, novoItem),
      [ itemAtualizado ] = await context.read({ id: itemAtualizar.id })
    assert.deepEqual(result, 1)
    assert.deepEqual(itemAtualizado.nome, novoItem.nome)
    /*
    No Javascript temos uma tecnica chamada rest/spread que é um método usado para mergear objetos ou separa-los
    {
      nome: 'Batman',
      poder: 'Dinheiro'
    }
    {
      dataNascimento: '1998-01-01'
    }
    // final
    {
      nome: 'Batman',
      poder: 'Dinheiro'
      dataNascimento: '1998-01-01'
    }
     */
  })

  it('remover', async function() {
    const [ item ] = await context.read({}),
      result = await context.delete(item.id)
    assert.deepEqual(result, 1)
  })
})