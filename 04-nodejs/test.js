const { deepEqual, ok } = require('assert'),
  database = require('./database'),
  DEFAULT_ITEM_CADASTRAR = {
    nome: 'Flash',
    poder: 'speed',
    id: 1
  },
  DEFAULT_ITEM_ATUALIZAR = {
    nome: 'Lanterna Verde',
    poder: 'Energia do Anel',
    id: 2
  }

describe('Suite de manipulacao de Herois', () => {
  before(async () => {
    await database.cadastrar(DEFAULT_ITEM_CADASTRAR)
    await database.cadastrar(DEFAULT_ITEM_ATUALIZAR)
  })
  it('deve pesquisar um heroi usando arquivos', async () => {
    const expected = DEFAULT_ITEM_CADASTRAR,
      [ resultado ] = await database.listar(expected.id)
    deepEqual(resultado, expected)
  })
  it('deve cadastrar um heroi, usando arquivos', async () => {
    const expected = DEFAULT_ITEM_CADASTRAR,
      resultado = await database.cadastrar(DEFAULT_ITEM_CADASTRAR),
      [atual] = await database.listar(DEFAULT_ITEM_CADASTRAR.id)
    deepEqual(atual, expected)
  })
  it('deve remover um heroi por id', async () => {
    const expected = true,
      resultado = await database.remover(DEFAULT_ITEM_CADASTRAR.id)
    deepEqual(resultado, expected)
  })
  it('deve atualizer um heroi pelo id', async () => {
    const expected = {
      ...DEFAULT_ITEM_ATUALIZAR,
      nome: 'Batman',
      poder: 'Dinheiro'
    },
      novoDado = {
        nome: 'Batman',
        poder: 'Dinheiro'
      }
    await database.atualizar(DEFAULT_ITEM_ATUALIZAR.id, novoDado)
    const [resultado] = await database.listar(DEFAULT_ITEM_ATUALIZAR.id)
    deepEqual(resultado, expected)
  })
})