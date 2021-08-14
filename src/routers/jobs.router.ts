import * as Router from 'koa-router'
import * as jobsService from '../services/jobs.service'
import * as Joi from 'joi'
import { badParams } from '../stats'
const router = new Router({
  prefix: '/api/jobs'
})

// 1、获取职位详情
router.post('/jobdetail', async ctx => {
  const schema = Joi.object({
    id: Joi.string().required()
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  const data = await jobsService.jobDetail(value.id)
  ctx.body = {
    stat: 'OK',
    data
  }
})
// 2、相似职位
router.post('/similar', async ctx => {
  const schema = Joi.object({
    id: Joi.string().required()
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  const rows = await jobsService.similar(value.id)
  ctx.body = {
    stat: 'OK',
    rows
  }
})

// 3、搜索职位  按条件搜索筛选
router.post('/search', async ctx => {
  const schema = Joi.object({
    // 用到了empty
    jobName: Joi.string().empty('').default(''),
    city: Joi.string().empty('').default(''),
    ageLimit: Joi.number().empty('').default(''),
    degree: Joi.number().empty('').default(''),
    wages: Joi.object()
      .keys({
        min: Joi.number().empty(['', 0]).default(0),
        max: Joi.number().empty(['', 0]).default(0)
      })
      .empty({})
      .default({ min: 0, max: 0 }),
    companySize: Joi.number().empty('').default(''),
    _id: Joi.string().empty('').default('')
  })
  const { value, error } = schema.validate(ctx.request.body)
  if (error) throw badParams(error.message)
  const rows = await jobsService.loadsearch(
    value.jobName,
    value.city,
    value.ageLimit,
    value.degree,
    value.wages,
    value.companySize,
    value._id
  )
  ctx.body = {
    stat: 'OK',
    rows
  }
})
export default router
