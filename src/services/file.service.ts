import * as fs from 'fs'
import { Binary, Long } from 'mongodb'
import * as crypto from 'crypto'
import { stats } from '../stats'
import * as db from '../db'

/** 功能函数 获取登录信息 */
async function hasLogin(token: string) {
  const tokens = await db.tokensCollection.findOne({
    userToken: token
  })
  if (tokens != null) {
    const user = await db.usersCollection.findOne({
      _id: tokens.userId
    })
    return user
  }
  return null
}
/**
 * 文件上传，将二进制小文件保存到mongodb数据库中
 * @param req
 * @param name
 * @returns
 */
export async function upload(
  file: string,
  size: number,
  name: string,
  token: string
) {
  const key = crypto.randomBytes(16).toString('hex')
  const data = await fs.promises.readFile(file)
  await db.fileCollection.insertOne({
    key,
    name,
    data: new Binary(data),
    size,
    createdAt: Long.fromNumber(Date.now())
  })
  await fs.promises.unlink(file)
  const user = await hasLogin(token)
  if (user != null) {
    await db.usersCollection.updateOne(
      {
        _id: user._id
      },
      { $set: { photo: key } }
    )
  }
  return key
}

/**
 * 查找文件
 * @param key
 * @returns
 */
export async function find(key: string) {
  const result = await db.fileCollection.findOne({
    key
  })
  if (!result) throw stats.ERR_NOT_FOUND
  return result
}
