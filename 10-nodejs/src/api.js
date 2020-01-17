const Hapi = require("@hapi/hapi"),
  HapiSwagger = require('hapi-swagger'),
  Vision = require('@hapi/vision'),
  Inert = require('@hapi/inert'),
  Context = require("./db/strategies/base/contextStrategy"),
  MongoDb = require("./db/strategies/mongodb/mongodb"),
  HeroiSchema = require("./db/strategies/mongodb/schemas/heroisSchema"),
  HeroRoute = require("./routes/heroRoutes");

const app = new Hapi.Server({
  port: 5000
});

function mapRoutes(instance, methods) {
  return methods.map(method => instance[method]());
}

async function main() {
  const connection = MongoDb.connect(),
    context = new Context(new MongoDb(connection, HeroiSchema)),
    swaggerOptions = {
      info: {
        title: 'API Herois - #CursoNodeBR',
        version: 'v1.0'
      }
    }
  await app.register([
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ])
  // console.log('mapRoutes', mapRoutes(new HeroRoute(context), HeroRoute.methods()))
  app.route(mapRoutes(new HeroRoute(context), HeroRoute.methods()));

  await app.start();
  console.log("Servidor rodando na porta", app.info.port);

  return app;
}

module.exports = main();
