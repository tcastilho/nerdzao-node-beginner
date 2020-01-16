const Sequelize = require('sequelize')
const ICrud = require('./interfaces/interfaceCrud')

class Postgres extends ICrud {
  constructor() {
    super()
    this._driver = null
    this._herois = null
  }

  async isConnected() {
    try {
      await this._driver.authenticate()
      return true
    } catch(error) {
      console.error('fail!', error)
      return false;
    }
  }

  async defineModel() {
    this._herois = this._driver.define('herois', {
      id: {
        type: Sequelize.INTEGER,
        required: true,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: Sequelize.STRING,
        require: true
      },
      poder: {
        type: Sequelize.STRING,
        require: true
      }
    }, {
      tableName: 'TB_HEROIS',
      freeseTableName: false,
      timestamps: false
    })

    await this._herois.sync()
  }

  async connect() {
    this._driver = new Sequelize(
      'HEROES',
      'thiagocastilho',
      'admin', {
        host: 'localhost',
        dialect: 'postgres',
        quoteIdentifiers: false,
        operatorsAliases: false
      }
    )
    await this.defineModel()
  }

  async create(item) {
    const { dataValues } = await this._herois.create(item)
    return dataValues
  }

  async read(item) {
    return this._herois.findAll({where: item, raw: true})
  }
  
  async update(id, item) {
    return this._herois.update(item, {where: {id: id}})
  }

  async delete(id) {
    const query = id ? { id } : {}
    return this._herois.destroy({where: query})
  }
}

module.exports = Postgres