import * as Router from 'koa-router'
import * as superAdminService from '../services/superAdmin.service'
import * as Joi from 'joi'
import { badParams } from '../stats'
const router = new Router({
  prefix: '/api/superadmin'
})

// 1、列出所有企业名单
router.post('/companyList', async ctx => {
  const schema = Joi.object({
    word: Joi.string().empty('').default('')
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  const rows = await superAdminService.companyList(value.word)
  ctx.body = {
    stat: 'OK',
    rows
  }
})

// 2、列出所有用户名单
router.post('/userList', async ctx => {
  const schema = Joi.object({
    word: Joi.string().empty('').default('')
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  const rows = await superAdminService.userList(value.word)
  ctx.body = {
    stat: 'OK',
    rows
  }
})
// 3、用户禁用、可用
router.post('/changeUserStatus', async ctx => {
  const schema = Joi.object({
    id: Joi.string().empty('').default('')
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  await superAdminService.userStatusChange(value.id)
  ctx.body = {
    stat: 'OK'
  }
})

// 4、企业禁用、可用、删除
router.post('/companyDeleteOrBan', async ctx => {
  const schema = Joi.object({
    id: Joi.string().empty('').default('')
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  const result = await superAdminService.companyDeleteOrBan(value.id)
  ctx.body = {
    stat: 'OK'
  }
})

// 5、查看审核中的企业名单
router.post('/companyCreateList', async ctx => {
  const rows = await superAdminService.companyCreateList()
  ctx.body = {
    stat: 'OK',
    rows
  }
})

// 6、超管通过审核创建公司请求     未通过的情况？
router.post('/examine', async ctx => {
  const schema = Joi.object({
    id: Joi.string().empty('').default('')
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  await superAdminService.companyCreateAllow(value.id)
  ctx.body = {
    stat: 'OK'
  }
})

export default router
