const ContextStrategy = require('./db/strategies/base/contextStrategy'),
  MongoDB = require('./db/strategies/mongodb/mongodb'),
  Postgres = require('./db/strategies/postgres')

const contextMongo = new ContextStrategy(new MongoDB())
contextMongo.create()

const contextPostgres = new ContextStrategy(new Postgres())
contextPostgres.create()