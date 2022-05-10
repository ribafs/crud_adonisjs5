import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

export default class UsersController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const users = await Database.from('users').paginate(request.qs().page, request.qs().qtd)

      const usersJSON = users.toJSON()
      return response.status(200).send(usersJSON)
    } catch (error) {
      return response
        .status(500)
        .send({ error: 'Unable to search for registered users. Please try again later.' })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['name', 'username', 'email', 'password'])

      if (!data.name || !data.username || !data.email || !data.password) {
        return response
          .status(400)
          .send({ error: 'One or more fields are empty. Please check and try again.' })
      }

      const user = await User.create({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      })

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
    try {
      const user = await User.find(params.id)

      if (!user) {
        return response.status(404).send({
          message:
            'The specified user was not found. Please check the information provided and try again.',
        })
      }

      if (request.body().name !== '' && user.name !== request.body().name) {
        user.name = request.body().name
      }

      if (request.body().username !== '' && user.username !== request.body().username) {
        user.username = request.body().username
      }

      if (request.body().email !== '' && user.email !== request.body().email) {
        user.email = request.body().email
      }

      if (request.body().password !== '' && user.password !== request.body().password) {
        user.password = request.body().password
      }

      user.updatedAt = DateTime.local()

      await user.save()
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
