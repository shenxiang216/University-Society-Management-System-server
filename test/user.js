const axios = require('axios').default
const { describe, it } = require('mocha')
const { expect } = require('chai')

const { host } = require('./util')
let cookie
describe('POST /api/user/login', () => {
  it('登陆', async () => {
    const res = await axios.post(`${host}/api/user/login`, {
      username: 'boss',
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
describe('POST /api/user/userinfo', () => {
  it('获取用户信息', async () => {
    const res = await axios.post(
      `${host}/api/user/userinfo`,
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
describe('POST /api/user/info', () => {
  it('管理端获取用户信息', async () => {
    const res = await axios.post(
      `${host}/api/user/info`,
      {
        username: '201821094067'
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
describe('POST /api/user/settings/password', () => {
  it('用户修改密码', async () => {
    await axios.post(
      `${host}/api/user/settings/password`,
      {
        oldPassword: '123456',
        newPassword: '1234567'
      },
      {
        headers: {
          cookie: cookie
        }
      }
    )
    const res = await axios.post(
      `${host}/api/user/settings/password`,
      {
        oldPassword: '1234567',
        newPassword: '123456'
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
describe('POST /api/user/addinterest', () => {
  it('添加兴趣', async () => {
    const res = await axios.post(
      `${host}/api/user/addinterest`,
      { id: '610b412f6b64fbb6369a4787' },
      {
        headers: {
          cookie: cookie
        }
      }
    )
    expect(res.data.stat).eq('OK')
  })
})
describe('POST /api/user/findinterest', () => {
  it('查看兴趣', async () => {
    const res = await axios.post(
      `${host}/api/user/findinterest`,
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
describe('POST /api/user/deleteinterest', () => {
  it('删除兴趣', async () => {
    const res = await axios.post(
      `${host}/api/user/deleteinterest`,
      { id: '610b412f6b64fbb6369a4787' },
      {
        headers: {
          cookie: cookie
        }
      }
    )
    expect(res.data.stat).eq('OK')
  })
})
describe('POST /api/user/exit', () => {
  it('退出登陆', async () => {
    const res = await axios.post(
      `${host}/api/user/exit`,
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
