import { ObjectId } from 'mongodb'
import * as db from '../db'
import * as dayjs from 'dayjs'
import { IJobs, Status, Omit } from '../types'
import { stats } from '../stats'
import { GetXY } from '../middlewares/tools'

// 1、发布职位信息
export async function add(record: any, token: string) {
  const addresscode = await GetXY(record.address)
  const refreshTime = dayjs().format('YYYY-MM-DD')
  const issuer: ObjectId = (
    await db.tokensCollection.findOne({ userToken: token })
  ).userId
  const result = await db.usersCollection.findOne({
    _id: new ObjectId(issuer)
  })
  const ownedCompany: ObjectId = result.myCompany
  const state: Status = Status.Normal
  const newjob = {
    ...record,
    addresscode: addresscode,
    refreshTime: refreshTime,
    issuer: issuer,
    ownedCompany: ownedCompany,
    state: state
  }
  const res = db.jobsCollection.insertOne(newjob)
  return res
}

// 2、删除招聘信息
export async function remove(_id: string) {
  const result = await db.jobsCollection.findOneAndUpdate(
    {
      _id: new ObjectId(_id)
    },
    {
      $set: { state: Status.Delete }
    }
  )
  if (result === null) throw stats.ERR_NOT_FOUND
}

// 3、修改职位信息（包括上架、下架）
export async function update(record: IJobs) {
  const refreshTime = dayjs().format('YYYY-MM-DD')
  if (record.address !== undefined) {
    const addresscode = await GetXY(record.address)
  }
  const result = await db.jobsCollection.findOneAndUpdate(
    {
      _id: new ObjectId(record._id)
    },
    {
      $set: {
        city: record.city,
        ageLimit: record.ageLimit,
        degree: record.degree,
        title: record.title,
        label: record.label,
        wages: record.wages,
        wagesTimes: record.wagesTimes,
        decription: record.decription,
        address: record.address,
        state: record.state,
        addresscode: record.addresscode,
        refreshTime: record.refreshTime
      }
    }
  )
  if (result === null) throw stats.ERR_NOT_FOUND
}

// 4、我的公司 7.27完成 tsk
export async function myCompany(token: string) {
  const user = await db.tokensCollection.findOne({
    userToken: token
  })
  if (user === undefined) throw stats.ERR_LOGIN
  const userCompany = await db.usersCollection.findOne({
    _id: user.userId
  })
  const company = await db.companiesCollection.findOne({
    _id: new ObjectId(userCompany.myCompany)
  })
  return company
}

// 5、列出职位 带搜索功能 7.27增加 完成 排序未做 tsk
export async function positions(token: string, word: string) {
  const str = '^.*' + word + '.*$'
  const reg = new RegExp(str)
  const userId = await db.tokensCollection.findOne({
    userToken: token
  })
  if (userId === undefined) {
    return { message: 'no login' }
  }
  const user = await db.usersCollection.findOne({
    _id: new ObjectId(userId.userId)
  })
  const positions = await db.jobsCollection
    .find({
      issuer: new ObjectId(user._id),
      title: reg,
      state: { $ne: 3 }
    })
    .toArray()
  // 数组处理 排序
  return positions
}
