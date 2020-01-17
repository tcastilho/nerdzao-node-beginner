const assert = require('assert'),
  PasswordHelper = require('./../helpers/passwordHelper')

const SENHA = 'Thiago@123789654',
  HASH = '$2b$04$S4/iaQEHjvZ1.rjVLrJgvOsbaZJVF6WDYoZnybGsISdi8bZe.78qa'

describe('UserHelper test suite', function() {
  it('deve gerar um hash a partir de um senha', async () => {
    const result = await PasswordHelper.hashPassword(SENHA)

    assert.ok(result.length > 10)
  })

  it('deve comparar uma senha e seu hash', async () => {
    const result = await PasswordHelper.comparePassword(SENHA, HASH)
    
    assert.ok(result)
  })

  /* it('deve comparar uma senha e seu hash', async () => {
    const result = await PasswordHelper.comparePassword(SENHA, HASH)

    assert.ok(result)
  }) */
})
