const axios = require('axios').default
const { describe, it } = require('mocha')
const { expect } = require('chai')

const { host } = require('./util')
const id = '610b412f6b64fbb6369a4783'
describe('POST /api/company/detail', () => {
  it('根据公司Id获取公司完整信息', async () => {
    const res = await axios.post(`${host}/api/company/detail`, {
      id: id
    })
    expect(res.data.stat).eq('OK')
  })
})
describe('POST /api/company/search/:_id/hotjob', () => {
  it('根据企业id获取公司热招职位列表', async () => {
    const res = await axios.post(`${host}/api/company/search/${id}/hotjob`)
    expect(res.data.stat).eq('OK')
  })
})
describe('POST /api/company/hot', () => {
  it('根据企业id获取公司热招职位列表', async () => {
    const res = await axios.post(`${host}/api/company/hot`)
    expect(res.data.stat).eq('OK')
  })
})
