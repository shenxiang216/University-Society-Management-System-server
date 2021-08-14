import * as Router from 'koa-router'
import * as companyManageService from '../services/companyManage.service'
import * as Joi from 'joi'
import { badParams } from '../stats'
import { ICompany } from '../types'
const router = new Router({
  prefix: '/api/companymanage'
})

// 1、修改企业信息
router.post('/recompany', async ctx => {
  const schema = Joi.object({
    _id: Joi.string(),
    companyName: Joi.string(),
    companyLogo: Joi.string(),
    companyIntroduce: Joi.string(),
    companyAddress: Joi.string(),
    companySize: Joi.number(),
    financing: Joi.string(),
    trade: Joi.string()
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  await companyManageService.update(value._id, value)
  ctx.body = {
    stat: 'OK'
  }
})

// 2、创建企业申请
router.post('/createCompany', async ctx => {
  const token = ctx.cookies.get('token')
  const schema = Joi.object().keys({
    companyName: Joi.string().empty('').default(''),
    companyLogo: Joi.string().empty('').default(''),
    companyIntroduce: Joi.string().empty('').default(''),
    companyAddress: Joi.string().empty('').default(''),
    companySize: Joi.number(),
    financing: Joi.string().empty('').default(''),
    trade: Joi.string().empty('').default(''),
    refreshTime: Joi.string().empty('').default(''),
    state: Joi.number().empty(1).default(1)
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  const newCompany: ICompany = {
    ...value
  }
  await companyManageService.companyCreate(token, newCompany)
  ctx.body = {
    stat: 'OK'
  }
})

// 3、根据企业id展示某个企业所有用户
router.post('/companyUsers', async ctx => {
  const schema = Joi.object({
    id: Joi.string().required()
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  const rows = await companyManageService.listUser(value.id)
  ctx.body = {
    stat: 'OK',
    rows
  }
})

// 4、boss展示他所创建的公司
router.post('/companies', async ctx => {
  const token = ctx.cookies.get('token')
  const result = await companyManageService.listCompany(token)
  ctx.body = {
    stat: 'OK',
    rows: result
  }
})

// 5、企业管理员boss添加企业用户
router.post('/addcompanyUsers', async ctx => {
  const schema = Joi.object({
    username: Joi.string().required(),
    position: Joi.string().required(),
    companyId: Joi.string().required()
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  await companyManageService.addUser(
    value.username,
    value.position,
    value.companyId
  )
  ctx.body = {
    stat: 'OK'
  }
})

// 6、企业管理员boss删除企业用户
router.post('/deleteCompanyUser', async ctx => {
  const schema = Joi.object({
    id: Joi.string().required()
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  await companyManageService.deteleUser(value.id)
  ctx.body = {
    stat: 'OK'
  }
})

export default router
