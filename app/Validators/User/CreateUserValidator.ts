import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.alpha({
        allow: ['space'],
      }),
      rules.maxLength(150),
    ]),

    username: schema.string([
      rules.alpha(),
      rules.maxLength(50),
      rules.unique({ table: 'users', column: 'username' }),
    ]),

    email: schema.string([
      rules.email(),
      rules.maxLength(255),
      rules.unique({ table: 'users', column: 'email' }),
    ]),

    password: schema.string([rules.minLength(6), rules.maxLength(255)]),
  })

  public messages = {
    alpha: 'The {{ field }} can only contain alphabetic characters',
    required: 'The {{ field }} is required to create the user',
    minLength: 'The {{ field }} must be at least {{ options.minLength }} characters lenght',
    maxLength: 'The {{ field }} cannot be longer than {{ options.maxLength }} characters lenght',
    unique: 'The {{ field }} must be unique. This value is already taken',
  }
}
