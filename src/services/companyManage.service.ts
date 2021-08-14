import { ObjectId } from 'mongodb'
import * as db from '../db'
import * as dayjs from 'dayjs'
import { ICompany } from '../types'
import { stats, Status } from '../stats'

// 1、修改企业信息
export async function update(id: string, record: ICompany) {
  const refreshTime = dayjs().format('YYYY-MM-DD')
  record.refreshTime = refreshTime
  const result = await db.companiesCollection.findOneAndUpdate(
    {
      _id: new ObjectId(id)
    },
    {
      $set: {
        companyName: record.companyName,
        companyLogo: record.companyLogo,
        companyIntroduce: record.companyIntroduce,
        companyAddress: record.companyAddress,
        companySize: record.companySize,
        financing: record.financing,
        trade: record.trade,
        refreshTime: refreshTime
      }
    }
  )
  if (result === null) throw stats.ERR_NOT_FOUND
}

// 2、申请企业接口   修改
export async function companyCreate(token: string, newCompany: ICompany) {
  const bossId: ObjectId = (
    await db.tokensCollection.findOne({ userToken: token })
  ).userId
  newCompany.bossId = bossId
  newCompany.state = 2
  newCompany.refreshTime = dayjs().format('YYYY-MM-DD')
  const isEsist = await db.companiesCollection.findOne({
    companyName: newCompany.companyName
  })
  if (isEsist !== undefined) {
    throw stats.ERR_EXISTS
  }
  const result = await db.applycompanyCollection.insertOne(newCompany)
  return result
}

// 3、boss展示公司员工
export async function listUser(companyId: string) {
  const result = await db.usersCollection
    .find({ myCompany: new ObjectId(companyId) })
    .toArray()
  return result
}

// 4、boss展示他所管理的公司
export async function listCompany(token: string) {
  const user = await db.tokensCollection.findOne({
    userToken: token
  })
  if (user === undefined) {
    return { message: 'no login' }
  }
  const result = await db.companiesCollection
    .find({ bossId: new ObjectId(user.userId) })
    .toArray()
  return result
}

// 5、企业管理员boss添加企业用户 tsk
export async function addUser(
  username: string,
  position: string,
  company: string
) {
  const result = await db.usersCollection.findOne({
    username: username
  })
  if (result === undefined) throw stats.ERR_NOT_FOUND
  if (result.myCompany !== null) {
    throw stats.ERR_EXISTS
  }
  const add = await db.usersCollection.findOneAndUpdate(
    {
      _id: result._id
    },
    {
      $set: { myCompany: new ObjectId(company), position: position }
    }
  )
}

// 6、企业管理员boss删除企业用户 tsk
export async function deteleUser(id: string) {
  await db.usersCollection.findOneAndUpdate(
    {
      _id: new ObjectId(id)
    },
    {
      $set: { myCompany: null }
    }
  )
}
