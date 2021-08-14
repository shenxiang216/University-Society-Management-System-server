import * as Koa from 'koa'
import * as dayjs from 'dayjs'
import * as crypto from 'crypto'

/**
 * 日志中间件
 * @param ctx
 * @param next
 */
export default async function (ctx: Koa.Context, next: Koa.Next) {
  const start = Date.now()
  await next()
  const requestId = crypto.randomBytes(6).toString('hex')
  ctx.set('X-Request-Id', requestId)
  const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const info = {
    time,
    method: ctx.method,
    url: ctx.url,
    requestId,
    ip: ctx.request.ip,
    response: Date.now() - start,
    status: ctx.status
  }
  console.log(JSON.stringify(info))
}
