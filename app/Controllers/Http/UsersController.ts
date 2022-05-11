import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

import User from 'App/Models/User'
import CreateUser from 'App/Validators/User/CreateUserValidator'
import UpdateUser from 'App/Validators/User/UpdateUserValidator'

export default class UsersController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const users = (
        await Database.from('users').paginate(request.qs().page, request.qs().qtd)
      ).toJSON()

      return response.status(200).send(users)
    } catch (error) {
      return response
        .status(500)
        .send({ error: 'Unable to search for registered users. Please try again later.' })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateUser)
    try {
      const user = await User.create(payload)

      if (user) {
        return response.status(201).send(user)
      } else {
        return response.status(400).send('Could not create new user. Please try again later')
      }
    } catch (error) {
      return response.status(500).send({ error: 'Could not create user. Please, try again later.' })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const user = await User.find(params.id)

      if (!user) {
        return response.status(404).send({
          message:
            'The specified user was not found. Please, check the information provided and try again.',
        })
      }

      const userJSON = user.serialize()

      return userJSON
    } catch (error) {
      return response.status(500).send({ error: 'Could not delete user. Please try again later.' })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    const [user, payload] = await Promise.all([User.find(params.id), request.validate(UpdateUser)])
    try {
      if (!user) {
        return response.status(404).send({
          message:
            'The specified user was not found. Please check the information provided and try again.',
        })
      }

      if (payload.name && user.name !== payload.name) {
        user.name = String(payload.name)
      }

      if (payload.username && user.username !== payload.username) {
        user.username = String(payload.username)
      }

      if (payload.email && user.email !== payload.email) {
        user.email = String(payload.email)
      }

      if (payload.password && user.password !== payload.password) {
        user.password = String(payload.password)
      }

      user.updatedAt = DateTime.local()

      if (!(await user.save())) {
        return response.status(500).send({ error: 'Unable to change user information.' })
      }

      return response.status(201).send(user)
    } catch (error) {
      return response
        .status(500)
        .send({ error: 'Unable to change user information. Please try again later.' })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const user = await User.find(params.id)

      if (!user) {
        return response.status(404).send({
          message:
            'The specified user was not found. Please, check the information provided and try again.',
        })
      }
      return await user.delete()
    } catch (error) {
      return response.status(500).send({ error: 'Could not delete user. Please, try again later.' })
    }
  }
}
