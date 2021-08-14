const axios = require('axios').default
const { describe, it } = require('mocha')
const { expect } = require('chai')

const { host } = require('./util')
let cookie
describe('POST /api/user/login', () => {
  it('登陆', async () => {
    const res = await axios.post(`${host}/api/user/login`, {
      username: 'root',
      password: '123456'
    })
    const cookies = String(res.headers['set-cookie'])
    const arrCookie = cookies.split('; ')
    for (const i of arrCookie) {
      const arr = i.split('=')
      if (arr[0] === 'token') cookie = i
    }
    expect(res.data.stat).eq('OK')
  })
})
describe('POST /api/companymanage/recompany', () => {
  it('修改企业信息', async () => {
    const res = await axios.post(`${host}/api/companymanage/recompany`, {
      _id: '610f7c887454070ae797067d',
      companyLogo: 'dbbs',
      companyName: 'dsbbd',
      companyAddress: '湖北武汉',
      companySize: 5,
      financing: '天使',
      trade: '互联网',
      companyIntroduce: 'brdbdrbrdb'
    })
    expect(res.data.stat).eq('OK')
  })
})
describe('POST /api/companymanage/createCompany', () => {
  it('创建企业申请', async () => {
    const res = await axios.post(
      `${host}/api/companymanage/createCompany`,
      {
        companyLogo: 'dbbssssss',
        companyName: 'dsbbdasas',
        companyIntroduce: 'brdbdrbrdb',
        companyAddress: '湖北武汉',
        companySize: 5,
        financing: '天使',
        trade: '互联网',
        refreshTime: '2021-08-08',
        state: 2
      },
      {
        headers: {
          cookie: cookie
        }
      }
    )
    expect(res.data.stat).eq('OK')
  })
})
describe('POST /api/companymanage/companyUsers', () => {
  it('根据企业id展示某个企业所有用户', async () => {
    const res = await axios.post(`${host}/api/companymanage/companyUsers`, {
      id: '610b412f6b64fbb6369a4783'
    })
    expect(res.data.stat).eq('OK')
  })
})
describe('POST /api/companymanage/companies', () => {
  it('boss展示他所创建的公司', async () => {
    const res = await axios.post(
      `${host}/api/companymanage/companies`,
      {},
      {
        headers: {
          cookie: cookie
        }
      }
    )
    expect(res.data.stat).eq('OK')
  })
})
describe('POST /api/companymanage/addcompanyUsers', () => {
  it('企业管理员boss添加企业用户', async () => {
    const res = await axios.post(`${host}/api/companymanage/addcompanyUsers`, {
      username: '201821094067',
      position: '金山小迷弟',
      companyId: '610b412f6b64fbb6369a4783'
    })
    expect(res.data.stat).eq('OK')
  })
})
describe('POST /api/companymanage/deleteCompanyUser', () => {
  it('企业管理员boss删除企业用户', async () => {
    const res = await axios.post(
      `${host}/api/companymanage/deleteCompanyUser`,
      {
        id: '610ec26c87a383c020468718'
      }
    )
    expect(res.data.stat).eq('OK')
  })
})
