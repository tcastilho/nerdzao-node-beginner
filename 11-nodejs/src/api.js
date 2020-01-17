const Hapi = require('@hapi/hapi'),
  HapiSwagger = require('hapi-swagger'),
  Vision = require('@hapi/vision'),
  Inert = require('@hapi/inert'),
  HapiJwt = require('hapi-auth-jwt2'),
  Context = require('./db/strategies/base/contextStrategy'),
  MongoDb = require('./db/strategies/mongodb/mongodb'),
  HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema'),
  HeroRoute = require('./routes/heroRoutes'),
  AuthRoutes = require('./routes/authRoutes'),
  Postgres = require('./db/strategies/postgres/postgres'),
  UsuarioSchema = require('./db/strategies/postgres/schemas/usuarioSchema')

const app = new Hapi.Server({
    port: 5000
  }),
  JWT_SECRET = 'MEU_SEGREDÃO_123'

function mapRoutes(instance, methods) {
  return methods.map(method => instance[method]())
}

async function main() {
  const connection = MongoDb.connect(),
    context = new Context(new MongoDb(connection, HeroiSchema)),
    connectionPostgres = await Postgres.connect(),
    usuarioSchema = await Postgres.defineModel(connectionPostgres, UsuarioSchema),
    contextPostgres = new Context(new Postgres(connectionPostgres, usuarioSchema))
    swaggerOptions = {
      info: {
        title: 'API Herois - #CursoNodeBR',
        version: 'v1.0'
      }
    }
  await app.register([
    HapiJwt,
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ])

  app.auth.strategy('jwt', 'jwt', {
    key: JWT_SECRET,
    options: {
      expiresIn: 3600
    },
    validate: async (dado, request) => {
      const [result] = await contextPostgres.read({
        username: dado.username.toLowerCase()
      })
      if (!result) {
        return {
          isValid: false
        }
      }
      // verifica no banco se usuario continua ativo
      // verifica no banco se usuario continua pagando
      return {
        isValid: true
      }
    }
  })
  app.auth.default('jwt')
  // console.log('mapRoutes', mapRoutes(new HeroRoute(context), HeroRoute.methods()))
  app.route([
    ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
    ...mapRoutes(new AuthRoutes(JWT_SECRET, contextPostgres), AuthRoutes.methods())
  ])

  await app.start()
  console.log('Servidor rodando na porta', app.info.port)

  return app
}

module.exports = main()
