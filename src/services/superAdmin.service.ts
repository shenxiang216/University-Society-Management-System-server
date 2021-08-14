import { ObjectId } from 'mongodb'
import * as db from '../db'
import { Status } from '../types'
import { stats } from '../stats'

// 1、列出企业，自带搜索，无搜索关键词则列出所有
export async function companyList(word: string) {
  const str = '^.*' + word + '.*$'
  const reg = new RegExp(str)
  const companys = await db.companiesCollection
    .find({
      companyName: reg
    })
    .toArray()
  if (companys === undefined) {
    throw stats.ERR_NOT_FOUND
  } else {
    return companys
  }
}

// 2、管理员禁用删除企业
export async function companyDeleteOrBan(companyId: string) {
  const result = db.companiesCollection.findOneAndUpdate(
    {
      _id: new ObjectId(companyId)
    },
    {
      $set: { state: 3 }
    }
  )
  return result
}

// 3、列出用户，自带搜索，无搜索关键词则列出所有
export async function userList(word: string) {
  const str = '^.*' + word + '.*$'
  const reg = new RegExp(str)
  const rows = await db.usersCollection
    .find({
      username: reg
    })
    .toArray()
  if (rows === undefined) {
    throw stats.ERR_NOT_FOUND
  } else {
    return rows
  }
}

// 4、用户、可用、禁用、删除
export async function userStatusChange(userId: string) {
  const user = await db.usersCollection.findOne({
    _id: new ObjectId(userId)
  })
  let status = user.state
  if (status === Status.Normal) {
    status = Status.Offline
  } else {
    status = Status.Normal
  }
  const result = await db.usersCollection.findOneAndUpdate(
    {
      _id: new ObjectId(userId)
    },
    {
      $set: { state: status }
    }
  )
  return result
}

// 5、展示 审核中企业
export async function companyCreateList() {
  const companys = await db.applycompanyCollection.find({}).toArray()
  if (companys === undefined) {
    throw stats.ERR_NOT_FOUND
  } else {
    return companys
  }
}

// 6、审核企业是否通过 待完善：拒绝的情况
export async function companyCreateAllow(companyId: string) {
  const newCompany = await db.applycompanyCollection.findOne({
    _id: new ObjectId(companyId)
  })
  newCompany.state = Status.Normal
  const result = await db.companiesCollection.insertOne(newCompany)
  const del = await db.applycompanyCollection.findOneAndDelete({
    _id: new ObjectId(companyId)
  })
  return {
    message: 'allow finish'
  }
}
