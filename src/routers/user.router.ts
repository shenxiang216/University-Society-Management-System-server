import * as Router from 'koa-router'
import * as userService from '../services/user.service'
import * as Joi from 'joi'
import { badParams } from '../stats'
import { adminLogin } from '../services/user.service'

const router = new Router({
  prefix: '/api/user'
})

// 1、登陆 tsk
router.post('/login', async ctx => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  const result = await adminLogin(value.username, value.password)
  const token = result.newToken
  ctx.set('Set-Cookie', `token=${token}; path=/; httpOnly`)
  ctx.body = {
    stat: 'OK',
    data: result.user
  }
})
// 2、获取用户信息
router.post('/userinfo', async ctx => {
  const token = ctx.cookies.get('token')
  const result = await userService.UserInfo(token)
  ctx.body = {
    stat: 'OK',
    data: result
  }
})

// 2、管理端获取用户信息
router.post('/info', async ctx => {
  const token = ctx.cookies.get('token')
  const schema = Joi.object({
    username: Joi.string().required()
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  const result = await userService.Info(token, value.username)
  ctx.body = {
    stat: 'OK',
    data: result
  }
})

// 3、用户修改信息
router.post('/settings', async ctx => {
  const token = ctx.cookies.get('token')
  await userService.updUserinfo(ctx.request.body, token)
  ctx.body = {
    stat: 'OK'
  }
})
// 4、用户修改密码 tsk
router.post('/settings/password', async ctx => {
  const token = ctx.cookies.get('token')
  const schema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required()
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  await userService.password(token, value.oldPassword, value.newPassword)
  ctx.body = {
    stat: 'OK'
  }
})

// 5、退出登陆 tsk
router.post('/exit', async ctx => {
  const token = ctx.cookies.get('token')
  ctx.set('Set-Cookie', 'token= ; path=/; httpOnly')
  await userService.logout(token)
  ctx.body = {
    stat: 'OK'
  }
})

// 添加兴趣
router.post('/addinterest', async ctx => {
  const token = ctx.cookies.get('token')
  const schema = Joi.object({
    id: Joi.string().required()
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  await userService.addInterest(token, value.id)
  ctx.body = {
    stat: 'OK'
  }
})

// 查看兴趣
router.post('/findinterest', async ctx => {
  const token = ctx.cookies.get('token')
  const result = await userService.findInterest(token)
  ctx.body = {
    stat: 'OK',
    rows: result
  }
})

// 删除兴趣
router.post('/deleteinterest', async ctx => {
  const token = ctx.cookies.get('token')
  const schema = Joi.object({
    id: Joi.string().required()
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  await userService.delInterest(token, value.id)
  ctx.body = {
    stat: 'OK'
  }
})

export default router
