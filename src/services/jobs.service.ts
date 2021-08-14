import { ObjectId } from 'mongodb'
import * as db from '../db'
import { IJobs, salary } from '../types'
import { stats } from '../stats'

// 1、获取职位详情
export async function jobDetail(id: string) {
  const jobresult = await db.jobsCollection.findOne(
    {
      _id: new ObjectId(id)
    },
    { projection: { state: false } }
  )
  const ownedCompany = jobresult.ownedCompany
  const companyResult = await db.companiesCollection.findOne(
    {
      _id: new ObjectId(ownedCompany)
    },
    {
      projection: {
        companyName: true,
        companyLogo: true,
        companyIntroduce: true,
        companySize: true,
        financing: true,
        trade: true
      }
    }
  )
  const issuer = jobresult.issuer
  const issuerResult = await db.usersCollection.findOne(
    {
      _id: new ObjectId(issuer)
    },
    { projection: { nickname: true, sex: true, photo: true, position: true } }
  )
  if (jobresult === null || companyResult === null || issuerResult === null) {
    throw stats.ERR_NOT_FOUND
  }
  return {
    job: jobresult,
    company: companyResult,
    issuer: issuerResult
  }
}

// 2、相似职位
export async function similar(id: string) {
  const jobresult = await db.jobsCollection.findOne(
    {
      _id: new ObjectId(id)
    },
    { projection: { state: false } }
  )
  const str = '.*' + jobresult.title + '.*$'
  const reg = new RegExp(str)
  const result = await db.jobsCollection
    .find({
      jobName: { $regex: reg, $options: 'i' }
    })
    .limit(5)
    .toArray()
  if (result === null) throw stats.ERR_NOT_FOUND
  return result
}

// 3、按条件搜索筛选  修改
export async function search(
  jobName: string,
  city: string,
  ageLimit: number,
  education: number,
  pay: salary,
  companySize: number,
  _id?: string
) {
  let wages: salary = {
    max: 0,
    min: 0
  }
  if (pay !== null) {
    wages = pay
  }
  if (city === '全国' || city === '全国/') {
    city = ''
  }
  const start = '000000000000'
  let gt = start
  if (_id !== '') {
    gt = _id
  }
  const res: IJobs[] = []
  const res1: IJobs[] = []
  const str = '^.*' + jobName + '.*$'
  const str1 = '^.*' + city + '.*$'
  const str2 = '^.*' + ageLimit + '.*$'
  const str3 = '^.*' + education + '.*$'
  const result: IJobs[] = await db.jobsCollection
    .find({
      _id: { $gt: new ObjectId(gt) },
      title: { $regex: str }, // 职位名称
      city: { $regex: str1 }, // 所在城市
      ageLimit: { $regex: str2 }, // 经验要求
      degree: { $regex: str3 } // 学历要求
    })
    .limit(10)
    .toArray()
  // if (result === []) throw stats.ERR_NOT_FOUND
  // 筛选公司规模
  if (result !== undefined) {
    for (let i = 0; i < result.length; i++) {
      const element = result[i]

      const s = await db.companiesCollection.findOne({
        _id: new ObjectId(element.ownedCompany)
      })
      if (s !== undefined) {
        if (companySize.toString() === '') {
          res.push(element)
        } else if (s.companySize.toString() === companySize.toString()) {
          res.push(element)
        }
      }
    }
  }
  // 筛选工资
  if (res !== []) {
    for (let i = 0; i < res.length; i++) {
      const element = res[i]
      if (wages.max === 0 && wages.min === 0) {
        res1.push(element)
      } else if (
        Math.abs(wages.min - element.wages.min) <= 3 ||
        Math.abs(wages.max - element.wages.max) <= 3
      ) {
        res1.push(element)
      }
    }
  }
  if (res1 === null) throw stats.ERR_NOT_FOUND
  return res1
}

export async function loadsearch(
  jobName: string,
  city: string,
  ageLimit: number,
  education: number,
  pay: salary,
  companySize: number,
  _id?: string
) {
  let lastid = _id
  const result: IJobs[] = []
  while (result.length <= 5) {
    const newJobs = await search(
      jobName,
      city,
      ageLimit,
      education,
      pay,
      companySize,
      lastid
    )
    if (newJobs.length === 0) {
      return result
    } else lastid = newJobs[newJobs.length - 1]._id
    result.push(...newJobs)
  }
  return result.slice(0, 5)
}
