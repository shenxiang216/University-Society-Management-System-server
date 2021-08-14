import * as Koa from 'koa'
import * as koaBody from 'koa-body'

import config from './config'
import router from './router'
import logger from './middlewares/logger'
import * as db from './db'
import { ReqStat } from './stats'

const app = new Koa()
app.use(async (ctx, next) => {
  try {
    const start = Date.now()
    await next()
    const time = Date.now() - start
    ctx.set('X-Response-Time', time + 'ms')
  } catch (error) {
    if (error instanceof ReqStat) {
      ctx.status = error.statusCode || 500
      ctx.body = {
        stat: error.stat,
        message: error.msg
      }
    } else {
      console.trace(error)
      ctx.status = 500
      ctx.body = error.message
    }
  }
})
app.use(logger)
app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: config.uploadSizeLimit
    }
  })
)
app.use(router.routes())
db.connect().then(() => {
  app.listen(config.port)
  console.log(config.port)
})
