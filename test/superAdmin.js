const axios = require('axios').default
const { describe, it } = require('mocha')
const { expect } = require('chai')

const { host } = require('./util')
let id
describe('POST /api/superadmin/companyList', () => {
  it('列出所有企业名单', async () => {
    const res = await axios.post(`${host}/api/superadmin/companyList`, {
      word: ''
    })
    expect(res.data.stat).eq('OK')
  })
})
describe('POST /api/superadmin/userList', () => {
  it('列出所有用户名单', async () => {
    const res = await axios.post(`${host}/api/superadmin/userList`, {
      word: ''
    })
    expect(res.data.stat).eq('OK')
  })
})
describe('POST /api/superadmin/changeUserStatus', () => {
  it('用户禁用、可用', async () => {
    const res = await axios.post(`${host}/api/superadmin/changeUserStatus`, {
      id: '610b412f6b64fbb6369a47a7'
    })
    expect(res.data.stat).eq('OK')
  })
})
describe('POST /api/superadmin/companyDeleteOrBan', () => {
  it('企业禁用、可用、删除', async () => {
    const res = await axios.post(`${host}/api/superadmin/companyDeleteOrBan`, {
      id: '610b412f6b64fbb6369a47a5'
    })
    expect(res.data.stat).eq('OK')
  })
})
describe('POST /api/superadmin/companyCreateList', () => {
  it('查看审核中的企业名单', async () => {
    const res = await axios.post(`${host}/api/superadmin/companyCreateList`)
    if (res.data !== null) {
      id = res.data.rows[0]._id
    }
    expect(res.data.stat).eq('OK')
  })
})
describe('POST /api/superadmin/examine', () => {
  it('超管通过审核创建公司请求', async () => {
    const res = await axios.post(`${host}/api/superadmin/examine`, {
      id: id
    })
    expect(res.data.stat).eq('OK')
  })
})
