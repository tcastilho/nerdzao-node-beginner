const Hapi = require('hapi'),
  Context = require('./db/strategies/base/contextStrategy'),
  MongoDb = require('./db/strategies/mongodb/mongodb'),
  HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema')

const app = new Hapi.Server({
  port: 5000
})

async function main () {
  const connection = MongoDb.connect(),
    context = new Context(new MongoDb(connection, HeroiSchema))

  app.route([
    {
      path: '/herois',
      method: 'GET',
      handler: (request, head) => {
        return context.read()
      }
    }
  ])

  await app.start()
  console.log('Servidor rodando na porta', app.info.port)
}

main()
