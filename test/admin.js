const axios = require('axios').default
const { describe, it } = require('mocha')
const { expect } = require('chai')

const { host } = require('./util')
let cookie
let _id
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

describe('POST /api/admin/myCompany', () => {
  it('管理端我的公司', async () => {
    const res = await axios.post(
      `${host}/api/admin/myCompany`,
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
describe('POST /api/admin/positions', () => {
  it('管理端我的职位', async () => {
    const res = await axios.post(
      `${host}/api/admin/positions`,
      {
        word: ''
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
describe('POST /api/admin/addjob', () => {
  it('发布职位信息', async () => {
    const res = await axios.post(
      `${host}/api/admin/addjob`,
      {
        city: '藤县',
        ageLimit: 1,
        degree: 1,
        title: 'JAVA开发员',
        label: ['1年以内', '大专', '视觉设计', '移动端'],
        wages: {
          min: 7,
          max: 12
        },
        wagesTimes: '16',
        decription:
          '岗位职责：<br/>1、负责日常所有平面类型需求；<br/>2、具有品牌意识与创意思维，有一定移动端及线上应用的经验，或者有一定线下传播资料的排版设计<br/>3、负责线下全新创意海报、全套VI册设计、线下宣传册<br/>4、负责品牌营销设计，IP品牌及大型活动logo全套规范、自有品牌VI及包装<br/>任职资格：<br/>1、视觉设计、平面设计、动漫等相关设计专业，大专及以上学历，职业规划品牌设计方向； <br/>2、1年以上同岗位设计经验，擅长PS、AI等设计软件, 对手绘或动画有一定了解程度；<br/>3、热爱设计，对线下印刷品、包装有所了解.<br/>【我们提供的】<br/>*一份业界良心的薪资福利<br/>* 年终奖金--年前发放<br/>* 双休、上班时间--弹性<br/>* 五险一金、带薪休假<br/>* 办公环境，舒适温馨<br/>* 健康保障，定期体检<br/>* 部门团建，年度outing<br/>* 各种创意节日礼品、生日礼品<br/>* 完备的晋升通道<br/>【我们在等你 】<br/>我们拥有强大的设计师团队和优秀的合作伙伴，<br/>欢迎优秀的你来全速，<br/>一起创造更多的设计价值。',
        address: '湖北省武汉市洪山区中南民族大学',
        state: 1
      },
      {
        headers: {
          cookie: cookie
        }
      }
    )
    _id = res.data.data.insertedId
    expect(res.data.stat).eq('OK')
  })
})

describe('POST /api/admin/rejob', () => {
  it('修改职位信息', async () => {
    const res = await axios.post(
      `${host}/api/admin/rejob`,
      {
        _id: _id,
        city: '藤县',
        ageLimit: 1,
        degree: 1,
        title: 'JAVA开发员',
        label: ['1年以内', '大专', '视觉设计', '移动端'],
        wages: {
          min: 7,
          max: 12
        },
        wagesTimes: '16',
        decription:
          '岗位职责：<br/>1、负责日常所有平面类型需求；<br/>2、具有品牌意识与创意思维，有一定移动端及线上应用的经验，或者有一定线下传播资料的排版设计<br/>3、负责线下全新创意海报、全套VI册设计、线下宣传册<br/>4、负责品牌营销设计，IP品牌及大型活动logo全套规范、自有品牌VI及包装<br/>任职资格：<br/>1、视觉设计、平面设计、动漫等相关设计专业，大专及以上学历，职业规划品牌设计方向； <br/>2、1年以上同岗位设计经验，擅长PS、AI等设计软件, 对手绘或动画有一定了解程度；<br/>3、热爱设计，对线下印刷品、包装有所了解.<br/>【我们提供的】<br/>*一份业界良心的薪资福利<br/>* 年终奖金--年前发放<br/>* 双休、上班时间--弹性<br/>* 五险一金、带薪休假<br/>* 办公环境，舒适温馨<br/>* 健康保障，定期体检<br/>* 部门团建，年度outing<br/>* 各种创意节日礼品、生日礼品<br/>* 完备的晋升通道<br/>【我们在等你 】<br/>我们拥有强大的设计师团队和优秀的合作伙伴，<br/>欢迎优秀的你来全速，<br/>一起创造更多的设计价值。',
        address: '湖北省武汉市洪山区中南民族大学',
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

describe('POST /api/admin/deletejob', () => {
  it('删除招聘信息', async () => {
    const res = await axios.post(
      `${host}/api/admin/deletejob`,
      {
        _id: _id
      },
      {
        headers: {
          cookie: cookie
        }
      }
    )
    console.log(_id)
    expect(res.data.stat).eq('OK')
  })
})
