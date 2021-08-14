import { ObjectId } from 'mongodb'
import * as db from '../db'
import { stats } from '../stats'

// 1、根据公司Id获取公司完整信息
export async function findOne(id: string) {
  const companyResult = await db.companiesCollection.findOne(
    {
      _id: new ObjectId(id)
    },
    {
      projection: {
        state: false,
        bossId: false
      }
    }
  )
  const jobsCount = await db.jobsCollection
    .find({
      ownedCompany: id
    })
    .count()
  if (companyResult === null) throw stats.ERR_NOT_FOUND
  return {
    companyResult: companyResult,
    jobsCount: jobsCount
  }
}

// 2、获取热招职位 tsk 超管决定
export async function getHotPositionsAndCompanys() {
  const positions = await db.hotjobsuserCollection.find({}).toArray()
  const companys = await db.hotcompaniesCollection.find({}).toArray()
  if (positions === null || companys === null) {
    throw stats.ERR_NOT_FOUND
  } else {
    return {
      positions,
      companys
    }
  }
}

// 3、根据企业id获取公司热招职位列表
export async function hotjobs(_id: string) {
  const result = await db.jobsCollection
    .find({
      ownedCompany: _id
    })
    .toArray()
  return result
}
