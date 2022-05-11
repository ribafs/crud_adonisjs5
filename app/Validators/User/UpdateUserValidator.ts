import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({ trim: true }, [
      rules.alpha({
        allow: ['space'],
      }),
      rules.maxLength(70),
    ]),

    username: schema.string.optional([
      rules.alpha(),
      rules.maxLength(32),
      rules.unique({ table: 'users', column: 'username' }),
    ]),

    email: schema.string.optional([
      rules.email(),
      rules.maxLength(255),
      rules.unique({ table: 'users', column: 'username' }),
    ]),

    password: schema.string.optional([rules.minLength(6), rules.maxLength(80)]),
  })

  public messages = {
    alpha: 'The {{ field }} can only contain alphabetic characters',
    minLength: 'The {{ field }} must be at least {{ options.minLength }} characters length',
    maxLength: 'The {{ field }} cannot be longer than {{ options.maxLength }} characters length',
    unique: 'The {{ field }} must be unique. This value is already taken',
  }
}
