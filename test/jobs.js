const axios = require('axios').default
const { describe, it } = require('mocha')
const { expect } = require('chai')

const { host } = require('./util')
describe('POST /api/jobs/jobdetail', () => {
  it('获取职位详情', async () => {
    const res = await axios.post(`${host}/api/jobs/jobdetail`, {
      id: '610f66351f7a125d59282150'
    })
    expect(res.data.stat).eq('OK')
  })
})

describe('POST /api/jobs/similar', () => {
  it('相似职位', async () => {
    const res = await axios.post(`${host}/api/jobs/similar`, {
      id: '610f66351f7a125d59282150'
    })
    expect(res.data.stat).eq('OK')
  })
})

describe('POST /api/jobs/search', () => {
  it('搜索职位  按条件搜索筛选', async () => {
    const res = await axios.post(`${host}/api/jobs/search`)
    expect(res.data.stat).eq('OK')
  })
})
