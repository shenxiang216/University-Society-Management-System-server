import * as Router from 'koa-router'
import * as adminService from '../services/admin.service'
import * as Joi from 'joi'
import { badParams } from '../stats'
const router = new Router({
  prefix: '/api/admin'
})

// 1、管理端我的公司 tsk
router.post('/myCompany', async ctx => {
  const token = ctx.cookies.get('token')
  const result = await adminService.myCompany(token)
  ctx.body = {
    stat: 'OK',
    message: result
  }
})

// 2、管理端我的职位
router.post('/positions', async ctx => {
  const token = ctx.cookies.get('token')
  const schema = Joi.object({
    word: Joi.string().empty([null, '']).default('')
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  const result = await adminService.positions(token, value.word)
  ctx.body = {
    stat: 'OK',
    rows: result
  }
})

// 3、发布职位信息
router.post('/addjob', async ctx => {
  const schema = Joi.object({
    city: Joi.string().required(),
    ageLimit: Joi.number().required(),
    degree: Joi.number().required(),
    title: Joi.string().required(),
    label: Joi.array().items(Joi.string()).required(),
    wages: Joi.object().required(),
    wagesTimes: Joi.number().required(),
    decription: Joi.string().required(),
    address: Joi.string().required(),
    state: Joi.number().required()
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  const token = ctx.cookies.get('token')
  const result = await adminService.add(value, token)
  ctx.body = {
    stat: 'OK',
    data: result
  }
})
// 4、删除招聘信息
router.post('/deletejob', async ctx => {
  await adminService.remove(ctx.request.body._id)
  ctx.body = {
    stat: 'OK'
  }
})

// 5、修改职位信息（包括上架、下架）
router.post('/rejob', async ctx => {
  const schema = Joi.object({
    _id: Joi.string(),
    city: Joi.string(),
    ageLimit: Joi.number(),
    degree: Joi.number(),
    title: Joi.string(),
    label: Joi.array().items(Joi.string()),
    wages: Joi.object(),
    wagesTimes: Joi.number(),
    decription: Joi.string(),
    address: Joi.string(),
    state: Joi.number()
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  await adminService.update(value)
  ctx.body = {
    stat: 'OK'
  }
})
export default router
