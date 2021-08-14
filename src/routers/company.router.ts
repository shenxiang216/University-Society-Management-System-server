import * as Router from 'koa-router'
import * as companyService from '../services/company.service'
import * as Joi from 'joi'
import { badParams } from '../stats'
const router = new Router({
  prefix: '/api/company'
})

// 1、根据公司Id获取公司完整信息
router.post('/detail', async ctx => {
  const schema = Joi.object({
    id: Joi.string().required()
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  const data = await companyService.findOne(value.id)
  ctx.body = {
    stat: 'OK',
    data
  }
})

// 2、根据企业id获取公司热招职位列表
router.post('/search/:_id/hotjob', async ctx => {
  const rows = await companyService.hotjobs(ctx.params._id)
  ctx.body = {
    stat: 'OK',
    rows
  }
})

// 3、获取首页热门职位、企业
router.post('/hot', async ctx => {
  const result = await companyService.getHotPositionsAndCompanys()
  ctx.body = {
    stat: 'OK',
    hotJobs: result.positions,
    hotCompanys: result.companys
  }
})

export default router
