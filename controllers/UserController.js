const { User } = require('../models/index')
const { comparePassword } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')
const { verify } = require('../helpers/googleOauth')

class UserController {
    static async register(req, res, next) {
        const { ...data } = req.body
        try {
            const newUser = await User.create(data)
            const payload = {
                email: newUser.email
            }
            const token = signToken(payload)
            res.status(201).json({
                token
            })
        } catch (err) {
            if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                next({
                    name: 'ValidationError',
                    error: err.errors[0].message
                })
            } else {
                next(err)
            }
        }
    }

    static async login(req, res, next) {
        const inputPass = req.body.password
        try {
            const user = await User.findOne({ where: {email: req.body.email} })
            const dbPass = user ? user.password : ''
            if(!user) {
                next({
                    name: 'ValidationError',
                    error: 'invalid username or password'
                })
            } else if (!comparePassword(inputPass, dbPass)) {
                next({
                    name: 'ValidationError',
                    error: 'invalid username or password'
                })
            } else {
                const payload = {
                    email: user.email
                }
                const token = signToken(payload)
                res.status(200).json({
                    token
                })
            }
        } catch (err) {
            next(err)
        }
    }

    static async oauthGoogle(req, res) {
        const google_token = req.headers.google_token
        try {
            const payload = await verify(google_token)
            const user = await User.findOne({where: {
                email: payload.email
            }})
            const newPayload = {
                email: payload.email
            }
            if (!user) {
                const newUser = {
                    username: payload.email,
                    email: payload.email,
                    password: process.env.DEFAULT_GOOGLEPASS
                }
                await User.create(newUser)                
                const token = signToken(newPayload)
                res.status(201).json({
                    token
                })
            } else {
                const token = signToken(newPayload)
                res.status(200).json({
                    token
                })
            }
        } catch (err) {
            next(err)
        }
    }

    static async browse(req, res) {
        try {
            const users = await User.findAll()
            res.status(200).json(users)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = UserController