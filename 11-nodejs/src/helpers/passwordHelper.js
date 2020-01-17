const Bcrypt = require('bcrypt')

const { promisify } = require('util'),
  hashAsync = promisify(Bcrypt.hash),
  compareAsync = promisify(Bcrypt.compare),
  SALT = 3

class PasswordHelper {
  static hashPassword (pass) {
    return hashAsync(pass, SALT)
  }

  static comparePassword(pass, hash) {
    return compareAsync(pass, hash)
  }
}

module.exports = PasswordHelper