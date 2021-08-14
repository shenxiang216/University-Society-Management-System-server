import * as Router from 'koa-router'
import { File } from 'formidable'

import * as fileService from '../services/file.service'

const router = new Router({
  prefix: '/api/file'
})

/**
 * FormData文件上传
 */
router.post('/upload', async ctx => {
  const token = ctx.cookies.get('token')
  const file = Object.values(ctx.request.files)[0] as File
  const key = await fileService.upload(file.path, file.size, file.name, token)
  ctx.body = {
    stat: 'OK',
    data: key
  }
})

/**
 * 根据key下载文件
 */
router.get('/download/:key', async ctx => {
  const key = ctx.params.key
  const file = await fileService.find(key)
  ctx.set('Content-Type', 'application/octet-stream')
  ctx.res.setHeader(
    'Content-Disposition',
    'attachment; filename=' + encodeURIComponent(file.name)
  )
  ctx.body = file.data.buffer
})

export default router
