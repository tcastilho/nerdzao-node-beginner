const assert = require("assert"),
  api = require("./../api");

let app = {},
  MOCK_ID = ''

const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
  },
  MOCK_HEROI_INICIAL = {
    nome: 'Gavião Negro',
    poder: 'Mira'
  }

describe("Suite de testes da API Heroes", function() {
  this.beforeAll(async () => {
    app = await api;
    const result = await app.inject({
      method: "POST",
      url: '/herois',
      payload: JSON.stringify(MOCK_HEROI_INICIAL)
    }),
    { _id } = JSON.parse(result.payload)
    MOCK_ID = _id
  });

  it("listar /herois", async () => {
    const result = await app.inject({
        method: "GET",
        url: "/herois?skip=0&limit=10"
      }),
      dados = JSON.parse(result.payload),
      statusCode = result.statusCode

    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(dados));
  });

  it("listar /herois - deve retornar somente 10 registros", async () => {
    const TAMANHO_LIMITE = 1,
      result = await app.inject({
        method: "GET",
        url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
      }),
      dados = JSON.parse(result.payload),
      statusCode = result.statusCode

    assert.deepEqual(statusCode, 200);
    assert.ok(dados.length === TAMANHO_LIMITE);
  });

  it("listar /herois - deve retornar um erro com limit incorreto", async () => {
    const TAMANHO_LIMITE = "aeee",
      result = await app.inject({
        method: "GET",
        url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
      }),
      errorResult = {
        statusCode: 400,
        error: "Bad Request",
        message: '"limit" must be a number',
        validation: { source: "query", keys: ["limit"] }
      }

    assert.deepEqual(result.statusCode, 400);
    assert.deepEqual(result.payload, JSON.stringify(errorResult));
  });

  it("listar /herois - deve filtrar um item", async () => {
    const TAMANHO_LIMITE = 1000,
      NAME = "Flash",
      result = await app.inject({
        method: "GET",
        url: `/herois?skip=0&limit=${TAMANHO_LIMITE}&nome=${NAME}`
      }),
      dados = JSON.parse(result.payload),
      statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.ok(dados[0].nome === NAME);
  });

  it('cadastrar', async () => {
    const result = await app.inject({
        method: "POST",
        url: '/herois',
        payload: JSON.stringify(MOCK_HEROI_CADASTRAR)
      }),
      statusCode = result.statusCode,
      { message, _id } = JSON.parse(result.payload)

    assert.ok(statusCode === 200)
    assert.notStrictEqual(_id, undefined)
    assert.deepEqual(message, 'Heroi cadastrado com sucesso')
  })

  it('atualizar PATCH - /herois/:id', async () => {
    const _id = MOCK_ID,
      expected = {
        poder: 'Super Mira'
      },
      result = await app.inject({
        method: "PATCH",
        url: `/herois/${_id}`,
        payload: JSON.stringify(expected)
      }),
      statusCode = result.statusCode,
      { message } = JSON.parse(result.payload)

    assert.ok(statusCode === 200)
    assert.deepEqual(message, 'Heroi atualizado com sucesso')
  })

  it('atualizar PATCH - /herois/:id - nao deve atualizar com ID incorreto', async () => {
    const _id = '5e20cf17fec00955d1425820',
      expected = {
        poder: 'Super Mira'
      },
      result = await app.inject({
        method: "PATCH",
        url: `/herois/${_id}`,
        payload: JSON.stringify(expected)
      }),
      statusCode = result.statusCode,
      { message } = JSON.parse(result.payload)

    assert.ok(statusCode === 412)
    assert.deepEqual(message, 'Id nao encontrado no banco')
  })

  it('remover DELETE - /herois/:id', async () => {
    const _id = MOCK_ID,
      result = await app.inject({
        method: "DELETE",
        url: `/herois/${_id}`
      }),
      statusCode = result.statusCode,
      { message } = JSON.parse(result.payload)

    assert.ok(statusCode === 200)
    assert.deepEqual(message, 'Heroi removido com sucesso')
  })

  it('remover DELETE - /herois/:id - nao deve remover com ID incorreto', async () => {
    const _id = '5e20cf17fec00955d1425820',
      result = await app.inject({
        method: "DELETE",
        url: `/herois/${_id}`
      }),
      statusCode = result.statusCode,
      { message } = JSON.parse(result.payload)

    assert.ok(statusCode === 412)
    assert.deepEqual(message, 'Id nao encontrado no banco')
  })

  it('remover DELETE - /herois/:id - nao deve remover com ID invalido', async () => {
    const _id = 'asdrubal',
      result = await app.inject({
        method: "DELETE",
        url: `/herois/${_id}`
      }),
      statusCode = result.statusCode,
      { message } = JSON.parse(result.payload)

    assert.ok(statusCode === 500)
    assert.deepEqual(message, 'An internal server error occurred')
  })
});
